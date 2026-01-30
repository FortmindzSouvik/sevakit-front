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

const AccountAlreadySetUpModal = ({
  isOpen,
  onClose,
  phoneNumber,
  firstName,
  lastName,
}: {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber?: string | null;
  firstName?: string | null;
  lastName?: string | null;
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
          <div className="w-fit h-fit rounded-full flex items-center justify-center">
            <img
              src="/../icons/!-sign-color-icon.svg"
              alt="!-sign"
              className="w-20 h-20"
            />
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black font-mona">
              Your account is already set up.
            </DialogTitle>
          </DialogHeader>

          <p className="text-[#000000] text-base leading-relaxed font-mona">
            An existing account with this Name and Phone Number already exists.
            If you would like to claim it. Use your existing credentials to sign
            in or reset your password.
          </p>

          <DialogFooter className="w-fit flex items-center justify-center gap-6 pt-2 ">
            <button
              type="button"
              className="w-[150px] h-[45px] border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
              onClick={() => {
                navigate(`/${ROUTES.auth.resetPasswordMsg}`, {
                  state: {
                    phoneNumber,
                    firstName,
                    lastName,
                  },
                }),
                  onClose();
              }}
            >
              Reset Password
            </button>

            <Button
              className="w-fit h-[45px] bg-[#00BCD4] text-white rounded-xl 
              shadow-none hover:bg-[#00BCD4] active:bg-[#00BCD4] cursor-pointer font-mona"
              onClick={() => {navigate(`/${ROUTES.auth.login}`)}}
            >
              Sign In to My Account
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountAlreadySetUpModal;
