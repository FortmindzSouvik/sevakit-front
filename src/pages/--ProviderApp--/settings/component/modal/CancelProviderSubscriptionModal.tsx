import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePostJson } from "@/hooks/usePostJson";
import { clearProviderData } from "@/redux/slices/providerSlice";
import { useAppDispatch } from "@/redux/store";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { ROUTES } from "@/utils/routeConstants";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const CancelProviderSubscriptionModal = ({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { mutateAsync: cancelProviderSubscription, isPending } = usePostJson([
    "cancel-provider-Subscription",
  ]);

  const handleSubscriptionCancel = async () => {
    try {
      await cancelProviderSubscription({
        endpoint: apiRoutes.cancelProviderSubscription,
        data: {},
      });
      onClose();
      onSuccess();
      setTimeout(() => {
        dispatch(clearProviderData());
        navigate(`/${ROUTES.auth.login}`, { replace: true });
      }, 1000);
    } catch (error) {
      let message = "Failed cancel subscription";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      console.log("error in cancel subscription", error);
      toast.error(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md p-6 rounded-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <img
            src="/../icons/cross-small-icon.svg"
            className="w-5 h-5"
            alt="close"
          />
        </button>
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-40 h-20 rounded-full flex items-center justify-center">
            <img
              src="/../icons/!-sign-color-icon.svg"
              alt="!-sign"
              className="w-20 h-20"
            />
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black font-mona">
              Cancel Subscription
            </DialogTitle>
          </DialogHeader>

          <p className="text-[#444444] text-[15px] leading-relaxed font-mona">
            Are you sure you want to cancel your subscription?
          </p>

          <DialogFooter className="w-full flex items-center justify-center gap-6 pt-2 ">
            <div className="flex gap-3 w-full ">
              <button
                type="button"
                onClick={() => onClose()}
                className="w-1/2 h-fit border border-[#00BCD4] text-[#00BCD4] rounded-xl font-medium cursor-pointer font-mona p-4"
              >
                Keep Subscription
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={!isPending ? handleSubscriptionCancel : undefined}
                className={`flex justify-center items-center w-2/3 h-fit rounded-xl font-mona p-4 ${isPending ? "bg-[#FF5A54]/70 cursor-not-allowed opacity-70" : "bg-[#FF5A54] cursor-pointer"}`}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Cancelling...
                  </>
                ) : (
                  "Cancel Subscription"
                )}
              </button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelProviderSubscriptionModal;
