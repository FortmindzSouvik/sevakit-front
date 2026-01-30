import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import NewPasswordSuccessModel from "./component/NewPasswordSuccessModel";
import { useLocation } from "react-router";
import { useUserSetNewPassword } from "@/hooks/useUserAuth";

export interface setPasstype {
  password: string;
  confirmPassword: string;
  token: string;
}

// -------------------- Validation Schema --------------------
const schema = yup.object().shape({
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#^()_\-+={}[\]|;:'",.<>/~`]/,
      "Password must contain at least one special character"
    ),

  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

const NewPassword = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showCnfrmPassword, setShowCnfrmPassword] = useState(false);
  const [existsModal, setExistsModal] = useState(false);
  const { mutateAsync: setNewPassword } = useUserSetNewPassword();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    if (!token) return;

    const payload = {
      password: data?.password.trim(),
      confirmPassword: data?.confirmPassword.trim(),
      token,
    };

    try {
      const resp = await setNewPassword(payload);
      const exists = resp?.isSuccess === true;

      if (exists) {
        setExistsModal(true);
      }
    } catch (error) {
      console.error("reset link send failed:", error);
      console.log("reset link send failed", error);
    }
    const success = true;
    if (success) {
      setExistsModal(true);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="font-mona text-3xl font-display font-bold text-[#000000] mb-2">
          Create a New Password
        </h1>
        <p className="font-mona text-[#000000]">
          Your identity has been verified. Create a new password to sign in.
        </p>
      </div>

      {/* -------------------- Form -------------------- */}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* password */}
        <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
            errors.password ? "border-red-500" : "border-[#FFFFFF]"
          }`}
        >
          <img
            src="/../icons/lock-icon.svg"
            alt="lock"
            className="w-4 h-4 mt-2.5"
          />

          <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

          <div className="flex flex-col leading-tight w-full relative">
            <label className="text-[12px] text-[#616161] font-medium font-mona">
              Create Password
            </label>

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              autoComplete="new-password"
              {...register("password")}
              className="border-0 shadow-none p-0 mt-0.5 h-5 pr-6 focus-visible:ring-0 text-[16px]"
            />

            {/* Eye toggle */}
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
                  alt="hidden"
                />
              )}
            </button>
          </div>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.password.message}
          </p>
        )}

        {/* Confirm password */}
        <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
            errors.confirmPassword ? "border-red-500" : "border-[#FFFFFF]"
          }`}
        >
          <img
            src="/../icons/lock-icon.svg"
            alt="lock"
            className="w-4 h-4 mt-2.5"
          />

          <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

          <div className="flex flex-col leading-tight w-full relative">
            <label className="text-[12px] text-[#616161] font-medium font-mona">
              Confirm New Password
            </label>

            <Input
              type={showCnfrmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              {...register("confirmPassword")}
              className="border-0 shadow-none p-0 mt-0.5 h-5 pr-6 focus-visible:ring-0 text-[16px]"
            />

            {/* Eye toggle */}
            <button
              type="button"
              onClick={() => setShowCnfrmPassword(!showCnfrmPassword)}
              className="absolute right-0 top-3"
            >
              {showCnfrmPassword ? (
                <Eye size={16} />
              ) : (
                <img
                  src="/../icons/eye-cross-icon.svg"
                  className="w-4 h-4"
                  alt="hidden"
                />
              )}
            </button>
          </div>
        </div>

        {errors.confirmPassword && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.confirmPassword.message}
          </p>
        )}

        {/* submit button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-full bg-[#00BCD4] hover:bg-[#00BCD4] text-[#212121] p-4 capitalize font-mona font-semibold rounded-xl shadow-lg cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save new password"
          )}
        </Button>
      </form>
      <NewPasswordSuccessModel
        isOpen={existsModal}
        onClose={() => setExistsModal(false)}
      />
    </div>
  );
};

export default NewPassword;
