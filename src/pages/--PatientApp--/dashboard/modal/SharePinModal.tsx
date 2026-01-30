import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePostJson } from "@/hooks/usePostJson";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { ROUTES } from "@/utils/routeConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import * as yup from "yup";

type PINFORM = {
  sharePin: string;
};

/* ---------------- VALIDATION SCHEMA ---------------- */
const schema = yup.object().shape({
  sharePin: yup
    .string()
    .required("PIN is required")
    .matches(/^\d+$/, "PIN must contain only numbers")
    .length(6, "PIN must be exactly 6 digits"),
});

export default function SharePinModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const navigate = useNavigate();
  const { mutateAsync: sharePinValidate, isPending } = usePostJson([
    "validate-sharepin",
  ]);

  const EXPIRY_TIME = 5 * 60 * 1000;

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      sharePin: "",
    },
  });

  const onSubmit = async (data: PINFORM) => {
    console.log("FINAL API PAYLOAD:", data);
    try {
      const resp = await sharePinValidate({
        endpoint: apiRoutes.sharePinValidation,
        data,
      });

      sessionStorage.setItem(
        "publicProfile",
        JSON.stringify({
          data: resp?.data,
          expiresAt: Date.now() + EXPIRY_TIME,
        })
      );
      navigate(`/${ROUTES.role.patient}/${ROUTES.patient.publicHealthProfile}`);
      onSuccess();
    } catch (error) {
      let message = "Failed! Please try again.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    }
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
            <img src="/../icons/lock-color-icon.svg" className="w-fit h-fit " />
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black font-mona">
              Enter Share PIN
            </DialogTitle>
          </DialogHeader>

          <p className="text-[#000000] text-base leading-relaxed font-mona">
            For security, enter your 6-digit Share PIN to view your Public
            Health Profile.
          </p>

          {/* Input Field */}
          <form className="space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
            <div
              className={`flex items-start gap-3 w-full border rounded-xl bg-white px-3 py-2.5 mb-6 ${
                errors.sharePin ? "border-red-500" : "border-[#ECECEC]"
              }`}
            >
              <img
                src="/../icons/lock-icon.svg"
                alt="lock"
                className="w-4 h-4 mt-2.5"
              />

              <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

              <div className="flex flex-col ">
                <label className="text-xs text-[#424242] font-medium font-mona mr-25">
                  Enter Share PIN
                </label>

                <Input
                  type="password"
                  placeholder="Enter 6-digit PIN"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  {...register("sharePin")}
                  onInput={(e: React.FormEvent<HTMLInputElement>) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /\D/g,
                      ""
                    );
                  }}
                  className="border-0 shadow-none p-0 mt-0.5 h-5 pr-6 focus-visible:ring-0 text-[16px]"
                />
              </div>
            </div>

            {errors.sharePin && (
              <p className="text-red-500 text-xs -mt-4 ml-1 w-fit">
                {errors.sharePin.message}
              </p>
            )}
            {/* Help Text */}
            <p className="text-sm font-mona text-[#000000] ">
              Your Share PIN protects your shared health information.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="w-1/2 h-fit px-10 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
                onClick={() => {
                  onClose();
                }}
              >
                Cancel
              </button>

              <button
                className="flex items-center justify-center w-1/2 h-fit px-8 py-4 bg-[#00BCD4] text-[#212121] rounded-xl 
                  shadow-none hover:bg-[#00BCD4] active:bg-[#00BCD4] cursor-pointer font-mona"
                onClick={() => {}}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </form>

          <DialogFooter className="w-fit flex items-center justify-center gap-6 pt-2 "></DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
