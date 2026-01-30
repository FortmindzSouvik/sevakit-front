import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { Input } from "@/components/ui/input";
import { usePostJson } from "@/hooks/usePostJson";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { AxiosError } from "axios";
import { Eye } from "lucide-react";
import  { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type SharePinForm = {
  newPin: string;
  confirmPin: string;
};

const ChangePin = () => {
  const [showPin, setShowPin] = useState(false);
  const [cnfrmShowPin, setCnfrmShowPin] = useState(false);
  const [successModalForPin, setSuccessModalForPin] = useState(false);

  const { mutateAsync: changeSharePin, isPending: isPinUpdating } = usePostJson(
    ["change-share-pin"]
  );

  const {
    register: registerPin,
    handleSubmit: handleSubmitPin,
    formState: { errors: pinErrors },
    reset: resetPinForm,
    watch,
  } = useForm<SharePinForm>();

  const newPinValue = watch("newPin");

  const isSequentialPin = (pin: string) => {
    let asc = true;
    let desc = true;

    for (let i = 1; i < pin.length; i++) {
      if (Number(pin[i]) !== Number(pin[i - 1]) + 1) asc = false;
      if (Number(pin[i]) !== Number(pin[i - 1]) - 1) desc = false;
    }

    return asc || desc;
  };

  const onSubmitPin = async (data: SharePinForm) => {
    try {
      await changeSharePin({
        endpoint: apiRoutes.changeSharePin,
        data: { newPin: data?.newPin, confirmPin: data?.confirmPin },
      });

      setSuccessModalForPin(true);
      resetPinForm();
    } catch (error) {
      let message = "Failed to update Share PIN";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      console.log("error in update share pin", error);
      toast.error(message);
    }
  };
  return (
    <>
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold">Change Share PIN</h2>
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl p-4 ">
          <div className="flex items-start justify-between">
            {/* Title + Start Date */}
            <div className="font-mona">
              <p className="text-sm font-normal text-[#4A4A4A] mt-1">
                Update the 6-digit PIN used to share your health profile
                securely.
              </p>
            </div>
          </div>
          {/* Input Field */}
          <form onSubmit={handleSubmitPin(onSubmitPin)}>
            <div>
              <div className="flex items-start gap-3 w-full rounded-2xl border border-[#ECECEC] bg-[#FFFFFF] px-3 py-2.5 mt-3">
                {/* Lock Icon */}
                <img
                  src="/../icons/lock-icon.svg"
                  alt="lock"
                  className="w-4 h-4 mt-2.5"
                />

                {/* Divider */}
                <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

                {/* Input Wrapper */}
                <div className="flex flex-col flex-1 relative">
                  <label className="text-xs text-[#424242] font-medium font-mona">
                    New Share PIN
                  </label>

                  <Input
                    type={showPin ? "text" : "password"}
                    maxLength={6}
                    placeholder="Enter new PIN"
                    className="border-0 shadow-none p-0 mt-0.5 h-5 pr-8 focus-visible:ring-0 text-[14px]"
                    {...registerPin("newPin", {
                      required: "Please enter a new Share PIN",
                      pattern: {
                        value: /^\d{6}$/,
                        message: "PIN must be exactly 6 digits",
                      },
                      validate: (value) =>
                        !isSequentialPin(value) ||
                        "Sequential PINs like 123456 or 654321 are not allowed",
                    })}
                  />

                  {/* Eye Icon */}
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-0 top-3 text-[#9E9E9E] hover:text-[#424242]"
                  >
                    {showPin ? (
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
              {pinErrors.newPin && (
                <p className="text-xs text-red-500 mt-1">
                  {pinErrors.newPin.message}
                </p>
              )}
            </div>
            <div>
              <div className="flex items-start gap-3 w-full rounded-2xl border border-[#ECECEC] bg-[#FFFFFF] px-3 py-2.5 mt-3">
                {/* Lock Icon */}
                <img
                  src="/../icons/lock-icon.svg"
                  alt="lock"
                  className="w-4 h-4 mt-2.5"
                />

                {/* Divider */}
                <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

                {/* Input Wrapper */}
                <div className="flex flex-col flex-1 relative">
                  <label className="text-xs text-[#424242] font-medium font-mona">
                    Confirm Share PIN
                  </label>

                  <Input
                    type={cnfrmShowPin ? "text" : "password"}
                    maxLength={6}
                    placeholder="Enter confirm new PIN"
                    className="border-0 shadow-none p-0 mt-0.5 h-5 pr-8 focus-visible:ring-0 text-[14px]"
                    {...registerPin("confirmPin", {
                      required: "Please confirm your Share PIN",
                      validate: (value) =>
                        value === newPinValue || "PINs do not match",
                    })}
                  />

                  {/* Eye Icon */}
                  <button
                    type="button"
                    onClick={() => setCnfrmShowPin(!cnfrmShowPin)}
                    className="absolute right-0 top-3 text-[#9E9E9E] hover:text-[#424242]"
                  >
                    {cnfrmShowPin ? (
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
              {pinErrors.confirmPin && (
                <p className="text-xs text-red-500 mt-1">
                  {pinErrors.confirmPin.message}
                </p>
              )}
            </div>

            <div className="w-full border-t border-[#ECECEC] mt-3"></div>
            <div className="flex justify-between items-center gap-2">
              <button
                type="submit"
                disabled={isPinUpdating}
                className={`w-full mt-3 rounded-xl p-3 text-sm font-medium ${
                  isPinUpdating
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-dashed text-[#757575] cursor-pointer"
                }`}
              >
                {isPinUpdating ? "Saving..." : "Save PIN"}
              </button>
            </div>
          </form>
        </div>
        <CommonSuccessModal
          isOpen={successModalForPin}
          onClose={() => setSuccessModalForPin(false)}
          desc={"Your Share PIN has been updated successfully."}
          icon={"/../icons/correct-color-icon.svg"}
        />
      </div>
    </>
  );
};

export default ChangePin;
