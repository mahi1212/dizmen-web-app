'use client';

import { useState, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ChevronDown } from 'lucide-react';
import { mockMenus, mockMenuItems } from '@/lib/mock-data';
import { Menu, TimeRange, MenuItem } from '@/lib/types';
import { toast } from 'sonner';
import AddMenuDialog from '@/components/dashboard/modals/add-menu-dialog';
import QuickAddItemDialog from '@/components/dashboard/modals/quick-add-item-dialog';
import EditItemDialog from '@/components/dashboard/modals/edit-item-dialog';
import MoveItemDialog from '@/components/dashboard/modals/move-item-dialog';
import DeleteMenuDialog from '@/components/dashboard/modals/delete-menu-dialog';
import DeleteItemDialog from '@/components/dashboard/modals/delete-item-dialog';
import MenuCard from './cards/menu-card';
import AdminMenuItemCard from './cards/admin-menu-item-card';

const ItemDetailDialog = lazy(() => import('@/components/dashboard/modals/item-detail-dialog'));

export default function MenusManager() {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>(mockMenus);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQuickAddDialogOpen, setIsQuickAddDialogOpen] = useState(false);
  const [isEditItemDialogOpen, setIsEditItemDialogOpen] = useState(false);
  const [isMoveItemDialogOpen, setIsMoveItemDialogOpen] = useState(false);
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [isDeleteMenuDialogOpen, setIsDeleteMenuDialogOpen] = useState(false);
  const [isDeleteItemDialogOpen, setIsDeleteItemDialogOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<MenuItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedMenuForAdd, setSelectedMenuForAdd] = useState<Menu | null>(null);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [movingItem, setMovingItem] = useState<MenuItem | null>(null);
  const [deletingMenu, setDeletingMenu] = useState<Menu | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  const [targetMenuId, setTargetMenuId] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    isAllTime: true,
    timeRanges: [] as TimeRange[],
  });
  const [quickAddFormData, setQuickAddFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: [''] as string[],
  });
  const [itemFormData, setItemFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    menuId: '',
    images: [''] as string[],
  });

  const handleOpenDialog = (menu?: Menu) => {
    if (menu) {
      setEditingMenu(menu);
      setFormData({
        name: menu.name,
        description: menu.description,
        icon: menu.icon || '',
        isAllTime: !menu.timeRanges || menu.timeRanges.length === 0,
        timeRanges: menu.timeRanges || [],
      });
    } else {
      setEditingMenu(null);
      setFormData({
        name: '',
        description: '',
        icon: '',
        isAllTime: true,
        timeRanges: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    const newMenu: Menu = {
      id: editingMenu?.id || `menu-${Date.now()}`,
      restaurantId: 'rest-1',
      name: formData.name,
      description: formData.description,
      icon: formData.icon || undefined,
      order: editingMenu?.order || menus.length + 1,
      isActive: editingMenu?.isActive ?? true,
      timeRanges: formData.isAllTime ? undefined : (formData.timeRanges.length > 0 ? formData.timeRanges : undefined),
      createdAt: editingMenu?.createdAt || new Date(),
    };

    if (editingMenu) {
      setMenus(items =>
        items.map(menu => (menu.id === editingMenu.id ? newMenu : menu))
      );
      toast.success('Menu updated', {
        description: `${newMenu.name} has been updated successfully`,
      });
    } else {
      setMenus(items => [...items, newMenu]);
      toast.success('Menu created', {
        description: `${newMenu.name} has been added`,
      });
    }

    setIsDialogOpen(false);
  };

  const handleToggleActive = (menuId: string) => {
    setMenus(items =>
      items.map(menu =>
        menu.id === menuId ? { ...menu, isActive: !menu.isActive } : menu
      )
    );
    const menu = menus.find(m => m.id === menuId);
    if (menu) {
      toast.success(
        menu.isActive ? `${menu.name} hidden from customers` : `${menu.name} now visible`,
        { description: 'All items in this menu will be affected' }
      );
    }
  };

  const handleDeleteMenuOpen = (menuId: string) => {
    const menu = menus.find(m => m.id === menuId);
    if (menu) {
      setDeletingMenu(menu);
      setIsDeleteMenuDialogOpen(true);
    }
  };

  const handleDeleteMenu = () => {
    if (!deletingMenu) return;
    
    // Delete all items in this menu
    setMenuItems(items => items.filter(item => item.menuId !== deletingMenu.id));
    
    // Delete the menu
    setMenus(items => items.filter(m => m.id !== deletingMenu.id));
    
    const itemCount = menuItems.filter(item => item.menuId === deletingMenu.id).length;
    
    toast.success('Menu deleted successfully', {
      description: `${deletingMenu.name} and ${itemCount} ${itemCount === 1 ? 'item' : 'items'} have been removed`,
    });
    
    setIsDeleteMenuDialogOpen(false);
    setDeletingMenu(null);
  };

  const handleViewItems = (menuId: string) => {
    // Toggle expansion - collapse if already expanded, expand if collapsed
    setExpandedMenuId(expandedMenuId === menuId ? null : menuId);
  };

  const handleToggleItemAvailability = (itemId: string) => {
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

  const handleOpenQuickAddDialog = (menu: Menu) => {
    setSelectedMenuForAdd(menu);
    setQuickAddFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      images: [''],
    });
    setIsQuickAddDialogOpen(true);
  };

  const handleQuickAddItem = () => {
    if (!selectedMenuForAdd) return;

    const validImages = quickAddFormData.images.filter(img => img.trim() !== '');
    
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      restaurantId: 'rest-1',
      menuId: selectedMenuForAdd.id,
      name: quickAddFormData.name,
      description: quickAddFormData.description,
      price: parseFloat(quickAddFormData.price),
      category: quickAddFormData.category,
      images: validImages,
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setMenuItems([...menuItems, newItem]);
    toast.success('Item added successfully!', {
      description: `${newItem.name} has been added to ${selectedMenuForAdd.name}`,
    });

    setIsQuickAddDialogOpen(false);
    setSelectedMenuForAdd(null);
  };

  const addQuickImageField = () => {
    setQuickAddFormData({
      ...quickAddFormData,
      images: [...quickAddFormData.images, ''],
    });
  };

  const removeQuickImageField = (index: number) => {
    if (quickAddFormData.images.length > 1) {
      setQuickAddFormData({
        ...quickAddFormData,
        images: quickAddFormData.images.filter((_, i) => i !== index),
      });
    }
  };

  const updateQuickImageField = (index: number, value: string) => {
    const newImages = [...quickAddFormData.images];
    newImages[index] = value;
    setQuickAddFormData({ ...quickAddFormData, images: newImages });
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setItemFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      menuId: item.menuId,
      images: item.images.length > 0 ? item.images : [''],
    });
    setIsEditItemDialogOpen(true);
  };

  const handleSaveEditItem = () => {
    if (!editingItem) return;

    const validImages = itemFormData.images.filter(img => img.trim() !== '');
    
    const updatedItem: MenuItem = {
      ...editingItem,
      name: itemFormData.name,
      description: itemFormData.description,
      price: parseFloat(itemFormData.price),
      category: itemFormData.category,
      menuId: itemFormData.menuId,
      images: validImages,
      updatedAt: new Date(),
    };

    setMenuItems(items =>
      items.map(item => (item.id === editingItem.id ? updatedItem : item))
    );

    toast.success('Item updated successfully!', {
      description: `${updatedItem.name} has been updated`,
    });

    setIsEditItemDialogOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItemOpen = (item: MenuItem) => {
    setDeletingItem(item);
    setIsDeleteItemDialogOpen(true);
  };

  const handleDeleteItem = () => {
    if (!deletingItem) return;
    
    setMenuItems(items => items.filter(i => i.id !== deletingItem.id));
    toast.success('Item deleted successfully', {
      description: `${deletingItem.name} has been removed from the menu`,
    });
    
    setIsDeleteItemDialogOpen(false);
    setDeletingItem(null);
  };

  const handleMoveFromDeleteDialog = () => {
    if (deletingItem) {
      setIsDeleteItemDialogOpen(false);
      handleMoveItemOpen(deletingItem);
      setDeletingItem(null);
    }
  };

  const handleMoveItemOpen = (item: MenuItem) => {
    setMovingItem(item);
    setTargetMenuId(item.menuId);
    setIsMoveItemDialogOpen(true);
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
    
    toast.success('Item moved successfully!', {
      description: `${movingItem.name} moved from ${sourceMenu?.name} to ${targetMenu?.name}`,
    });
    
    setIsMoveItemDialogOpen(false);
    setMovingItem(null);
    setTargetMenuId('');
  };

  const addItemImageField = () => {
    setItemFormData({
      ...itemFormData,
      images: [...itemFormData.images, ''],
    });
  };

  const removeItemImageField = (index: number) => {
    if (itemFormData.images.length > 1) {
      setItemFormData({
        ...itemFormData,
        images: itemFormData.images.filter((_, i) => i !== index),
      });
    }
  };

  const updateItemImageField = (index: number, value: string) => {
    const newImages = [...itemFormData.images];
    newImages[index] = value;
    setItemFormData({ ...itemFormData, images: newImages });
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


  const addTimeRange = () => {
    setFormData({
      ...formData,
      timeRanges: [...formData.timeRanges, { startTime: '09:00', endTime: '17:00' }],
    });
  };

  const removeTimeRange = (index: number) => {
    setFormData({
      ...formData,
      timeRanges: formData.timeRanges.filter((_, i) => i !== index),
    });
  };

  const updateTimeRange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newRanges = [...formData.timeRanges];
    newRanges[index][field] = value;
    setFormData({ ...formData, timeRanges: newRanges });
  };

  const getMenuItems = (menuId: string) => {
    return mockMenuItems.filter(item => item.menuId === menuId);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Menus</h2>
          <p className="text-gray-500">Organize your items into different menus with schedules</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Menu
        </Button>
      </div>

      <div className="space-y-4">
        {menus.sort((a, b) => a.order - b.order).map((menu) => {
          const itemCount = mockMenuItems.filter(item => item.menuId === menu.id).length;
          const isExpanded = expandedMenuId === menu.id;
          const menuItemsFiltered = menuItems.filter(item => item.menuId === menu.id);
          
          return (
            <MenuCard
              key={menu.id}
              menu={menu}
              itemCount={itemCount}
              isExpanded={isExpanded}
              onToggleActive={handleToggleActive}
              onToggleExpand={handleViewItems}
              onEdit={handleOpenDialog}
              onDelete={handleDeleteMenuOpen}
            >
              {/* Expanded Items Content */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium whitespace-nowrap text-gray-600">Items in {menu.icon} {menu.name}</p>
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenQuickAddDialog(menu)}
                      className="flex-shrink-0"
                    >
                      Add Item
                      <Plus className="h-3 w-3 mr-1" />
                    </Button>
                </div>
                
                {menuItemsFiltered.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="py-8 text-center">
                      <p className="text-gray-500 text-sm">No items in this menu yet</p>
                      <p className="text-gray-400 text-xs mt-1">Go to Items tab to add items</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="relative">
                    {/* Horizontal Scrollable Container */}
                    <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      <div className="flex gap-3 min-w-max">
                        {menuItemsFiltered.slice(0, 6).map((item) => (
                          <div key={item.id} className="w-[280px] sm:w-[320px] flex-shrink-0">
                            <AdminMenuItemCard
                              item={item}
                              menu={menu}
                              onToggleAvailability={handleToggleItemAvailability}
                              onEdit={handleEditItem}
                              onDelete={handleDeleteItemOpen}
                              onMove={handleMoveItemOpen}
                              onClick={handleItemClick}
                            />
                          </div>
                        ))}
                        
                        {/* See More Card */}
                        {menuItemsFiltered.length > 6 && (
                          <div className="w-[280px] sm:w-[320px] flex-shrink-0">
                            <Card 
                              className="h-full cursor-pointer hover:shadow-lg transition-all border-2 border-dashed border-orange-300 hover:border-orange-500 bg-gradient-to-br from-orange-50 to-white"
                              onClick={() => router.push(`/dashboard/menu/${menu.id}`)}
                            >
                              <CardContent className="h-full flex flex-col items-center justify-center py-12 text-center">
                                <div className="rounded-full bg-orange-100 p-4 mb-3">
                                  <ChevronDown className="h-8 w-8 text-orange-600 rotate-[-90deg]" />
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                  +{menuItemsFiltered.length - 6} More Items
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  Click to view all
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Scroll Hint Shadows */}
                    <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
                  </div>
                )}
              </div>
            </MenuCard>
          );
        })}
      </div>

      {menus.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No menus created yet</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Menu
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Menu Dialog */}
      <AddMenuDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        addTimeRange={addTimeRange}
        removeTimeRange={removeTimeRange}
        updateTimeRange={updateTimeRange}
        isEditing={!!editingMenu}
      />

      {/* Quick Add Item Dialog */}
      <QuickAddItemDialog
        isOpen={isQuickAddDialogOpen}
        onClose={() => setIsQuickAddDialogOpen(false)}
        onSave={handleQuickAddItem}
        selectedMenu={selectedMenuForAdd}
        formData={quickAddFormData}
        setFormData={setQuickAddFormData}
        addImageField={addQuickImageField}
        removeImageField={removeQuickImageField}
        updateImageField={updateQuickImageField}
      />

      {/* Edit Item Dialog */}
      <EditItemDialog
        isOpen={isEditItemDialogOpen}
        onClose={() => setIsEditItemDialogOpen(false)}
        onSave={handleSaveEditItem}
        formData={itemFormData}
        setFormData={setItemFormData}
        menus={menus}
        selectedMenu={menus.find(m => m.id === itemFormData.menuId)}
        addImageField={addItemImageField}
        removeImageField={removeItemImageField}
        updateImageField={updateItemImageField}
        isEditing={true}
      />

      {/* Move Item Dialog */}
      <MoveItemDialog
        isOpen={isMoveItemDialogOpen}
        onClose={() => setIsMoveItemDialogOpen(false)}
        onMove={handleMoveItem}
        itemName={movingItem?.name || ''}
        currentMenuId={movingItem?.menuId || ''}
        targetMenuId={targetMenuId}
        setTargetMenuId={setTargetMenuId}
        menus={menus}
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
          />
        </Suspense>
      )}

      {/* Delete Menu Dialog */}
      <DeleteMenuDialog
        isOpen={isDeleteMenuDialogOpen}
        onClose={() => {
          setIsDeleteMenuDialogOpen(false);
          setDeletingMenu(null);
        }}
        onDelete={handleDeleteMenu}
        menu={deletingMenu}
        itemCount={deletingMenu ? menuItems.filter(item => item.menuId === deletingMenu.id).length : 0}
      />

      {/* Delete Item Dialog */}
      <DeleteItemDialog
        isOpen={isDeleteItemDialogOpen}
        onClose={() => {
          setIsDeleteItemDialogOpen(false);
          setDeletingItem(null);
        }}
        onDelete={handleDeleteItem}
        onMoveInstead={handleMoveFromDeleteDialog}
        item={deletingItem}
        menu={menus.find(m => m.id === deletingItem?.menuId)}
      />
    </div>
  );
}
