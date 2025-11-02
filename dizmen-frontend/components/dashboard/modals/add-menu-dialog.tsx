'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, X } from 'lucide-react';
import { TimeRange } from '@/lib/types';

interface AddMenuDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: {
    name: string;
    description: string;
    icon: string;
    isAllTime: boolean;
    timeRanges: TimeRange[];
  };
  setFormData: (data: any) => void;
  addTimeRange: () => void;
  removeTimeRange: (index: number) => void;
  updateTimeRange: (index: number, field: 'startTime' | 'endTime', value: string) => void;
  isEditing?: boolean;
}

export default function AddMenuDialog({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  addTimeRange,
  removeTimeRange,
  updateTimeRange,
  isEditing = false,
}: AddMenuDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Menu' : 'Create New Menu'}</DialogTitle>
          <DialogDescription>
            Set up menu with time-based availability
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Menu Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Breakfast Menu"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g., Morning delights to start your day"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Icon (Emoji)</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="e.g., 🍳 or 🍽️"
              maxLength={2}
            />
            <p className="text-xs text-gray-500">
              Add an emoji to make your menu more appealing
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="all-time"
                checked={formData.isAllTime}
                onCheckedChange={(checked) => setFormData({ ...formData, isAllTime: checked })}
              />
              <Label htmlFor="all-time" className="cursor-pointer">
                Available All Time (24/7)
              </Label>
            </div>
            <p className="text-xs text-gray-500">
              {formData.isAllTime 
                ? '✅ This menu will be available 24 hours a day' 
                : '⏰ Set specific hours when this menu is available'}
            </p>
          </div>
          {!formData.isAllTime && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label>Availability Hours</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTimeRange}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Time
                </Button>
              </div>
              {formData.timeRanges.map((range, index) => (
                <div key={index} className="flex gap-2 items-center flex-wrap">
                  <Input
                    type="time"
                    value={range.startTime}
                    onChange={(e) => updateTimeRange(index, 'startTime', e.target.value)}
                    className="flex-1 min-w-[100px]"
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="time"
                    value={range.endTime}
                    onChange={(e) => updateTimeRange(index, 'endTime', e.target.value)}
                    className="flex-1 min-w-[100px]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTimeRange(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {formData.timeRanges.length === 0 && (
                <div className="text-sm text-orange-600 bg-orange-50 p-3 rounded-md border border-orange-200">
                  ⚠️ Click "Add Time" to set specific hours for this menu
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            {isEditing ? 'Update' : 'Create'} Menu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

