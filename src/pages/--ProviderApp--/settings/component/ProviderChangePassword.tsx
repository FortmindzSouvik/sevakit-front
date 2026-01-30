import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { Input } from "@/components/ui/input";
import { usePostJson } from "@/hooks/usePostJson";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { AxiosError } from "axios";
import { Eye } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PasswordForm = {
  newPassword: string;
  confirmPassword: string;
};

const ProviderChangePassword = () => {
  const [showCreatePass, setShowCreatePass] = useState(false);
  const [showCnfrmPass, setShowCnfrmPass] = useState(false);
  const [successModalForPass, setSuccessModalForPass] = useState(false);
  const { mutateAsync: changePassword, isPending: isPasswordUpdating } =
    usePostJson(["change-password"]);
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch: watchPassword,
    reset: resetPasswordForm,
  } = useForm<PasswordForm>();
  const passwordValue = watchPassword("newPassword");

  const onSubmitPassword = async (data: PasswordForm) => {
    try {
      await changePassword({
        endpoint: apiRoutes.changePassword,
        data: {
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
      });
      setSuccessModalForPass(true);
      resetPasswordForm();
    } catch (error) {
      let message = "Failed to update password";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      console.log("error in update password", error);
      toast.error(message);
    }
  };
  return (
    <div className="rounded-xl border bg-white p-6">
      <h3 className="text-lg font-medium text-[#4A4A4A] mb-4">
        Change Password
      </h3>

      <div className="rounded-xl bg-[#F7FDFF] p-6">
        <form
          onSubmit={handleSubmitPassword(onSubmitPassword)}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Create Password */}
          <div>
            <div className="flex items-start gap-3 w-full rounded-2xl border border-[#ECECEC] bg-white px-3 py-2.5">
              <img
                src="/../icons/lock-icon.svg"
                alt="lock"
                className="w-4 h-4 mt-2.5"
              />

              <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

              <div className="flex flex-col flex-1 relative">
                <label className="text-xs text-[#424242] font-medium font-mona">
                  Create Password
                </label>

                <Input
                  type={showCreatePass ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="border-0 shadow-none p-0 mt-0.5 h-5 pr-8 focus-visible:ring-0 text-[14px]"
                  {...registerPassword("newPassword", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowCreatePass(!showCreatePass)}
                  className="absolute right-0 top-3 text-[#9E9E9E]"
                >
                  {showCreatePass ? (
                    <Eye size={16} />
                  ) : (
                    <img src="/../icons/eye-cross-icon.svg" />
                  )}
                </button>
              </div>
            </div>

            {passwordErrors.newPassword && (
              <p className="text-xs text-red-500 mt-1 ml-2">
                {passwordErrors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <div className="flex items-start gap-3 w-full rounded-2xl border border-[#ECECEC] bg-white px-3 py-2.5">
              <img
                src="/../icons/lock-icon.svg"
                alt="lock"
                className="w-4 h-4 mt-2.5"
              />

              <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

              <div className="flex flex-col flex-1 relative">
                <label className="text-xs text-[#424242] font-medium font-mona">
                  Confirm New Password
                </label>

                <Input
                  type={showCnfrmPass ? "text" : "password"}
                  placeholder="Enter the password"
                  className="border-0 shadow-none p-0 mt-0.5 h-5 pr-8 focus-visible:ring-0 text-[14px]"
                  {...registerPassword("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === passwordValue || "Passwords do not match",
                  })}
                />

                <button
                  type="button"
                  onClick={() => setShowCnfrmPass(!showCnfrmPass)}
                  className="absolute right-0 top-3 text-[#9E9E9E]"
                >
                  {showCnfrmPass ? (
                    <Eye size={16} />
                  ) : (
                    <img src="/../icons/eye-cross-icon.svg" />
                  )}
                </button>
              </div>
            </div>

            {passwordErrors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1 ml-2">
                {passwordErrors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Save Button */}
          <div className="col-span-1 md:col-span-2 flex justify-center md:justify-end mt-3">
            <button
              type="submit"
              disabled={isPasswordUpdating}
              className={`w-full md:w-auto rounded-xl px-6 py-3 text-sm font-medium ${
                isPasswordUpdating
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-dashed text-[#757575] cursor-pointer"
              }`}
            >
              {isPasswordUpdating ? "Saving..." : "Save Password"}
            </button>
          </div>
        </form>

        <CommonSuccessModal
          isOpen={successModalForPass}
          onClose={() => setSuccessModalForPass(false)}
          desc={"Your Password has been updated successfully."}
          icon={"/../icons/correct-color-icon.svg"}
        />
      </div>
    </div>
  );
};

export default ProviderChangePassword;
