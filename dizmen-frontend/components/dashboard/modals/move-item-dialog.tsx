'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Menu } from '@/lib/types';

interface MoveItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onMove: () => void;
  itemName: string;
  currentMenuId: string;
  targetMenuId: string;
  setTargetMenuId: (id: string) => void;
  menus: Menu[];
}

export default function MoveItemDialog({
  isOpen,
  onClose,
  onMove,
  itemName,
  currentMenuId,
  targetMenuId,
  setTargetMenuId,
  menus,
}: MoveItemDialogProps) {
  const currentMenu = menus.find(m => m.id === currentMenuId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move Item to Different Menu</DialogTitle>
          <DialogDescription>
            Select the target menu for "{itemName}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Current Menu</Label>
            <div className="bg-gray-100 p-3 rounded-md">
              <span className="font-medium">
                {currentMenu?.icon} {currentMenu?.name}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-menu">Move to Menu</Label>
            <Select value={targetMenuId} onValueChange={setTargetMenuId}>
              <SelectTrigger id="target-menu">
                <SelectValue placeholder="Select target menu" />
              </SelectTrigger>
              <SelectContent>
                {menus.filter(m => m.isActive && m.id !== currentMenuId).map((menu) => (
                  <SelectItem key={menu.id} value={menu.id}>
                    {menu.icon} {menu.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {targetMenuId && targetMenuId !== currentMenuId && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
              <p className="text-blue-900">
                This item will inherit the time availability from the target menu.
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onMove}
            disabled={!targetMenuId || targetMenuId === currentMenuId}
          >
            Move Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

