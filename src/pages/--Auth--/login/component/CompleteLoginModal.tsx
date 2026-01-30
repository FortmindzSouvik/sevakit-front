import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useUserRequesNewApprovalLink } from "@/hooks/useUserAuth";
import { toast } from "sonner";
import { AxiosError } from "axios";

const CompleteLoginModal = ({
  isOpen,
  onClose,
  phoneNumber,
}: {
  isOpen: boolean;
  onClose: () => void;
  phoneNumber: string;
}) => {
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);

  const { mutateAsync: requestNewApprovalLink } =
    useUserRequesNewApprovalLink();

  // const RESEND_TIME = 300; // 5 minutes
  const RESEND_TIME = 60; // 1 minutes
  const [timeLeft, setTimeLeft] = useState(RESEND_TIME);
  const canResend = timeLeft === 0 && !isResending;

  /* ---------------- TIMER LOGIC ---------------- */
  useEffect(() => {
    if (!isOpen) return;
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  /* ---------------- FORMAT TIME ---------------- */
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");

    if (sec >= 60) {
      return `${m}:${s} min`;
    } else {
      return `00:${s} sec`;
    }
  };

  const handleResendClick = async () => {
    if (isResending) return;

    try {
      setIsResending(true);

      const payload = {
        phoneNumber,
      };
      const resp = await requestNewApprovalLink(payload);
      const exists = resp?.isSuccess === true;
      if (exists) {
        setTimeLeft(RESEND_TIME);
        // toast.success(resp?.message);
      }
    } catch (error) {
      let message = "Something went wrong. Please try again.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      console.log("error in sending link", error);
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md p-8 rounded-2xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Custom Close Button */}
        <button
          onClick={() => {
            onClose();
            navigate(`/${ROUTES.auth.login}`);
          }}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <img
            src="/../icons/cross-small-icon.svg"
            className="w-fit h-fit"
            alt="close"
          />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-fit h-fit rounded-full flex items-center justify-center">
            <img
              src="/../icons/message-color-icon.svg"
              alt="msg-sign"
              className="w-20 h-20"
            />
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black font-mona">
              Check Your Phone & Email
            </DialogTitle>
          </DialogHeader>

          <p className="text-[#000000] text-base leading-relaxed font-mona">
            We’ve sent an approval link to your registered phone number and
            email. Tap the link to complete Sign In.
          </p>

          {/* TIMER */}

          <div className="flex flex-col items-center gap-2 font-mona">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <Clock size={16} />
              <span>{formatTime(timeLeft)}</span>
            </div>

            {!canResend && (
              <p className="text-sm text-gray-500">
                You can resend the link after the timer ends
              </p>
            )}
          </div>

          <DialogFooter className="w-full flex items-center justify-center gap-6 pt-2 ">
            <button
              type="button"
              className="w-1/2 h-fit p-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
              onClick={() => {
                (navigate(`/${ROUTES.auth.login}`), onClose());
              }}
            >
              Back to Sign In
            </button>

            <button
              type="button"
              disabled={!canResend}
              className={`w-1/2 h-fit p-4 rounded-xl font-mona shadow-none
                ${
                  canResend
                    ? "bg-[#00BCD4] text-white cursor-pointer"
                    : "bg-[#B2EBF2] text-[#666] cursor-not-allowed"
                }
              `}
              onClick={handleResendClick}
            >
              Resend Link
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteLoginModal;
