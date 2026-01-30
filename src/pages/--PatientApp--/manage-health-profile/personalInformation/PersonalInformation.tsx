import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "@/utils/routeConstants";
import TextInputField from "@/components/form/TextInputField";
import SelectField from "@/components/form/SelectField";
import DatePickerField from "@/components/form/DatePickerField";
import PhoneNumberField from "@/components/form/PhoneNumberField";
import PhotoUpload from "@/components/form/PhotoUpload";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppSelector } from "@/redux/store";
import { useFetchData } from "@/hooks/useFetchData";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { toast } from "sonner";
import useUpdateData from "@/hooks/useUpdateData";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import PersonalInfoSkeleton from "@/components/skeletonLoader/PersonalInfoSkeleton";

type PersonalInfoFormValues = {
  profilePicture: {
    fileUrl: string;
    s3Key: string;
  };
  fullName: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  address: {
    street: string;
  };
};

export const personalInfoSchema = yup.object({
  profilePicture: yup.object({
    fileUrl: yup.string().required("Profile picture is required"),
    s3Key: yup.string().required(),
  }),
  fullName: yup
    .string()
    .required("Full name is required")
    .min(3, "Minimum 3 characters"),

  gender: yup.string().required("Gender is required"),
  dob: yup.string().required("Date of birth is required"),

  phone: yup
    .string()
    .required("Phone number is required")
    .min(10, "Enter a valid phone number"),

  email: yup
    .string()
    .required("Email is required")
    .email("Enter a valid email"),

  address: yup.object({
    street: yup.string().required("Address is required."),
  }),
});

