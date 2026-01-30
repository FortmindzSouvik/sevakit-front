import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useUserRequestNewPasswordLink } from "@/hooks/useUserAuth";
import { AxiosError } from "axios";
import { toast } from "sonner";
import ResendLinkForForgotPassModal from "./component/ResendLinkForForgotPassModal";
import { Link } from "react-router";
import { ROUTES } from "@/utils/routeConstants";

export interface PhoneVerifyPayload {
  // firstName: string;
  // lastName: string;
  phoneNumber: string;
}

/* ---------------- VALIDATION SCHEMA ---------------- */
const schema = yup.object().shape({
  // firstName: yup.string().required("First name is required"),
  // lastName: yup.string().required("Last name is required"),

  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+\d{10,15}$/, "Enter a valid phone number"),
});

const ForgotPassword = () => {
  const [existsModal, setExistsModal] = useState(false);
  const [payloads, setPayloads] = useState<PhoneVerifyPayload | null>(null);

  const { mutateAsync: requestnewPasswordLink, isPending } =
    useUserRequestNewPasswordLink();

  const {
    // register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const payload = {
      // firstName: data?.firstName.toLowerCase(),
      // lastName: data?.lastName.toLowerCase(),
      phoneNumber: data?.phoneNumber,
    };

    try {
      const resp = await requestnewPasswordLink(payload);
      if (resp?.isSuccess) {
        setExistsModal(true);
        setPayloads(payload);
        reset({
          // firstName: "",
          // lastName: "",
          phoneNumber: "",
        });
      }
    } catch (error) {
      let message = "Something went wrong. Please try again.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      console.log("error in forgot password", error);
      toast.error(message);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="font-mona text-3xl font-display font-bold text-[#000000] mb-2">
          Forgot Your Password?
        </h1>
        <p className="font-mona text-[#000000]">
          Enter your phone number. We’ll send you a secure link to reset your
          password.
        </p>
      </div>

      {/* ---------------- FORM ---------------- */}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* first name */}
        {/* <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
            errors.firstName ? "border-red-500" : "border-[#FFFFFF]"
          }`}
        >
          <img
            src="/../icons/name-icon.svg"
            alt="name"
            className="w-4 h-4 mt-2.5"
          />
          <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

          <div className="flex flex-col w-full">
            <label className="text-[12px] text-[#616161] font-medium font-mona">
              First Name
            </label>
            <Input
              type="text"
              placeholder="John"
              {...register("firstName")}
              className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0"
            />
          </div>
        </div>
        {errors.firstName && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.firstName.message}
          </p>
        )} */}

        {/* last name */}
        {/* <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
            errors.lastName ? "border-red-500" : "border-[#FFFFFF]"
          }`}
        >
          <img
            src="/../icons/name-icon.svg"
            alt="name-icon"
            className="w-4 h-4 mt-2.5"
          />
          <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

          <div className="flex flex-col w-full">
            <label className="text-[12px] text-[#616161] font-medium font-mona">
              Last Name
            </label>
            <Input
              type="text"
              placeholder="Doe"
              {...register("lastName")}
              className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0"
            />
          </div>
        </div>
        {errors.lastName && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.lastName.message}
          </p>
        )} */}

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
                fontSize: "14px",
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

        {/* SUBMIT */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 flex items-center justify-center  bg-[#00BCD4] hover:bg-[#00BCD4] text-[#212121] font-mona font-semibold rounded-xl shadow-lg cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submit...
            </>
          ) : (
            "Submit"
          )}
        </Button>
        {/* already account */}
        <div className="text-center font-mona">
          <p className="text-sm text-gray-600">
            Back to Sign In?{" "}
            <Link
              to={`/${ROUTES.auth.login}`}
              className="text-[#12bdd4] font-medium"
            >
              Click Here
            </Link>
          </p>
        </div>
      </form>

      {payloads && (
        <ResendLinkForForgotPassModal
          isOpen={existsModal}
          onClose={() => setExistsModal(false)}
          payload={payloads}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
