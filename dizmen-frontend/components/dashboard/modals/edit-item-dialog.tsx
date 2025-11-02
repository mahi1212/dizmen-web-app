'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, X, ImagePlus, Info } from 'lucide-react';
import { Menu } from '@/lib/types';
import { getTimeRangeDisplay } from '@/lib/helpers';

interface EditItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: {
    name: string;
    description: string;
    price: string;
    category: string;
    menuId: string;
    images: string[];
  };
  setFormData: (data: any) => void;
  menus: Menu[];
  selectedMenu: Menu | undefined;
  addImageField: () => void;
  removeImageField: (index: number) => void;
  updateImageField: (index: number, value: string) => void;
  isEditing?: boolean;
}

export default function EditItemDialog({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  menus,
  selectedMenu,
  addImageField,
  removeImageField,
  updateImageField,
  isEditing = false,
}: EditItemDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          <DialogDescription>
            Item will inherit time availability from its menu
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="menuId">Menu</Label>
            <Select value={formData.menuId} onValueChange={(value) => setFormData({ ...formData, menuId: value })}>
              <SelectTrigger id="menuId">
                <SelectValue placeholder="Select a menu" />
              </SelectTrigger>
              <SelectContent>
                {menus.filter(m => m.isActive).map((menu) => (
                  <SelectItem key={menu.id} value={menu.id}>
                    {menu.icon} {menu.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedMenu && selectedMenu.timeRanges && selectedMenu.timeRanges.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900">This menu has time restrictions:</p>
                    <div className="text-blue-700 mt-1 space-y-1">
                      {selectedMenu.timeRanges.map((range, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {getTimeRangeDisplay(range)}
                        </div>
                      ))}
                    </div>
                    <p className="text-blue-600 mt-1 text-xs">
                      This item will only be visible during these hours
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Classic Burger"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your delicious item..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Main Course"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Images</Label>
              <Button type="button" variant="outline" size="sm" onClick={addImageField}>
                <ImagePlus className="h-3 w-3 mr-1" />
                Add Image
              </Button>
            </div>
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => updateImageField(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeImageField(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <p className="text-xs text-gray-500">
              Add multiple images - customers can swipe through them
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {isEditing ? 'Update' : 'Create'} Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