export default function PersonalInformation() {
  const navigate = useNavigate();
  const [profileVisible, setProfileVisible] = useState(false);
  const [identityVisible, setIdentityVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [addressVisible, setAddressVisible] = useState(false);

  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";
  const { data: userDetails, isFetching } = useFetchData(
    apiRoutes.getParticularUserList(userId),
    ["get-user-list"],
    !!userId
  );

  const { mutateAsync: updateUserDetails, isPending } = useUpdateData([
    "update-user-detailss",
  ]);

  const capitalizeWords = (value: string = "") =>
    value
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<PersonalInfoFormValues>({
    resolver: yupResolver(personalInfoSchema),
    mode: "onBlur",
    defaultValues: {
      profilePicture: {
        fileUrl: "",
        s3Key: "",
      },
      fullName: "",
      gender: "",
      dob: "",
      phone: "",
      email: "",
      address: {
        street: "",
      },
    },
  });

  useEffect(() => {
    if (!userDetails?.data) return;

    const user = userDetails?.data;

    reset({
      fullName: capitalizeWords(
        `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      ),
      gender: user?.gender || "",
      dob: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",
      phone: user.phoneNumber ?? "",
      email: user.email ?? "",
      address: {
        street: user.address?.street || "",
      },
      profilePicture: {
        fileUrl: user.profilePicture?.fileUrl ?? "",
        s3Key: user.profilePicture?.s3Key ?? "",
      },
    });

    // visibility toggles
    setProfileVisible(!!user.isProfilePictureVisible);
    setIdentityVisible(!!user.isIdentityVisible);
    setContactVisible(!!user.isContactVisible);
    setAddressVisible(!!user.isAddressVisible);
  }, [userDetails, reset]);

  const handleVisibilityToggle = async (
    key:
      | "isProfilePictureVisible"
      | "isIdentityVisible"
      | "isContactVisible"
      | "isAddressVisible",
    value: boolean,
    rollback: (v: boolean) => void
  ) => {
    try {
      await updateUserDetails({
        endpoint: apiRoutes.updateUserDetails(userId),
        data: {
          [key]: value,
        },
      });
    } catch (error) {
      rollback(!value);
      toast.error("Failed to update visibility");
    }
  };

  const onSubmit = async (data: any) => {
    // const [firstName, ...lastNameParts] = data.fullName.split(" ");

    const payload = {
      // firstName: firstName.toLowerCase(),
      // lastName: lastNameParts.join(" ").toLowerCase(),
      // phoneNumber: data.phone,
      // email: data.email,
      dateOfBirth: data.dob,
      address: {
        street: data?.address?.street,
      },
      gender: data?.gender,
      profilePicture: {
        fileUrl: data.profilePicture.fileUrl,
        s3Key: data.profilePicture.s3Key,
      },
    };

    // console.log("FINAL PAYLOAD", payload);

    try {
      await updateUserDetails({
        endpoint: apiRoutes.updateUserDetails(userId),
        data: payload,
      });
      toast.success("Your information Updated Successfully");
    } catch (error) {
      let message = "Failed to update user details.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    }
  };
  if (isFetching) {
    return <PersonalInfoSkeleton />;
  }
  const genderValue = watch("gender");

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5 font-mona">
      {/* Header */}
      <div className="flex items-center justify-center relative mb-8">
        <button className="absolute left-0">
          <img
            src="/../icons/back-arrow-icon.svg"
            alt="back arrow"
            className="w-fit h-fit cursor-pointer"
            onClick={() =>
              navigate(`/${ROUTES.role.patient}/${ROUTES.patient.dashboard}`)
            }
          />
        </button>
        <h1 className="text-base font-medium font-mona text-[#000000] ">
          Personal Information
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* personal address */}
        <div className="bg-[#F7FDFF] rounded-2xl p-5 space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
                src="/../icons/profile-photo-icon.png"
                className="w-fit h-fit"
              />
              <p className="font-semibold">Profile Photo</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-1 rounded-full font-mona font-medium text-sm
                ${
                  profileVisible
                    ? "border border-[#00A9B8] bg-[#B9F2F8] text-[#000000]"
                    : "border border-[#E0E0E0] bg-[#E0E0E0] text-[#000000]"
                }`}
              >
                {profileVisible ? "Visible" : "Hidden"}{" "}
              </span>

              <Switch
                id="photo-switch"
                className="w-12 h-6"
                checked={profileVisible}
                onCheckedChange={(value) => {
                  setProfileVisible(value);
                  handleVisibilityToggle(
                    "isProfilePictureVisible",
                    value,
                    setProfileVisible
                  );
                }}
              />
            </div>
          </div>
          {/* profile photo   */}

          <PhotoUpload
            label="Profile Photo"
            name="profilePicture"
            icon="/../icons/upload-icon.svg"
            register={register}
            setValue={setValue}
            clearErrors={clearErrors}
            error={errors?.profilePicture?.fileUrl}
            rename={"Profile Photo"}
            value={watch("profilePicture")}
          />
        </div>

        {/* personal identity */}
        <div className="bg-[#F7FDFF] rounded-2xl p-5 space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
                src="/../icons/personal-identity-icon.svg"
                className="w-fit h-fit"
              />
              <p className="font-semibold">Personal Identity</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-1 rounded-full font-mona font-medium text-sm
                ${
                  identityVisible
                    ? "border border-[#00A9B8] bg-[#B9F2F8] text-[#000000]"
                    : "border border-[#E0E0E0] bg-[#E0E0E0] text-[#000000]"
                }`}
              >
                {identityVisible ? "Visible" : "Hidden"}{" "}
              </span>

              <Switch
                id="identity-switch"
                className="w-12 h-6"
                checked={identityVisible}
                onCheckedChange={(value) => {
                  setIdentityVisible(value);
                  handleVisibilityToggle(
                    "isIdentityVisible",
                    value,
                    setIdentityVisible
                  );
                }}
              />
            </div>
          </div>
          {/* Full  Name */}
          <TextInputField
            label="Full Name"
            placeholder="John Doe"
            icon="/../icons/name-icon.svg"
            name="fullName"
            disabled
            register={register}
            error={errors.fullName}
          />

          {/* gender Entry */}
          <SelectField
            key={genderValue || "gender"}
            label="Gender"
            icon="/../icons/tv-icon.svg"
            value={genderValue}
            onChange={(v) =>
              setValue("gender", v, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: false,
              })
            }
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
            error={errors.gender}
          />

          {/* dob */}
          <DatePickerField
            label="Date of Birth"
            icon="/../icons/calendar-icon.svg"
            value={watch("dob")}
            onChange={(v) =>
              setValue("dob", v, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
            error={errors.dob}
          />
        </div>

        {/* personal contact */}
        <div className="bg-[#F7FDFF] rounded-2xl p-5 space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
                src="/../icons/personal-contact-icon.svg"
                className="w-fit h-fit"
              />
              <p className="font-semibold">Personal Contact</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-1 rounded-full font-mona font-medium text-sm
                ${
                  contactVisible
                    ? "border border-[#00A9B8] bg-[#B9F2F8] text-[#000000]"
                    : "border border-[#E0E0E0] bg-[#E0E0E0] text-[#000000]"
                }`}
              >
                {contactVisible ? "Visible" : "Hidden"}{" "}
              </span>

              <Switch
                id="contact-switch"
                className="w-12 h-6"
                checked={contactVisible}
                onCheckedChange={(value) => {
                  setContactVisible(value);
                  handleVisibilityToggle(
                    "isContactVisible",
                    value,
                    setContactVisible
                  );
                }}
              />
            </div>
          </div>

          {/* phone  */}
          <PhoneNumberField
            label="Phone Number"
            icon="/../icons/call-icon.svg"
            value={watch("phone")}
            error={errors.phone}
            disabled
            onChange={(v) =>
              setValue("phone", v, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }
          />

          {/* email */}
          <TextInputField
            label="Email"
            disabled
            placeholder="john.doe@example.com"
            icon="/../icons/email-icon.svg"
            name="email"
            register={register}
            error={errors.email}
          />
        </div>

        {/* personal address */}
        <div className="bg-[#F7FDFF] rounded-2xl p-5 space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img
                src="/../icons/personal-address-icon.svg"
                className="w-fit h-fit"
              />
              <p className="font-semibold">Personal Address</p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-1 rounded-full font-mona font-medium text-sm
                ${
                  addressVisible
                    ? "border border-[#00A9B8] bg-[#B9F2F8] text-[#000000]"
                    : "border border-[#E0E0E0] bg-[#E0E0E0] text-[#000000]"
                }`}
              >
                {addressVisible ? "Visible" : "Hidden"}{" "}
              </span>

              <Switch
                id="address-switch"
                className="w-12 h-6"
                checked={addressVisible}
                onCheckedChange={(value) => {
                  setAddressVisible(value);
                  handleVisibilityToggle(
                    "isAddressVisible",
                    value,
                    setAddressVisible
                  );
                }}
              />
            </div>
          </div>
          {/* address   */}
          <TextInputField
            label="Address"
            placeholder="2813 Walnut St, Austin, TX, 78701, United States"
            icon="/../icons/calendar-icon.svg"
            name="address.street"
            register={register}
            error={errors.address?.street}
          />
        </div>
        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center justify-center w-full bg-[#00BCD4] text-[#212121] py-4 rounded-xl font-semibold mt-3 cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
