import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Eye, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ROUTES } from "@/utils/routeConstants";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  useProviderNPIVerify,
  useProviderPhoneVerify,
  useProviderSignup,
} from "@/hooks/useUserAuth";

import { AxiosError } from "axios";
import AccountAlreadySetUpModalForProvider from "./component/AccountAlreadySetUpModalForProvider";
import { toast } from "sonner";
import CompleteRegistartionModal from "../sharePin/component/CompleteRegistartionModal";

type RegistrationForm = {
  npi: string;
  providerName: string;
  contactName: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  phoneNumber: string;
  password: string;
  email: string;
  terms: boolean;
};

// -------------------- Validation Schema --------------------
const schema = yup.object().shape({
  npi: yup
    .string()
    .required("NPI Number is required")
    .matches(/^\d{10}$/, "PIN must be exactly 6 digits"),

  providerName: yup.string().required("Provider name is required"),
  contactName: yup.string().required("Point of contact name is required"),
  address: yup.object({
    street: yup.string().required("Street is required."),
    city: yup.string().required("City is required."),
    state: yup.string().required("State is required."),
    zip: yup.string().required("Zip is required."),
    country: yup.string().required("Country is required."),
  }),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^\+\d{10,15}$/, "Enter a valid phone number"),

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&#^()_\-+={}[\]|;:'",.<>/~`]/,
      "Password must contain at least one special character",
    ),
  terms: yup
    .boolean()
    .oneOf([true], "You must accept the terms")
    .required("You must accept the terms and conditions"),
});

