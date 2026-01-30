import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveParentForm } from "@/redux/slices/registrationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { ROUTES } from "@/utils/routeConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as yup from "yup";

// -------------------- Validation Schema --------------------
const schema = yup.object().shape({
  parentName: yup.string().required("Full name is required"),

  parentDateOfBirth: yup
    .string()
    .required("Date of birth is required")
    .test(
      "valid-parent-age",
      "Parent/Guardian must be at least 18 years old",
      (value) => {
        if (!value) return false;

        const dob = new Date(value);
        if (isNaN(dob.getTime())) return false;

        const today = new Date();

        // max age = 120
        const maxAgeDate = new Date();
        maxAgeDate.setFullYear(today.getFullYear() - 120);

        // min age = 18
        const minAdultDate = new Date();
        minAdultDate.setFullYear(today.getFullYear() - 18);

        return dob <= minAdultDate && dob >= maxAgeDate;
      }
    ),

  relationshipToMinor: yup.string().required("Relationship is required"),
});

const ParentDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openDob, setOpenDob] = useState(false);

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

  const { parentForm } = useAppSelector((state: any) => state.registration);

  useEffect(() => {
    if (parentForm) {
      reset(parentForm);

      // force update after reset()
      if (parentForm.relationshipToMinor) {
        setValue("relationshipToMinor", parentForm.relationshipToMinor, {
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false,
        });
      }
    }
  }, [parentForm]);

  const onSubmit = (data: any) => {
    dispatch(saveParentForm(data));
    navigate(`/${ROUTES.auth.sharePin}`);
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="font-mona text-3xl font-display font-bold text-[#000000] mb-2">
          Parent or Guardian Information Required
        </h1>
        <p className="font-mona text-[#000000]">
          To continue creating this account, we need the details of a parent or
          legal guardian. This helps us verify identity and provide secure
          access for minors.
        </p>
      </div>

      {/* -------------------- Form -------------------- */}
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* fullName */}
        <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
            errors.parentName ? "border-red-500" : "border-[#FFFFFF]"
          }`}
        >
          <img
            src="/../icons/group-icon.svg"
            alt="group-icon"
            className="w-4 h-4 mt-2.5"
          />
          <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

          <div className="flex flex-col w-full">
            <label className="text-[12px] text-[#616161] font-medium font-mona">
              Parent/Guardian Full Name
            </label>
            <Input
              type="text"
              placeholder="e.g., Sarah Thompson"
              {...register("parentName")}
              className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0"
            />
          </div>
        </div>
        {errors.parentName && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.parentName.message}
          </p>
        )}

        {/* parentdob */}
        <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
            errors.parentDateOfBirth ? "border-red-500" : "border-[#FFFFFF]"
          }`}
        >
          <img
            src="/../icons/calendar-icon.svg"
            alt="calendar-icon"
            className="w-4 h-4 mt-2.5"
          />
          <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

          <div className="flex flex-col w-full">
            <label className="text-[12px] text-[#616161] font-medium font-mona">
              Parent/Guardian Date of Birth
            </label>

            <Popover open={openDob} onOpenChange={setOpenDob}>
              <PopoverTrigger asChild>
                <button
                  onClick={() => setOpenDob(true)}
                  className="text-left border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] w-full focus-visible:ring-0 font-mona text-[#616161]"
                >
                  {watch("parentDateOfBirth")
                    ? format(new Date(watch("parentDateOfBirth")), "MM-dd-yyyy")
                    : "MM-DD-YYYY"}
                </button>
              </PopoverTrigger>

              <PopoverContent className="p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    watch("parentDateOfBirth")
                      ? new Date(watch("parentDateOfBirth"))
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

                    setValue("parentDateOfBirth", date.toISOString(), {
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

        {errors.parentDateOfBirth && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.parentDateOfBirth.message}
          </p>
        )}

        {/* Relationship */}

        <div
          className={`flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5 shadow-sm ${
            errors.relationshipToMinor ? "border-red-500" : "border-[#FFFFFF]"
          }`}
        >
          <img
            src="/../icons/family-icon.svg"
            alt="family-icon"
            className="w-4 h-4 mt-2.5"
          />
          <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

          <div className="flex flex-col w-full">
            <label className="text-[12px] text-[#616161] font-medium font-mona">
              Relationship
            </label>

            <Select
              key={watch("relationshipToMinor")}
              value={watch("relationshipToMinor") || ""}
              onValueChange={(v) =>
                setValue("relationshipToMinor", v, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            >
              <SelectTrigger
                className="border-0 shadow-none p-0 mt-0.5 text-[16px] 
                   text-[#616161] focus:ring-0 focus:ring-offset-0 
                   focus-visible:ring-0 font-mona"
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>

              <SelectContent className="rounded-xl">
                <SelectItem value="father">Father</SelectItem>
                <SelectItem value="mother">Mother</SelectItem>
                <SelectItem value="brother">Brother</SelectItem>
                <SelectItem value="sister">Sister</SelectItem>
                <SelectItem value="spouse">Spouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {errors.relationshipToMinor && (
          <p className="text-red-500 text-xs -mt-4 ml-1">
            {errors.relationshipToMinor.message}
          </p>
        )}

        {/*  button */}
        <div className="flex items-center gap-4 mt-6 font-mona ">
          {/* Back Button */}
          <button
            type="button"
            className="w-full h-[55px] border border-[#00BCD4] text-[#00BCD4] rounded-xl font-medium cursor-pointer"
            onClick={() => navigate(`/${ROUTES.auth.createAccount}`)}
          >
            Back
          </button>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[55px] bg-[#00BCD4] text-[#000000] rounded-xl font-medium cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Continue...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParentDetails;
