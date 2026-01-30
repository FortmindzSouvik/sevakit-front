import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, Loader2 } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Link } from "react-router";
import { ROUTES } from "@/utils/routeConstants";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppDispatch, useAppSelector, type RootState } from "@/redux/store";
import { useUserSignin } from "@/hooks/useUserAuth";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { clearRememberMe, setRememberMe } from "@/redux/slices/remembermeSlice";
import CompleteLoginModal from "./component/CompleteLoginModal";

/* ---------------- VALIDATION SCHEMA ---------------- */
const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .min(8, "Enter a valid phone number"),
  password: yup.string().required("Password is required"),
  remember: yup.boolean().optional(),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const [existsModal, setExistsModal] = useState(false);
  const [phone, setPhone] = useState("");

  // Load saved values from redux-persist
  const savedPhone = useAppSelector((s: RootState) => s.rememberMe.phoneNumber);
  const savedPass = useAppSelector((s: RootState) => s.rememberMe.password);
  const savedRemember = useAppSelector(
    (s: RootState) => s.rememberMe.rememberMe
  );

  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync: login, isPending } = useUserSignin();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phoneNumber: savedPhone || "",
      password: savedPass || "",
      remember: savedRemember || false,
    },
  });

  const onSubmit = async (data: any) => {
    const rawPhoneNumber = data.phoneNumber || "";
    // const phoneNumberWithoutPlus = rawPhoneNumber.replace(/^\+/, "");
    setPhone(rawPhoneNumber);
    if (data?.remember) {
      dispatch(
        setRememberMe({
          phoneNumber: rawPhoneNumber,
          password: data.password,
          remember: true,
        })
      );
    } else {
      dispatch(clearRememberMe());
    }
    const payload = {
      phoneNumber: rawPhoneNumber,
      password: data.password,
    };
    try {
      const resp = await login(payload);
      if (resp?.isSuccess) {
        setExistsModal(true);
      }
      if (!data.remember) {
        reset({
          phoneNumber: "",
          password: "",
          remember: false,
        });
      }
    } catch (error) {
      let message = "Something went wrong. Please try again.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      console.log("error in login", error);
      toast.error(message);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="font-mona text-3xl font-display font-bold text-[#000000] mb-2">
          Welcome Back
        </h1>
        <p className="font-mona text-[#000000]">
          Sign in to access your KIT health records.
        </p>
      </div>

      {/* ---------------- FORM ---------------- */}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* PHONE NUMBER */}
        <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
            errors.phoneNumber ? "border-red-500" : "border-[#FFFFFF]"
          }`}
        >
          <img src="/../icons/call-icon.svg" className="w-4 h-4 mt-2.5" />

          <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

          <div className="flex flex-col w-full">
            <label className="text-[12px] text-[#616161] font-medium font-mona">
              Phone Number
            </label>

            <PhoneInput
              country={"us"}
              enableSearch={true}
              value={watch("phoneNumber")}
              countryCodeEditable={false}
              onChange={(value) => {
                // const digits = `${value}`.replace(/\D/g, "");
                // const e164 = digits ? `+${digits}` : "";
                 const e164 = value ? `+${value}` : "";
                setValue("phoneNumber", e164, { shouldValidate: true });
              }}
              inputStyle={{
                width: "100%",
                border: "none",
                height: "30px",
                fontSize: "16px",
                boxShadow: "none",
              }}
              buttonStyle={{
                border: "none",
                background: "transparent",
              }}
              dropdownStyle={{
                borderRadius: "10px",
              }}
              containerStyle={{ width: "100%" }}
            />
          </div>
        </div>

        {errors.phoneNumber && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.phoneNumber.message}
          </p>
        )}

        {/* PASSWORD */}
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

          <div className="flex flex-col w-full relative">
            <label className="text-[12px] text-[#616161] font-medium font-mona">
              Password
            </label>

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password")}
              className="border-0 shadow-none p-0 mt-0.5 h-5 pr-6 focus-visible:ring-0 text-[16px]"
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

        {errors.password && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.password.message}
          </p>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={watch("remember")}
              onCheckedChange={(checked) =>
                setValue("remember", checked === true, { shouldValidate: true })
              }
              className="w-4 h-4"
            />
            <span className="font-mona text-sm">Remember me</span>
          </div>

          <Link
            to={`/${ROUTES.auth.forgotPassword}`}
            className="text-[#00BCD4] text-sm font-mona"
          >
            Forgot Password
          </Link>
        </div>

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 flex items-center justify-center  bg-[#00BCD4] hover:bg-[#00BCD4] text-[#212121] font-mona font-semibold rounded-xl shadow-lg cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
        {/* already account */}
        <div className="text-center font-mona">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to={`/${ROUTES.auth.createAccount}`}
              className="text-[#12bdd4] font-medium"
            >
              Create Account
            </Link>
          </p>
        </div>
      </form>
      <CompleteLoginModal
        isOpen={existsModal}
        onClose={() => setExistsModal(false)}
        phoneNumber={phone}
      />
    </div>
  );
};

export default Login;