const CreateProviderAccount = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [existsModal, setExistsModal] = useState(false);
  const [completeRegModal, setCompleteRegModal] = useState(false);
  const [existsPhone, setExistsPhone] = useState<string | null>(null);
  const [isNPIExists, setIsNPIExists] = useState(false);

  const { mutateAsync: existingProviderNPICheck } = useProviderNPIVerify();
  const { mutateAsync: existingProviderPhoneCheck } = useProviderPhoneVerify();
  const { mutateAsync: providerSignup } = useProviderSignup();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
    clearErrors,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const lastCheckedRef = useRef<string | null>(null);

  const checkExistingProviderNPI = async () => {
    const npi = watch("npi");

    if (!npi) return;

    // prevent duplicate API calls
    if (lastCheckedRef.current === npi) return;
    lastCheckedRef.current = npi;

    const payload = {
      npi: npi,
    };

    try {
      await existingProviderNPICheck(payload);
    } catch (err) {
      console.log("NPI check failed", err);
      if (err instanceof AxiosError) {
        const status = err?.response?.status;
        const exists = err?.response?.data?.data?.exists === true;
        if (status === 400 && exists) {
          setIsNPIExists(true);

          setError("npi", {
            type: "manual",
            message: "An account already exists with this NPI number",
          });
        }
      }
    }
  };

  const lastCheckedPhoneRef = useRef<string | null>(null);

  const checkExistingProviderPhone = async () => {
    const phone = watch("phoneNumber");

    if (!phone) return;

    const uniqueKey = `${phone}`;

    // prevent duplicate API calls
    if (lastCheckedPhoneRef.current === uniqueKey) return;
    lastCheckedPhoneRef.current = uniqueKey;

    const payload = {
      phoneNumber: phone,
    };

    try {
      await existingProviderPhoneCheck(payload);
    } catch (err) {
      console.log("Phone check failed", err);
      if (err instanceof AxiosError) {
        const status = err?.response?.status;
        const exists = err?.response?.data?.data?.accountExists === true;
        if (status === 409 && exists) {
          setExistsPhone(phone);
          setExistsModal(true);
        }
      }
    }
  };

  const onSubmit = async (data: RegistrationForm) => {
    if (isNPIExists) {
      setError("npi", {
        type: "manual",
        message: "An account already exists with this NPI number",
      });
      return;
    }
    const { terms, ...restData } = data;
    try {
      const resp = await providerSignup(restData);
      // console.log("resp", resp);
      if (resp?.isSuccess) {
        setCompleteRegModal(true);
        reset();
      }
    } catch (error) {
      let message = "Something went wrong. Please try again.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      console.log("error in provider registartion", error);
      toast.error(message);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12 no-ios-zoom">
      <div className="text-center mb-8">
        <h1 className="font-mona text-3xl font-display font-bold text-[#000000] mb-2">
          Create your provider account
        </h1>
        <p className="font-mona text-[#000000]">
          Enter practice details. Phone number will be your login.
        </p>
      </div>

      {/* -------------------- Form -------------------- */}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* npi */}
        <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm  ${
            errors.npi ? "border-red-500" : "border-[#FFFFFF]"
          }`}
        >
          <img
            src="/../icons/npi-number-icon.svg"
            alt="npi"
            className="w-4 h-4 mt-2.5"
          />
          <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

          <div className="flex flex-col w-full">
            <label className="text-sm text-[#424242] font-medium font-mona">
              NPI Number
            </label>
            <Input
              type="text"
              placeholder="Enter your 10-digit NPI"
              autoComplete="one-time-code"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              {...register("npi")}
              onInput={(e: React.FormEvent<HTMLInputElement>) => {
                const value = e.currentTarget.value.replace(/\D/g, "");
                e.currentTarget.value = value;

                setIsNPIExists(false);

                if (errors.npi?.type === "manual") {
                  clearErrors("npi");
                  lastCheckedRef.current = null;
                }
              }}
              onBlur={checkExistingProviderNPI}
              className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0"
            />
          </div>
        </div>
        {errors.npi && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.npi.message}
          </p>
        )}

        {/* providerName */}
        <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
            errors.providerName ? "border-red-500" : "border-[#FFFFFF]"
          }`}
        >
          <img
            src="/../icons/provider-name-icon.svg"
            alt="name"
            className="w-4 h-4 mt-2.5"
          />
          <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

          <div className="flex flex-col w-full">
            <label className="text-sm text-[#424242] font-medium font-mona">
              Provider Name
            </label>
            <Input
              type="text"
              placeholder="BrightCare Internal Medicine"
              {...register("providerName")}
              className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0"
            />
          </div>
        </div>
        {errors.providerName && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.providerName.message}
          </p>
        )}

        {/* contact name */}
        <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
            errors.contactName ? "border-red-500" : "border-[#FFFFFF]"
          }`}
        >
          <img
            src="/../icons/name-icon.svg"
            alt="name-icon"
            className="w-4 h-4 mt-2.5"
          />
          <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

          <div className="flex flex-col w-full">
            <label className="text-sm text-[#424242] font-medium font-mona">
              Point of Contact Name
            </label>
            <Input
              type="text"
              placeholder="Dr. John Doe"
              {...register("contactName")}
              className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0"
            />
          </div>
        </div>
        {errors.contactName && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.contactName.message}
          </p>
        )}

        {/* phone number country code*/}
        <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
            errors.phoneNumber ? "border-red-500" : "border-[#FFFFFF]"
          }`}
        >
          <img src="/../icons/call-icon.svg" className="w-4 h-4 mt-2.5" />
          <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

          <div className="flex flex-col w-full">
            <label className="text-sm text-[#424242] font-medium font-mona">
              Phone Number
            </label>

            <PhoneInput
              country={"us"}
              enableSearch
              countryCodeEditable={false}
              value={watch("phoneNumber")}
              onChange={(value) => {
                // const digitsOnly = `${value}`.replace(/\D/g, "");
                // const e164 = digitsOnly ? `+${digitsOnly}` : "";
                const e164 = value ? `+${value}` : "";
                setValue("phoneNumber", e164, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }}
              inputProps={{
                onBlur: checkExistingProviderPhone,
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
              containerStyle={{ width: "100%" }}
            />
          </div>
        </div>

        {errors.phoneNumber && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.phoneNumber.message}
          </p>
        )}
        <p className="-mt-2 text-[#4A4A4A] font-medium text-sm">
          Phone will be used as your login and must be unique.
        </p>

        {/* email */}
        <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm  ${
            errors.email ? "border-red-500" : "border-[#FFFFFF]"
          }`}
        >
          <img
            src="/../icons/email-icon.svg"
            alt="email"
            className="w-4 h-4 mt-2.5"
          />
          <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

          <div className="flex flex-col w-full">
            <label className="text-sm text-[#424242] font-medium font-mona">
              Provider Email
            </label>
            <Input
              type="email"
              placeholder="example@email.com"
              {...register("email")}
              className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0"
            />
          </div>
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.email.message}
          </p>
        )}

        <>
          <p className="mb-2 text-[#4A4A4A] font-medium text-sm">Address</p>

          {/* street */}
          <div
            className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
              errors.address?.street ? "border-red-500" : "border-[#FFFFFF]"
            }`}
          >
            <img
              src="/../icons/personal-address-icon.svg"
              alt="name"
              className="w-4 h-4 mt-2.5"
            />
            <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

            <div className="flex flex-col w-full">
              <label className="text-sm text-[#424242] font-medium font-mona">
                Street
              </label>
              <Input
                type="text"
                placeholder="123 Main St"
                {...register("address.street")}
                className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0"
              />
            </div>
          </div>
          {errors.address?.street && (
            <p className="text-red-500 text-xs -mt-4 ml-1">
              {errors.address?.street.message}
            </p>
          )}

          {/* city */}
          <div
            className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 mt-3 shadow-sm ${
              errors.address?.city ? "border-red-500" : "border-[#FFFFFF]"
            }`}
          >
            <img
              src="/../icons/personal-address-icon.svg"
              alt="name"
              className="w-4 h-4 mt-2.5"
            />
            <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

            <div className="flex flex-col w-full">
              <label className="text-sm text-[#424242] font-medium font-mona">
                City
              </label>
              <Input
                type="text"
                placeholder="San Francisco"
                {...register("address.city")}
                className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0"
              />
            </div>
          </div>
          {errors.address?.city && (
            <p className="text-red-500 text-xs -mt-4 ml-1">
              {errors.address?.city.message}
            </p>
          )}

          {/* state */}
          <div
            className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 mt-3 shadow-sm ${
              errors.address?.state ? "border-red-500" : "border-[#FFFFFF]"
            }`}
          >
            <img
              src="/../icons/personal-address-icon.svg"
              alt="name"
              className="w-4 h-4 mt-2.5"
            />
            <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

            <div className="flex flex-col w-full">
              <label className="text-sm text-[#424242] font-medium font-mona">
                State
              </label>
              <Input
                type="text"
                placeholder="San Francisco"
                {...register("address.state")}
                className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0"
              />
            </div>
          </div>
          {errors.address?.state && (
            <p className="text-red-500 text-xs -mt-4 ml-1">
              {errors.address?.state.message}
            </p>
          )}

          {/* zip */}
          <div
            className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 mt-3 shadow-sm ${
              errors.address?.zip ? "border-red-500" : "border-[#FFFFFF]"
            }`}
          >
            <img
              src="/../icons/personal-address-icon.svg"
              alt="name"
              className="w-4 h-4 mt-2.5"
            />
            <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

            <div className="flex flex-col w-full">
              <label className="text-sm text-[#424242] font-medium font-mona">
                Zip
              </label>
              <Input
                type="text"
                placeholder="CA 94105"
                {...register("address.zip")}
                className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0"
              />
            </div>
          </div>
          {errors.address?.zip && (
            <p className="text-red-500 text-xs -mt-4 ml-1">
              {errors.address?.zip.message}
            </p>
          )}

          {/* country */}
          <div
            className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 mt-3 shadow-sm ${
              errors.address?.country ? "border-red-500" : "border-[#FFFFFF]"
            }`}
          >
            <img
              src="/../icons/personal-address-icon.svg"
              alt="name"
              className="w-4 h-4 mt-2.5"
            />
            <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

            <div className="flex flex-col w-full">
              <label className="text-sm text-[#424242] font-medium font-mona">
                Country
              </label>
              <Input
                type="text"
                placeholder="United State"
                {...register("address.country")}
                className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0"
              />
            </div>
          </div>
          {errors.address?.country && (
            <p className="text-red-500 text-xs -mt-4 ml-1">
              {errors.address?.country.message}
            </p>
          )}
        </>

        {/* password */}
        <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 mt-6 shadow-sm ${
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
            <label className="text-sm text-[#424242] font-medium font-mona">
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

        <div className="flex gap-2 items-start">
          <Checkbox
            checked={watch("terms") || false}
            onCheckedChange={(checked) => {
              const value = checked === true;
              setValue("terms", value, {
                shouldValidate: true,
                shouldTouch: true,
                shouldDirty: true,
              });
            }}
            className="w-4 h-4"
          />

          <div className="font-mona text-sm">
            I agree to the{" "}
            {/* <Link to="/login" className="text-[#00BCD4] text-sm">
              Terms of Service{" "}
            </Link>
            and{" "} */}
            <Link to="/terms-condition" className="text-[#00BCD4] text-sm">
              Terms and Conditions
            </Link>
          </div>
        </div>

        {errors.terms && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.terms.message}
          </p>
        )}

        {/* submit button */}
        <Button
          type="submit"
          disabled={isSubmitting || isNPIExists}
          className={`w-full h-12 bg-[#00BCD4] hover:bg-[#00BCD4] text-[#212121] font-mona font-semibold rounded-xl shadow-lg ${isSubmitting || isNPIExists ? "cursor-not-allowed opacity-60" : "cursor-pointer "}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Continue...
            </>
          ) : (
            "Continue"
          )}
        </Button>

        {/* already account */}
        <div className="text-center font-mona">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to={`/${ROUTES.auth.login}`}
              className="text-[#12bdd4] font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>

      <AccountAlreadySetUpModalForProvider
        isOpen={existsModal}
        onClose={() => setExistsModal(false)}
        phoneNumber={existsPhone}
      />

      <CompleteRegistartionModal
        isOpen={completeRegModal}
        onClose={() => setCompleteRegModal(false)}
        phoneNumber={existsPhone || ""}
      />
    </div>
  );
};

export default CreateProviderAccount;
