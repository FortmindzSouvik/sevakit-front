import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Clock } from "lucide-react";
import { useAppDispatch } from "@/redux/store";
import { clearRegistration } from "@/redux/slices/registrationSlice";
import { ROUTES } from "@/utils/routeConstants";
import { useUserRequestNewPasswordLink } from "@/hooks/useUserAuth";

export interface PhoneVerifyPayload {
  // firstName: string;
  // lastName: string;
  phoneNumber: string;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  payload: PhoneVerifyPayload;
};

export default function ResendLinkForForgotPassModal({
  isOpen,
  onClose,
  payload,
}: Props) {
  const navigate = useNavigate();

  // const RESEND_TIME = 300; // 5 minutes
  const RESEND_TIME = 60; // 1 minutes
  const [timeLeft, setTimeLeft] = useState(RESEND_TIME);
  const canResend = timeLeft === 0;

  const dispatch = useAppDispatch();

  const { mutateAsync: requestnewPasswordLink } =
    useUserRequestNewPasswordLink();

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
    try {
      const resp = await requestnewPasswordLink(payload);
      const exists = resp?.isSuccess === true;
      if (exists) {
        setTimeLeft(RESEND_TIME);
      }
    } catch (err) {
      console.error("modal api failed", err);
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
          <div className="w-40 h-20 rounded-full flex items-center justify-center">
            <img src="/../icons/msg-color-icon.svg" className="w-20 h-20" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black font-mona">
              Check Your Phone & Email
            </DialogTitle>
          </DialogHeader>

          <p className="text-[#444444] text-[15px] leading-relaxed font-mona">
            We’ve sent a password reset link to your registered phone number and
            email. Tap the link to create a new password.
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
              className="w-1/2 h-fit p-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-medium cursor-pointer font-mona"
              onClick={() => {
                dispatch(clearRegistration());
                onClose();
                setTimeLeft(RESEND_TIME);
                navigate(`/${ROUTES.auth.login}`);
              }}
            >
              Back to Sign In
            </button>

            <button
              type="button"
              className={`w-1/2 h-fit p-4 rounded-xl font-mona shadow-none
                ${
                  canResend
                    ? "bg-[#00BCD4] text-white cursor-pointer"
                    : "bg-[#B2EBF2] text-[#666] cursor-not-allowed"
                }
              `}
              disabled={!canResend}
              onClick={handleResendClick}
            >
              Resend Link
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
