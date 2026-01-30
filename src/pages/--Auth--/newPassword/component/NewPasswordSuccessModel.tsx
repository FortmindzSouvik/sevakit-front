import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { ROUTES } from "@/utils/routeConstants";

const NewPasswordSuccessModel = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md p-8 rounded-2xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-40 h-20 rounded-full flex items-center justify-center">
            <img src="/../icons/correct-color-icon.svg" className="w-20 h-20" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black font-mona">
              Password Reset Successfully
            </DialogTitle>
          </DialogHeader>

          <p className="text-[#444444] text-[15px] leading-relaxed font-mona">
            Your new password is ready to use.
          </p>

          <DialogFooter className="w-fit flex items-center justify-center gap-6 pt-2 ">
            <Button
              className="w-fit h-[45px] bg-[#00BCD4] text-white rounded-xl 
              shadow-none hover:bg-[#00BCD4] active:bg-[#00BCD4] cursor-pointer font-mona"
              onClick={() => {
                navigate(`/${ROUTES.auth.login}`), onClose();
              }}
            >
              Continue
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewPasswordSuccessModel;
