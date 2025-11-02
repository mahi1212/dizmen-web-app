'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { Menu } from '@/lib/types';

interface QuickAddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  selectedMenu: Menu | null;
  formData: {
    name: string;
    description: string;
    price: string;
    category: string;
    images: string[];
  };
  setFormData: (data: any) => void;
  addImageField: () => void;
  removeImageField: (index: number) => void;
  updateImageField: (index: number, value: string) => void;
}

export default function QuickAddItemDialog({
  isOpen,
  onClose,
  onSave,
  selectedMenu,
  formData,
  setFormData,
  addImageField,
  removeImageField,
  updateImageField,
}: QuickAddItemDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quick Add Item to {selectedMenu?.icon} {selectedMenu?.name}</DialogTitle>
          <DialogDescription>
            Add a new item directly to this menu
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="quick-name">Item Name *</Label>
            <Input
              id="quick-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Blueberry Pancakes"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quick-description">Description *</Label>
            <Textarea
              id="quick-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your delicious item..."
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quick-price">Price ($) *</Label>
              <Input
                id="quick-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-category">Category *</Label>
              <Input
                id="quick-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Main, Dessert"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label>Images</Label>
              <Button type="button" variant="outline" size="sm" onClick={addImageField}>
                <Plus className="h-3 w-3 mr-1" />
                Add Image
              </Button>
            </div>
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => updateImageField(index, e.target.value)}
                  placeholder="Image URL"
                  className="flex-1"
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
              Add image URLs - customers can swipe through multiple images
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

