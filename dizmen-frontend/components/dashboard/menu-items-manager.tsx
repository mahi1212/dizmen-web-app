'use client';

import { useState, Suspense, lazy, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Check, ChevronsUpDown, Filter } from 'lucide-react';
import { mockMenuItems, mockMenus, mockReviews } from '@/lib/mock-data';
import { MenuItem, Review } from '@/lib/types';
import { isMenuAvailableNow } from '@/lib/helpers';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';
import EditItemDialog from '@/components/dashboard/modals/edit-item-dialog';
import MoveItemDialog from '@/components/dashboard/modals/move-item-dialog';
import DeleteItemDialog from '@/components/dashboard/modals/delete-item-dialog';
import AdminMenuItemCard from './cards/admin-menu-item-card';

const ItemDetailDialog = lazy(() => import('@/components/dashboard/modals/item-detail-dialog'));

interface MenuItemsManagerProps {
  filterByMenuId?: string; // Optional: filter items by specific menu
  hideFilter?: boolean; // Optional: hide the menu filter combobox
  hideHeader?: boolean; // Optional: hide the header section
  onItemsChange?: (items: MenuItem[]) => void; // Optional: callback when items change
}

export default function MenuItemsManager({ 
  filterByMenuId, 
  hideFilter = false, 
  hideHeader = false,
  onItemsChange 
}: MenuItemsManagerProps = {}) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [menus] = useState(mockMenus);
  const [reviews] = useState<Review[]>(mockReviews);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<MenuItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [movingItem, setMovingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  const [targetMenuId, setTargetMenuId] = useState<string>('');
  const [selectedMenuFilter, setSelectedMenuFilter] = useState<string>(filterByMenuId || 'all');
  const [open, setOpen] = useState(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    menuId: '',
    images: [''] as string[],
  });

  // Update filter when filterByMenuId prop changes
  useEffect(() => {
    if (filterByMenuId) {
      setSelectedMenuFilter(filterByMenuId);
    }
  }, [filterByMenuId]);

  // Notify parent when items change
  useEffect(() => {
    if (onItemsChange) {
      const filtered = filterByMenuId 
        ? menuItems.filter(item => item.menuId === filterByMenuId)
        : menuItems;
      onItemsChange(filtered);
    }
  }, [menuItems, filterByMenuId, onItemsChange]);

  // Scroll reveal effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in', 'fade-in-0', 'slide-in-from-bottom-4');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [menuItems, selectedMenuFilter]);

  // Filter items by selected menu or prop
  const filteredItems = filterByMenuId 
    ? menuItems.filter(item => item.menuId === filterByMenuId)
    : selectedMenuFilter === 'all' 
      ? menuItems 
      : menuItems.filter(item => item.menuId === selectedMenuFilter);

  const handleToggleAvailability = (itemId: string) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
    const item = menuItems.find(i => i.id === itemId);
    if (item) {
      toast.success(
        item.isAvailable ? `${item.name} is now hidden` : `${item.name} is now available`,
        { description: 'Item visibility updated' }
      );
    }
  };

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        category: item.category,
        menuId: item.menuId,
        images: item.images.length > 0 ? item.images : [''],
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        menuId: filterByMenuId || menus[0]?.id || '',
        images: [''],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const validImages = formData.images.filter(img => img.trim() !== '');
    
    const newItem: MenuItem = {
      id: editingItem?.id || `item-${Date.now()}`,
      restaurantId: 'rest-1',
      menuId: formData.menuId,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      images: validImages,
      isAvailable: editingItem?.isAvailable ?? true,
      createdAt: editingItem?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (editingItem) {
      setMenuItems(items =>
        items.map(item => (item.id === editingItem.id ? newItem : item))
      );
      toast.success('Menu item updated', {
        description: `${newItem.name} has been updated successfully`,
      });
    } else {
      setMenuItems(items => [...items, newItem]);
      toast.success('Menu item created', {
        description: `${newItem.name} has been added to your menu`,
      });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (item: MenuItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingItem) return;
    
    setMenuItems(items => items.filter(i => i.id !== deletingItem.id));
    toast.success('Menu item deleted', {
      description: `${deletingItem.name} has been removed from your menu`,
    });
    
    setIsDeleteDialogOpen(false);
    setDeletingItem(null);
  };

  const handleMoveFromDeleteDialog = () => {
    if (deletingItem) {
      setIsDeleteDialogOpen(false);
      handleOpenMoveDialog(deletingItem);
      setDeletingItem(null);
    }
  };

  const handleOpenMoveDialog = (item: MenuItem) => {
    setMovingItem(item);
    setTargetMenuId(item.menuId);
    setIsMoveDialogOpen(true);
  };

  const handleItemClick = (item: MenuItem) => {
    setPreviewItem(item);
    setCurrentImageIndex(0);
    setIsPreviewDialogOpen(true);
  };

  const nextImage = () => {
    if (previewItem && previewItem.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % previewItem.images.length);
    }
  };

  const prevImage = () => {
    if (previewItem && previewItem.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? previewItem.images.length - 1 : prev - 1
      );
    }
  };

  const getItemReviews = (itemId: string) => {
    return reviews.filter(r => r.menuItemId === itemId);
  };

  const handleMoveItem = () => {
    if (!movingItem || !targetMenuId) return;
    
    const targetMenu = menus.find(m => m.id === targetMenuId);
    const sourceMenu = menus.find(m => m.id === movingItem.menuId);
    
    setMenuItems(items =>
      items.map(item =>
        item.id === movingItem.id ? { ...item, menuId: targetMenuId } : item
      )
    );
    
    toast.success('Item moved successfully', {
      description: `${movingItem.name} moved from ${sourceMenu?.name} to ${targetMenu?.name}`,
    });
    
    setIsMoveDialogOpen(false);
    setMovingItem(null);
    setTargetMenuId('');
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ''],
    });
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      setFormData({
        ...formData,
        images: formData.images.filter((_, i) => i !== index),
      });
    }
  };

  const updateImageField = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const getMenuName = (menuId: string) => {
    return menus.find(m => m.id === menuId)?.name || 'Unknown Menu';
  };

  const getMenu = (menuId: string) => {
    return menus.find(m => m.id === menuId);
  };

  const selectedMenu = getMenu(formData.menuId);

  return (
    <div className="space-y-4">
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
            <p className="text-gray-500">Manage items - time is inherited from menu</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Menu Filter Combobox */}
            {!hideFilter && !filterByMenuId && (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full sm:w-[200px] justify-between"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedMenuFilter === 'all'
                      ? 'All Menus'
                      : menus.find((menu) => menu.id === selectedMenuFilter)?.name}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search menu..." />
                    <CommandList>
                      <CommandEmpty>No menu found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            setSelectedMenuFilter('all');
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedMenuFilter === 'all' ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                          All Menus ({menuItems.length})
                        </CommandItem>
                        {menus.map((menu) => (
                          <CommandItem
                            key={menu.id}
                            value={menu.id}
                            onSelect={(currentValue) => {
                              setSelectedMenuFilter(currentValue);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedMenuFilter === menu.id ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            {menu.icon} {menu.name} ({menuItems.filter(item => item.menuId === menu.id).length})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
            
            <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, index) => {
          const menu = getMenu(item.menuId);
          return (
            <div 
              key={item.id} 
              ref={(el) => { itemRefs.current[index] = el; }}
              className="relative opacity-0 transition-all duration-500"
            >
              <AdminMenuItemCard
                item={item}
                menu={menu}
                onToggleAvailability={handleToggleAvailability}
                onEdit={handleOpenDialog}
                onDelete={handleDelete}
                onMove={handleOpenMoveDialog}
                onClick={handleItemClick}
              />
              {menu && (
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {menu.icon} {getMenuName(item.menuId)}
                  </Badge>
                  {menu.timeRanges && menu.timeRanges.length > 0 && (
                    <Badge 
                      variant={isMenuAvailableNow(menu) ? 'default' : 'secondary'} 
                      className="text-xs"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {isMenuAvailableNow(menu) ? 'Now' : 'Not now'}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">
              {selectedMenuFilter === 'all' 
                ? 'No menu items yet' 
                : `No items in ${menus.find(m => m.id === selectedMenuFilter)?.name}`}
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              {selectedMenuFilter === 'all' ? 'Add Your First Item' : 'Add Item to This Menu'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Item Dialog */}
      <EditItemDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        menus={menus}
        selectedMenu={selectedMenu}
        addImageField={addImageField}
        removeImageField={removeImageField}
        updateImageField={updateImageField}
        isEditing={!!editingItem}
      />

      {/* Move Item Dialog */}
      <MoveItemDialog
        isOpen={isMoveDialogOpen}
        onClose={() => setIsMoveDialogOpen(false)}
        onMove={handleMoveItem}
        itemName={movingItem?.name || ''}
        currentMenuId={movingItem?.menuId || ''}
        targetMenuId={targetMenuId}
        setTargetMenuId={setTargetMenuId}
        menus={menus}
      />

      {/* Delete Item Dialog */}
      <DeleteItemDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingItem(null);
        }}
        onDelete={handleDeleteConfirm}
        onMoveInstead={handleMoveFromDeleteDialog}
        item={deletingItem}
        menu={menus.find(m => m.id === deletingItem?.menuId)}
        reviewCount={deletingItem ? reviews.filter(r => r.menuItemId === deletingItem.id).length : 0}
      />

      {/* Customer Preview Dialog */}
      {isPreviewDialogOpen && previewItem && (
        <Suspense fallback={<div />}>
          <ItemDetailDialog
            item={previewItem}
            isOpen={isPreviewDialogOpen}
            onClose={() => {
              setIsPreviewDialogOpen(false);
              setPreviewItem(null);
            }}
            currentImageIndex={currentImageIndex}
            onNextImage={nextImage}
            onPrevImage={prevImage}
            reviews={getItemReviews(previewItem.id)}
            onWriteReview={() => {}}
          />
        </Suspense>
      )}
    </div>
  );
}
