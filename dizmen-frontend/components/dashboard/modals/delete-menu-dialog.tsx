"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Info, MoveRight } from "lucide-react";
import { Menu } from "@/lib/types";

interface DeleteMenuDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  menu: Menu | null;
  itemCount: number;
}

export default function DeleteMenuDialog({
  isOpen,
  onClose,
  onDelete,
  menu,
  itemCount,
}: DeleteMenuDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const confirmationPhrase = "delete all my related items";
  const isConfirmed = confirmText.toLowerCase().trim() === confirmationPhrase;

  const handleClose = () => {
    setConfirmText("");
    onClose();
  };

  const handleDelete = () => {
    if (isConfirmed) {
      onDelete();
      setConfirmText("");
    }
  };

  if (!menu) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Menu
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the menu
            and all its items.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Menu Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              {menu.icon && <span className="text-2xl">{menu.icon}</span>}
              <div>
                <h3 className="font-semibold text-gray-900">{menu.name}</h3>
                <p className="text-sm text-gray-600">{menu.description}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-300">
              <p className="text-sm font-medium text-gray-700">
                {itemCount} {itemCount === 1 ? "item" : "items"} will be deleted
              </p>
            </div>
          </div>

          {/* Warning Message */}
          {itemCount > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="space-y-2 flex flex-col">
                  <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium text-orange-900">
                    Before you delete this menu:
                  </p>
                  </div>
                  <p className="text-sm text-gray-600">
                      Consider using the{" "}
                      <span className="font-semibold">Move</span> option to
                      transfer items to another menu instead of deleting them
                      permanently. You can move each item individually from the
                      expanded menu view or the Items tab.
                    </p>
                </div>
              </div>
            </div>
          )}

          {/* Confirmation Input */}
          <div className="space-y-3">
            <Label htmlFor="confirm-text" className="text-base font-semibold">
              Confirm Deletion
            </Label>
            <p className="text-sm text-gray-600">
              Type{" "}
              <span className="font-mono font-semibold bg-gray-100 px-2 py-1 rounded">
                {confirmationPhrase}
              </span>{" "}
              to confirm
            </p>
            <Input
              id="confirm-text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type the confirmation phrase"
              className={`${
                confirmText && !isConfirmed
                  ? "border-red-300 focus-visible:ring-red-500"
                  : isConfirmed
                  ? "border-green-300 focus-visible:ring-green-500"
                  : ""
              }`}
            />
            {confirmText && !isConfirmed && (
              <p className="text-xs text-red-600">
                Please type the exact phrase to confirm
              </p>
            )}
            {isConfirmed && (
              <p className="text-xs text-green-600 flex items-center gap-1">
                ✓ Confirmation phrase matched
              </p>
            )}
          </div>

          {/* Warning Footer */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm font-medium text-red-900">
              ⚠️ This will permanently delete:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-red-800 list-disc list-inside">
              <li>The menu "{menu.name}"</li>
              <li>
                All {itemCount} associated {itemCount === 1 ? "item" : "items"}
              </li>
              <li>All item images and details</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!isConfirmed}
            className="bg-red-600 hover:bg-red-700"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Delete Menu & Items
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
