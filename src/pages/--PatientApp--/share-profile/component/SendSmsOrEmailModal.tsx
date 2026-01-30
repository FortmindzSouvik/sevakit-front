import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import TextInputField from "@/components/form/TextInputField";
import PhoneNumberField from "@/components/form/PhoneNumberField";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { usePostJson } from "@/hooks/usePostJson";
import { Loader2 } from "lucide-react";

// type FormValues = {
//   email?: string;
//   phone?: string;
// };

const getSchema = (mode: "sms" | "email") =>
  yup.object({
    email:
      mode === "email"
        ? yup
            .string()
            .required("Email address is required")
            .email("Enter a valid email address")
        : yup.string().notRequired(),
    phoneNumber:
      mode === "sms"
        ? yup
            .string()
            .required("Phone number is required")
            .min(10, "Enter a valid phone number")
        : yup.string().notRequired(),
  });

const SendSmsOrEmailModal = ({
  isOpen,
  onClose,
  // onSuccess,
  mode,
}: {
  isOpen: boolean;
  onClose: () => void;
  // onSuccess: () => void;
  mode: "sms" | "email";
}) => {
  const { mutateAsync: sendQRCode, isPending } = usePostJson(["send-share-QR"]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(getSchema(mode)),
  });

  const onSubmit = async (data: any) => {
    console.log("Submitted Data:", data);
    try {
      if (mode === "email") {
        await sendQRCode({
          endpoint: apiRoutes.sendQRCode,
          data: {
            email: data?.email,
          },
        });
      } else {
        await sendQRCode({
          endpoint: apiRoutes.sendQRCode,
          data: {
            phoneNumber: data?.phoneNumber,
          },
        });
      }

      // onSuccess();
      reset();
      onClose();
      toast.success("Profile link sent successfully.");
    } catch (error) {
      let message = "Failed! Please try again.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      console.log("error", error);
      toast.error(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-md p-9 rounded-2xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            reset();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <img
            src="/../icons/cross-small-icon.svg"
            className="w-5 h-5"
            alt="close"
          />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Header */}
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black font-mona">
              {mode === "sms" ? "Send via SMS" : "Send via Email"}
            </DialogTitle>
          </DialogHeader>

          {/* Description */}
          <p className="text-sm text-[#4A4A4A] font-mona">
            {mode === "sms"
              ? "Enter the mobile number to receive the report."
              : "Enter the email address to receive the report."}
          </p>

          {/* Form */}
          <form className="w-full space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* EMAIL */}
            {mode === "email" && (
              <TextInputField
                label="Email Address"
                placeholder="Enter email address"
                icon="/../icons/email-icon.svg"
                name="email"
                register={register}
                error={errors.email}
              />
            )}

            {/* PHONE */}
            {mode === "sms" && (
              <PhoneNumberField
                label="Mobile Number"
                icon="/../icons/call-icon.svg"
                value={watch("phoneNumber") ?? undefined}
                error={errors.phoneNumber}
                onChange={(v) =>
                  setValue("phoneNumber", v, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              />
            )}

            {/* Buttons */}
            <DialogFooter className="flex justify-center gap-6 pt-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  onClose();
                }}
                className="px-10 py-3 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-mona text-sm cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="flex items-center justify-center px-10 py-3 bg-[#00BCD4] text-[#212121] rounded-xl font-mona text-sm font-semibold cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send"
                )}
              </button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendSmsOrEmailModal;
