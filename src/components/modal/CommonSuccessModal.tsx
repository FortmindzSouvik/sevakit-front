import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect } from "react";

export default function CommonSuccessModal({
  isOpen,
  onClose,
  icon,
  title,
  desc,
  autoCloseAfter=3000,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  icon?: string;
  desc?: string;
  autoCloseAfter?: number;
}) {
 useEffect(() => {
   if (!isOpen || !autoCloseAfter) return;

   const timer = setTimeout(() => {
     onClose();
   }, autoCloseAfter);

   return () => clearTimeout(timer);
 }, [isOpen, autoCloseAfter, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md p-8 rounded-2xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Custom Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <img
            src="/../icons/cross-small-icon.svg"
            className="w-fit h-fit"
            alt="close"
          />
        </button>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-40 h-20 rounded-full flex items-center justify-center">
            <img src={icon} className="w-fit h-fit" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black font-mona">
              {title}
            </DialogTitle>
          </DialogHeader>

          <p className="text-[#000000] text-2xl font-semibold leading-relaxed font-mona ">
            {desc}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
