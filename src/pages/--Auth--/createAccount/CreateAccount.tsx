import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Eye, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ROUTES } from "@/utils/routeConstants";
import {
  clearRegistration,
  saveAccountForm,
} from "@/redux/slices/registrationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useUserNamePhoneVerify } from "@/hooks/useUserAuth";
import AccountAlreadySetUpModal from "./component/AccountAlreadySetUpModal";
import { AxiosError } from "axios";

// -------------------- Validation Schema --------------------
const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  dateOfBirth: yup
    .string()
    .required("Date of birth is required")
    .test("valid-age", "Invalid date of birth", (value) => {
      if (!value) return false;
      const date = new Date(value);
      if (isNaN(date.getTime())) return false;

      const today = new Date();
      const maxAge = 120;
      const minAllowed = new Date();
      minAllowed.setFullYear(today.getFullYear() - maxAge);

      return date <= today && date >= minAllowed;
    }),

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

const CreateAccount = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [openDob, setOpenDob] = useState(false);
  const [existsModal, setExistsModal] = useState(false);
  const [existsPhone, setExistsPhone] = useState<string | null>(null);
  const [existsFirstName, setExistsFirstName] = useState<string | null>(null);
  const [existsLastName, setExistsLastName] = useState<string | null>(null);
  const { accountForm } = useAppSelector((state: any) => state.registration);

  const { mutateAsync: existingUserCheck } = useUserNamePhoneVerify();

  useEffect(() => {
    if (accountForm) {
      reset(accountForm);
    }
  }, [accountForm]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const getAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // If birthday hasn't occurred yet this year → subtract 1
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const lastCheckedRef = useRef<string | null>(null);

  const checkExistingUser = async () => {
    const phone = watch("phoneNumber");
    const firstName = watch("firstName");
    const lastName = watch("lastName");

    if (!phone || !firstName || !lastName) return;

    const parsed = parsePhoneNumberFromString(phone);
    if (!parsed || !parsed.isValid()) return;

    // const phoneWithoutPlus = phone ? phone.replace("+", "") : "";

    const uniqueKey = `${firstName}-${lastName}-${phone}`;

    // prevent duplicate API calls
    if (lastCheckedRef.current === uniqueKey) return;
    lastCheckedRef.current = uniqueKey;

    const payload = {
      firstName: firstName.toLowerCase(),
      lastName: lastName.toLowerCase(),
      phoneNumber: phone,
    };

    try {
      await existingUserCheck(payload);
    } catch (err) {
      console.log("Phone check failed", err);
      if (err instanceof AxiosError) {
        const status = err?.response?.status;
        const exists = err?.response?.data?.data?.accountExists === true;
        if (status === 409 && exists) {
          setExistsPhone(phone);
          setExistsFirstName(firstName);
          setExistsLastName(lastName);
          setExistsModal(true);
        }
      }
    }
  };

  const onSubmit = (data: any) => {
    dispatch(clearRegistration());
    dispatch(saveAccountForm(data));
    const age = getAge(data.dateOfBirth);

    if (age <= 16) {
      navigate(`/${ROUTES.auth.parentDetails}`);
    } else {
      navigate(`/${ROUTES.auth.sharePin}`);
    }
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12 no-ios-zoom">
      <div className="text-center mb-8">
        <h1 className="font-mona text-3xl font-display font-bold text-[#000000] mb-2">
          Create Your KIT Account
        </h1>
        <p className="font-mona text-[#000000]">
          Keep your health information together in one secure place.
        </p>
      </div>

      {/* -------------------- Form -------------------- */}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            <label className="text-sm text-[#616161] font-medium font-mona">
              Email Address
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

        {/* first name */}
        <div
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
            <label className="text-sm text-[#616161] font-medium font-mona">
              First Name
            </label>
            <Input
              type="text"
              placeholder="John"
              {...register("firstName")}
              onBlur={checkExistingUser}
              className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0"
            />
          </div>
        </div>
        {errors.firstName && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.firstName.message}
          </p>
        )}

        {/* last name */}
        <div
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
            <label className="text-sm text-[#616161] font-medium font-mona">
              Last Name
            </label>
            <Input
              type="text"
              placeholder="Doe"
              {...register("lastName")}
              onBlur={checkExistingUser}
              className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0"
            />
          </div>
        </div>
        {errors.lastName && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.lastName.message}
          </p>
        )}

        {/* dob */}
        <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
            errors.dateOfBirth ? "border-red-500" : "border-[#FFFFFF]"
          }`}
        >
          <img
            src="/../icons/calendar-icon.svg"
            alt="calendar-icon"
            className="w-4 h-4 mt-2.5"
          />
          <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

          <div className="flex flex-col w-full">
            <label className="text-sm text-[#616161] font-medium font-mona">
              Date of Birth
            </label>

            <Popover open={openDob} onOpenChange={setOpenDob}>
              <PopoverTrigger asChild>
                <button
                  onClick={() => setOpenDob(true)}
                  className="text-left border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] w-full focus-visible:ring-0 font-mona text-[#616161]"
                >
                  {watch("dateOfBirth")
                    ? format(new Date(watch("dateOfBirth")), "MM-dd-yyyy")
                    : "MM-DD-YYYY"}
                </button>
              </PopoverTrigger>

              <PopoverContent className="p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    watch("dateOfBirth")
                      ? new Date(watch("dateOfBirth"))
                      : undefined
                  }
                  captionLayout="dropdown"
                  onSelect={(date: any) => {
                    if (!date) return;

                    const today = new Date();
                    const minDate = new Date();
                    minDate.setFullYear(today.getFullYear() - 120);

                    // Prevent future or older than 120 years
                    if (date > today) return;
                    if (date < minDate) return;

                    setValue("dateOfBirth", date.toISOString(), {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                    setOpenDob(false);
                  }}
                  disabled={(date: any) => {
                    const today = new Date();
                    const minDate = new Date();
                    minDate.setFullYear(today.getFullYear() - 120);

                    return date > today || date < minDate;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {errors.dateOfBirth && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.dateOfBirth.message}
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
            <label className="text-sm text-[#616161] font-medium font-mona">
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
                onBlur: checkExistingUser,
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
            <label className="text-sm text-[#616161] font-medium font-mona">
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
            I agree to the {" "}
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
          disabled={isSubmitting}
          className="w-full h-12 bg-[#00BCD4] hover:bg-[#00BCD4] text-[#212121] font-mona font-semibold rounded-xl shadow-lg cursor-pointer"
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

      <AccountAlreadySetUpModal
        isOpen={existsModal}
        onClose={() => setExistsModal(false)}
        phoneNumber={existsPhone}
        firstName={existsFirstName}
        lastName={existsLastName}
      />
    </div>
  );
};

export default CreateAccount;
