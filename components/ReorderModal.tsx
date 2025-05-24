'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function ReorderModal({
  isOpen,
  onClose,
  contactId,
  total,
  currentIndex,
  onReorder,
}: {
  isOpen: boolean;
  onClose: () => void;
  contactId: string;
  total: number;
  currentIndex: number;
  onReorder: (id: string, newIndex: number) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-lg">Move to position</DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap justify-start gap-2 pt-2">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                onReorder(contactId, i);
                onClose();
              }}
              className={`w-9 h-9 rounded-full text-sm flex items-center justify-center border
                ${i === currentIndex
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'}
                hover:ring-2 hover:ring-blue-500 transition`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
