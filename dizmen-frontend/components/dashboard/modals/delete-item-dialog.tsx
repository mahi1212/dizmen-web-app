'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, MoveRight } from 'lucide-react';
import { MenuItem, Menu } from '@/lib/types';

interface DeleteItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onMoveInstead: () => void;
  item: MenuItem | null;
  menu: Menu | undefined;
  reviewCount?: number;
}

export default function DeleteItemDialog({
  isOpen,
  onClose,
  onDelete,
  onMoveInstead,
  item,
  menu,
  reviewCount = 0,
}: DeleteItemDialogProps) {
  const handleDelete = () => {
    onDelete();
  };

  const handleMoveInstead = () => {
    onMoveInstead();
    onClose();
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Menu Item
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Move Instead Suggestion */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  Consider moving instead of deleting
                </p>
                <p className="text-sm text-blue-800 mb-3">
                  If this item doesn't belong in the current menu, you can move it to another menu to preserve the item and its reviews.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMoveInstead}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <MoveRight className="h-4 w-4 mr-2" />
                  Move to Another Menu
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Delete Permanently
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}


