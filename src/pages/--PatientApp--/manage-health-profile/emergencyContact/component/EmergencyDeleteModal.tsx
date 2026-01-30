import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useDeleteData from "@/hooks/useDeleteData";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EmergencyDeleteModal({
  isOpen,
  onClose,
  onSuccess,
  emergencyId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  emergencyId: string;
}) {
  const { mutateAsync: deleteSymptoms, isPending } = useDeleteData([
    "delete-emergency",
  ]);
  const handleDelete = async () => {
    try {
      await deleteSymptoms(`${apiRoutes.updateEmegencyContact(emergencyId)}`);
      toast.success("Emergency contact deleted successfully.");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
    onSuccess();
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md p-9 rounded-2xl">
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
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-40 h-20 rounded-full flex items-center justify-center">
            <img
              src="/../icons/delete-red-color-icon.svg"
              className="w-fit h-fit "
            />
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black font-mona">
              Delete Emergency Contact?
            </DialogTitle>
          </DialogHeader>

          <p className="text-[#000000] text-base leading-relaxed font-mona">
            This person will no longer be listed as your emergency contact.{" "}
          </p>

          <DialogFooter className="w-fit flex items-center justify-center gap-6 pt-2 ">
            <button
              type="button"
              className="w-fit h-fit px-10 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </button>

            <button
              className="flex items-center justify-center w-fit h-fit px-10 py-4 bg-[#FF5A54] text-[#212121] rounded-xl 
                  shadow-none hover:bg-[#FF5A54] active:bg-[#FF5A54] cursor-pointer font-mona"
              onClick={handleDelete}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
