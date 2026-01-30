import PhoneNumberField from "@/components/form/PhoneNumberField";
import TextInputField from "@/components/form/TextInputField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useUpdateData from "@/hooks/useUpdateData";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

type ProfileForm = {
  id?: string;
  providerName: string;
  contactName: string;
  npi: string;
  phoneNumber: string;
  email: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
};
type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ProfileForm | null;
  setProviderInfo?: (value: ProfileForm | null) => void;
};
const schema = yup.object().shape({
  providerName: yup.string().required("provider name is required"),
  contactName: yup.string().required("Point of contact name is required"),
  npi: yup.string().required("NPI number is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  email: yup.string().required("Email is required"),
  // address: yup.string().required("Address is required"),
  address: yup.object({
    street: yup.string().required("Street is required."),
    city: yup.string().required("City is required."),
    state: yup.string().required("State is required."),
    zip: yup.string().required("Zip is required."),
    country: yup.string().required("Country is required."),
  }),
});
const EditProfileInfo = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  setProviderInfo,
}: Props) => {
  const { mutateAsync: updateProviderDetails, isPending } = useUpdateData([
    "update-provider-detailss",
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      providerName: "",
      contactName: "",
      npi: "",
      phoneNumber: "",
      email: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        zip: "",
      },
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      reset({
        providerName: initialData?.providerName,
        contactName: initialData?.contactName,
        npi: initialData?.npi,
        phoneNumber: initialData?.phoneNumber,
        email: initialData?.email,
        address: {
          street: initialData?.address?.street,
          city: initialData?.address?.city,
          state: initialData?.address?.state,
          country: initialData?.address?.country,
          zip: initialData?.address?.zip,
        },
      });
    } else {
      reset({
        providerName: "",
        contactName: "",
        npi: "",
        phoneNumber: "",
        email: "",
        address: {
          street: "",
          city: "",
          state: "",
          country: "",
          zip: "",
        },
      });
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = async (data: ProfileForm) => {
    const payload = {
      providerName: data?.providerName,
      contactName: data?.contactName,
      email: data?.email,
      address: {
        street: data?.address?.street,
        city: data?.address?.city,
        state: data?.address?.state,
        country: data?.address?.country,
        zip: data?.address?.zip,
      },
    };

    try {
      await updateProviderDetails({
        endpoint: apiRoutes.updateProviderDetails,
        data: payload,
      });
      toast.success("Your information Updated Successfully");
      onSuccess();
      reset();
      onClose();
    } catch (error) {
      let message = "Failed to update provider details.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md p-9 rounded-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <img
            src="/../icons/cross-small-icon.svg"
            className="w-5 h-5"
            alt="close"
          />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black font-mona">
              Edit Provider Information
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4 w-full px-4 "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* full Name */}
            <TextInputField
              label="Provider/Pactice Name"
              placeholder="Bright care internal medicien"
              icon="/../icons/name-icon.svg"
              name="providerName"
              register={register}
              error={errors.providerName}
            />

            {/* license number */}
            <TextInputField
              label="Point of Contact Name"
              placeholder="Dr. Priya Sharma"
              icon="/../icons/contact-name-icon.svg"
              name="contactName"
              register={register}
              error={errors.contactName}
            />

            {/* npi number */}
            <TextInputField
              label="NPI Number"
              placeholder="123456778"
              disabled
              icon="/../icons/notes-icon.svg"
              name="npi"
              register={register}
              error={errors.npi}
            />

            {/* phone  */}
            <PhoneNumberField
              label="Phone Number"
              icon="/../icons/call-icon.svg"
              disabled
              value={watch("phoneNumber")}
              error={errors.phoneNumber}
              onChange={(v) =>
                setValue("phoneNumber", v, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />

            {/* email  */}
            <TextInputField
              label="Email"
              placeholder="example@email.com"
              icon="/../icons/email-icon.svg"
              name="email"
              register={register}
              error={errors.email}
            />

            {/* street  */}
            <TextInputField
              label="Street"
              placeholder="120 Stand Road"
              icon="/../icons/men-neck-icon.svg"
              name="address.street"
              register={register}
              error={errors?.address?.street}
            />

            {/* city  */}
            <TextInputField
              label="City"
              placeholder="San Francisco"
              icon="/../icons/men-neck-icon.svg"
              name="address.city"
              register={register}
              error={errors?.address?.city}
            />

            {/* state  */}
            <TextInputField
              label="State"
              placeholder="San Francisco"
              icon="/../icons/men-neck-icon.svg"
              name="address.state"
              register={register}
              error={errors?.address?.state}
            />

            {/* zip  */}
            <TextInputField
              label="Zip"
              placeholder="CA 94105"
              icon="/../icons/men-neck-icon.svg"
              name="address.zip"
              register={register}
              error={errors?.address?.zip}
            />

            {/* country  */}
            <TextInputField
              label="Country"
              placeholder="United State"
              icon="/../icons/men-neck-icon.svg"
              name="address.country"
              register={register}
              error={errors?.address?.country}
            />

            <div className="w-full flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                className="w-fit h-fit px-10 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
                onClick={() => {
                  onClose();
                  setProviderInfo?.(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className={`flex items-center justify-center w-fit h-fit px-12 py-4 rounded-xl font-mona shadow-none transition ${
                  isPending
                    ? "bg-[#B2EBF2] text-gray-500 cursor-not-allowed pointer-events-none"
                    : "bg-[#00BCD4] text-[#212121] hover:bg-[#00BCD4] active:bg-[#00BCD4] cursor-pointer"
                } `}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileInfo;
