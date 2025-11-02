'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DollarSign, Edit, Trash2, MoveRight, Eye } from 'lucide-react';
import { MenuItem, Menu } from '@/lib/types';
import { formatPrice, isMenuAvailableNow } from '@/lib/helpers';

interface AdminMenuItemCardProps {
  item: MenuItem;
  menu?: Menu;
  onToggleAvailability: (itemId: string) => void;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
  onMove: (item: MenuItem) => void;
  onClick?: (item: MenuItem) => void;
}

export default function AdminMenuItemCard({
  item,
  menu,
  onToggleAvailability,
  onEdit,
  onDelete,
  onMove,
  onClick,
}: AdminMenuItemCardProps) {
  const menuAvailable = menu ? isMenuAvailableNow(menu) : false;
  const itemIsAvailable = item.isAvailable && (!menu || menuAvailable);

  return (
    <Card className={`overflow-hidden p-0 gap-0 ${!item.isAvailable ? 'border-2 border-red-500' : ''}`}>
      {item.images && item.images.length > 0 && (
        <div 
          className="relative h-48 w-full cursor-pointer hover:opacity-90 transition-opacity" 
          onClick={() => onClick?.(item)}
        >
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          {item.images.length > 1 && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              +{item.images.length - 1} more
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
            <Eye className="h-8 w-8 text-white opacity-0 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      )}
      <CardHeader className="pb-3 pt-4">
        <div className="flex justify-between items-start gap-2">
          <div 
            className="flex-1 min-w-0 cursor-pointer" 
            onClick={() => onClick?.(item)}
          >
            <CardTitle className="text-base truncate hover:text-orange-600 transition-colors">
              {item.name}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-2 mt-1">
              {item.description}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs flex-shrink-0">
            {item.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-lg font-bold text-orange-600">
            <DollarSign className="h-4 w-4" />
            {formatPrice(item.price).replace('$', '')}
          </div>
          {menu && (
            <Badge 
              variant={itemIsAvailable ? 'default' : 'secondary'} 
              className="text-xs"
            >
              {itemIsAvailable ? 'Available' : 'Not available'}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Switch
              checked={item.isAvailable}
              onCheckedChange={() => onToggleAvailability(item.id)}
            />
            <span className="text-sm text-gray-700">
              {item.isAvailable ? 'Visible' : 'Hidden'}
            </span>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMove(item)}
              title="Move to different menu"
            >
              <MoveRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item)}
              title="Edit item"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item)}
              title="Delete item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

