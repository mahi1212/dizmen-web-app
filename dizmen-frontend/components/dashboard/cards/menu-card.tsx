"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  GripVertical,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Menu } from "@/lib/types";
import { isMenuAvailableNow, getTimeRangeDisplay } from "@/lib/helpers";
import { useRouter } from "next/navigation";

interface MenuCardProps {
  menu: Menu;
  itemCount: number;
  isExpanded: boolean;
  onToggleActive: (menuId: string) => void;
  onToggleExpand: (menuId: string) => void;
  onEdit: (menu: Menu) => void;
  onDelete: (menuId: string) => void;
  onQuickAdd?: (menu: Menu) => void;
  children?: React.ReactNode; // For expanded items content
}

export default function MenuCard({
  menu,
  itemCount,
  isExpanded,
  onToggleActive,
  onToggleExpand,
  onEdit,
  onDelete,
  onQuickAdd,
  children,
}: MenuCardProps) {
  const availableNow = isMenuAvailableNow(menu);
  const router = useRouter();
  return (
    <div className="space-y-2">
      <Card
        className={`${
          !menu.isActive ? "border-2 border-red-500" : ""
        } transition-all`}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <GripVertical className="h-5 w-5 text-gray-400 flex-shrink-0" />
              {menu.icon && (
                <span className="text-2xl flex-shrink-0">{menu.icon}</span>
              )}
              <div className="min-w-0 flex-1">
                <CardTitle className="text-lg truncate">{menu.name}</CardTitle>
                <CardDescription className="text-sm mt-1 line-clamp-2">
                  {menu.description}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={menu.isActive ? "default" : "secondary"}
              className="flex-shrink-0"
            >
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {menu.timeRanges && menu.timeRanges.length > 0 && (
            <div className="space-y-2 pb-3 border-b flex items-center justify-between">
              <Badge
                variant={availableNow ? "default" : "secondary"}
                className="text-xs"
              >
                <Clock className="h-3 w-3 mr-1" />
                {availableNow ? "Available now" : "Not available now"}
              </Badge>
              <div className="text-xs text-gray-500 space-y-1">
                {menu.timeRanges.map((range, idx) => (
                  <div key={idx} className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {getTimeRangeDisplay(range)}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={menu.isActive}
                onCheckedChange={() => onToggleActive(menu.id)}
              />
              <span className="text-sm text-gray-700">
                {menu.isActive ? "Visible Menu" : "Hidden Menu"}
              </span>
            </div>
            <div className="flex space-x-1">
              <Button
                variant={isExpanded ? "default" : "ghost"}
                size="sm"
                onClick={() => onToggleExpand(menu.id)}
                title={isExpanded ? "Hide items" : "Show items"}
              >
                
                <span className="ml-1 hidden sm:inline">
                  {isExpanded ? "Hide" : "Show Recents"}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={() => onEdit(menu)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(menu.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/dashboard/menu/${menu.id}`)}
                className="flex-shrink-0"
              >
                See all items
                <ArrowRight className="h-4 w-4" />  
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expanded Items Section - Passed as children */}
      {isExpanded && children && (
        <div className="animate-in slide-in-from-top-2">{children}</div>
      )}
    </div>
  );
}
