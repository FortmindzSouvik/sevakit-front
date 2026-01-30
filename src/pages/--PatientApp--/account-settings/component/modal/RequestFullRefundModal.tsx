import SelectField from "@/components/form/SelectField";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePostJson } from "@/hooks/usePostJson";
import { clearUserData } from "@/redux/slices/userSlice";
import { useAppDispatch } from "@/redux/store";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { ROUTES } from "@/utils/routeConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import * as yup from "yup";

type Form = {
  pin: string;
  reason: string;
};
/* ---------------- VALIDATION SCHEMA ---------------- */
const schema = yup.object().shape({
  reason: yup.string().required("Reason is required"),
  pin: yup
    .string()
    .required("PIN is required")
    .matches(/^\d+$/, "PIN must contain only numbers")
    .length(6, "PIN must be exactly 6 digits"),
});
const RequestFullRefundModal = ({
  isOpen,
  onClose,
  onSuccess,
  subscriptionAmount,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subscriptionAmount: string;
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: requestRefund, isPending } = usePostJson([
    "request refund",
  ]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      reason: "",
      pin: "",
    },
  });

  const onSubmit = async (data: Form) => {
    try {
      await requestRefund({
        endpoint: apiRoutes.requestRefund,
        data,
      });
      onClose();
      reset();
      onSuccess();
      setTimeout(() => {
        dispatch(clearUserData());
        navigate(`/${ROUTES.auth.login}`, { replace: true });
      }, 2000);
    } catch (error) {
      let message = "Failed to request refund.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      console.log("error in request refund", error);
      toast.error(message);
    }
  };
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md p-8 rounded-2xl">
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
              Request Full Refund
            </DialogTitle>
          </DialogHeader>

          <p className="text-[#444444] text-[15px] leading-relaxed font-mona">
            Request a full refund for a recent subscription charge. Refunds are
            reviewed and may take up to 7 business days. This action requires
            your 6-digit Password PIN.
          </p>

          <p className="text-[#000000] font-semibold leading-relaxed font-mona">
            Charge: {today} — {subscriptionAmount}
          </p>

          <DialogFooter className="w-full flex items-center justify-center gap-6">
            <form
              className="space-y-6 w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* reason Name */}
              <SelectField
                label="Reason (required)"
                icon="/../icons/notes-icon.svg"
                value={watch("reason")}
                onChange={(v) =>
                  setValue("reason", v, { shouldValidate: true })
                }
                options={[
                  { label: "Duplicate", value: "duplicate" },
                  { label: "Fraudulent", value: "fraudulent" },
                  {
                    label: "Requested By Customer",
                    value: "requested_by_customer",
                  },
                  { label: "Other", value: "other" },
                ]}
                error={errors.reason}
              />
              {/* PASSWORD */}
              <div>
                <div
                  className={`flex items-start gap-3 w-full border rounded-xl bg-white px-3 py-2.5 mb-6 ${
                    errors.pin ? "border-red-500" : "border-[#ECECEC]"
                  }`}
                >
                  <img
                    src="/../icons/lock-icon.svg"
                    alt="lock"
                    className="w-4 h-4 mt-2.5"
                  />

                  <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

                  <div className="flex flex-col w-full relative">
                    <label className="text-[12px] text-[#616161] font-medium font-mona w-fit">
                      Pin
                    </label>

                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter 6 digit pin"
                      autoComplete="current-password"
                      {...register("pin")}
                      className="border-0 shadow-none p-0 mt-0.5 h-5 pr-6 focus-visible:ring-0 text-[14px]"
                    />

                    {/* SHOW/HIDE BUTTON */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-3"
                    >
                      {showPassword ? (
                        <Eye size={16} />
                      ) : (
                        <img
                          src="/../icons/eye-cross-icon.svg"
                          className="w-4 h-4"
                          alt="hide"
                        />
                      )}
                    </button>
                  </div>
                </div>
                {errors.pin && (
                  <p className="text-red-500 text-xs -mt-4 ml-1 w-fit">
                    {errors.pin.message}
                  </p>
                )}
              </div>
              <div className="flex gap-3 w-full ">
                <button
                  type="button"
                  onClick={() => onClose()}
                  className="w-1/3 h-fit border border-[#00BCD4] text-[#00BCD4] rounded-xl font-medium cursor-pointer font-mona p-4"
                >
                  Cancel{" "}
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex justify-center items-center w-2/3 h-fit bg-[#FF5A54] rounded-xl shadow-none text-[#212121] cursor-pointer font-mona p-4"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Refund Request"
                  )}
                </button>
              </div>
            </form>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestFullRefundModal;
