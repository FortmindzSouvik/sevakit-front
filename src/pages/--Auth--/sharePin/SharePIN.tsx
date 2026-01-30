import { Input } from "@/components/ui/input";
import { useUserSignup } from "@/hooks/useUserAuth";
import { clearRegistration } from "@/redux/slices/registrationSlice";
import { useAppDispatch, useAppSelector, type RootState } from "@/redux/store";
import { ROUTES } from "@/utils/routeConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import * as yup from "yup";
import CompleteRegistartionModal from "./component/CompleteRegistartionModal";
import { toast } from "sonner";
import { AxiosError } from "axios";

// -------------------- Validation Schema --------------------
const isSequential = (value?: string) => {
  if (!value) return false;

  const digits = value.split("").map(Number);

  let isAscending = true;
  let isDescending = true;

  for (let i = 1; i < digits.length; i++) {
    if (digits[i] !== digits[i - 1] + 1) {
      isAscending = false;
    }
    if (digits[i] !== digits[i - 1] - 1) {
      isDescending = false;
    }
  }

  return !(isAscending || isDescending);
};

const schema = yup.object().shape({
  sharePin: yup
    .string()
    .required("Pin is required")
    .matches(/^\d{6}$/, "PIN must be exactly 6 digits")
    .test("no-sequence", "Sequential numbers are not allowed", (value) =>
      isSequential(value)
    ),
});

const getAge = (dob?: string) => {
  if (!dob) return 0;

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const SharePIN = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [showPin, setShowPin] = useState(false);
  const [existsModal, setExistsModal] = useState(false);
  const [phone, setPhone] = useState("");

  const { accountForm, parentForm } = useAppSelector(
    (state: RootState) => state.registration
  );

  const { mutateAsync: signup } = useUserSignup();

  const age = getAge(accountForm?.dateOfBirth || "");

  const goBack = () => {
    if (age <= 16) {
      navigate(`/${ROUTES.auth.parentDetails}`);
    } else {
      navigate(`/${ROUTES.auth.createAccount}`);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    const { terms, phoneNumber, firstName, lastName, ...restAccountForm } =
      accountForm || {};
    const rawPhoneNumber = phoneNumber || "";
    // const phoneNumberWithoutPlus = rawPhoneNumber.replace(/^\+/, "");
    setPhone(rawPhoneNumber);
    const cleanedAccountForm = {
      ...restAccountForm,
      phoneNumber: rawPhoneNumber,
      firstName: firstName?.toLowerCase(),
      lastName: lastName?.toLowerCase(),
    };
    const basePayload = {
      ...cleanedAccountForm,
      ...data,
    };

    const payload =
      age <= 16
        ? {
            ...basePayload,
            ...parentForm,
          }
        : basePayload;


    try {
      const resp = await signup(payload);

      if (resp?.isSuccess) {
        dispatch(clearRegistration());
        setExistsModal(true);
      }
    } catch (error) {
      let message = "Something went wrong. Please try again.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      console.log("error in registartion", error);
      toast.error(message);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="font-mona text-3xl font-display font-bold text-[#000000] mb-2">
          Create Your Share PIN{" "}
        </h1>
        <p className="font-mona text-[#000000]">
          This PIN allows you to securely share your health profile with
          providers, caregivers, and trusted individuals. Keep it safe and
          memorable.
        </p>
      </div>

      {/* -------------------- Form -------------------- */}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* password */}
        <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
            errors.sharePin ? "border-red-500" : "border-[#FFFFFF]"
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
              Share PIN
            </label>

            <Input
              type={showPin ? "text" : "password"}
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
        {errors.sharePin && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.sharePin.message}
          </p>
        )}

        {/*  button */}
        <div className="flex items-center gap-4 mt-6 font-mona ">
          {/* Back Button */}
          <button
            type="button"
            className="w-full h-[55px] border border-[#00BCD4] text-[#00BCD4] rounded-xl font-medium cursor-pointer "
            onClick={() => goBack()}
          >
            Back
          </button>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex justify-center items-center w-full h-full p-4 bg-[#00BCD4] text-[#000000] rounded-xl font-medium cursor-pointer ${
              isSubmitting
                ? "cursor-not-allowed pointer-events-none opacity-70"
                : "cursor-pointer"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
              </>
            ) : (
              "Register"
            )}
          </button>
        </div>
      </form>
      <CompleteRegistartionModal
        isOpen={existsModal}
        onClose={() => setExistsModal(false)}
        phoneNumber={phone}
      />
    </div>
  );
};

export default SharePIN;
