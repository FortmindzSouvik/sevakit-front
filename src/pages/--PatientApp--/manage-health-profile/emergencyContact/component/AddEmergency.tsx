import PhoneNumberField from "@/components/form/PhoneNumberField";
import SelectField from "@/components/form/SelectField";
import TextInputField from "@/components/form/TextInputField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePostJson } from "@/hooks/usePostJson";
import useUpdateData from "@/hooks/useUpdateData";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

type ECForm = {
  id?: string;
  contactName: string;
  phoneNumber: string;
  relationship: string;
  email?: string;
  address?: {
    street: string;
  };
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "add" | "edit";
  initialData?: ECForm | null;
  setSelectedEmergencyContact?: (value: ECForm | null) => void;
};

const schema = yup.object().shape({
  contactName: yup.string().required("Full Name is required"),
  relationship: yup.string().required("Relationship is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .min(10, "Enter a valid phone number"),

  email: yup.string().optional(),
  address: yup.object({
    street: yup.string().optional(),
  }),
});

const AddEmergency = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  initialData,
  setSelectedEmergencyContact,
}: Props) => {
  const isEdit = mode === "edit";
  const submitButtonText = isEdit ? "Save Changes" : "Save Contact";
  const { mutateAsync: createEmegencyContact, isPending: isAddPending } =
    usePostJson(["create-emegency-contact"]);
  const { mutateAsync: updateEmegencyContact, isPending: isUpdatePending } =
    useUpdateData(["update-emegency-contact"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      contactName: "",
      relationship: "",
      phoneNumber: "",
      email: "",
      address: {
        street: "",
      },
    },
  });
  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && initialData) {
      reset({
        contactName: initialData.contactName,
        relationship: initialData.relationship,
        phoneNumber: initialData.phoneNumber,
        email: initialData.email || "",
        address: {
          street: initialData.address?.street || "",
        },
      });
    } else {
      reset({
        contactName: "",
        relationship: "",
        phoneNumber: "",
        email: "",
        address: {
          street: "",
        },
      });
    }
  }, [isOpen, isEdit, initialData, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && initialData?.id) {
        await updateEmegencyContact({
          endpoint: apiRoutes.updateEmegencyContact(initialData.id),
          data,
        });
      } else {
        await createEmegencyContact({
          endpoint: apiRoutes.createEmegencyContact,
          data,
        });
      }

      onSuccess();
      reset();
      onClose();
    } catch (error) {
      let message = "Failed! Please try again.";

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
      <DialogContent className="max-w-md p-9 rounded-2xl  overflow-y-auto ">
        <button
          onClick={() => {
            onClose();
            setSelectedEmergencyContact?.(null);
          }}
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
              {isEdit ? "Edit Emergency Contact" : "Add Emergency Contact"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4 w-full px-4 "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* full Name */}
            <TextInputField
              label="Full Name"
              placeholder="Enter full name"
              icon="/../icons/name-icon.svg"
              name="contactName"
              register={register}
              error={errors.contactName}
            />

            {/* relationship*/}
            <SelectField
              label="Relationship"
              icon="/../icons/family-icon.svg"
              value={watch("relationship")}
              onChange={(v) =>
                setValue("relationship", v, { shouldValidate: true })
              }
              options={[
                { label: "Father", value: "father" },
                { label: "Mother", value: "mother" },
                { label: "Spouse", value: "spouse" },
              ]}
              error={errors.relationship}
            />

            {/* phone  */}
            <PhoneNumberField
              label="Phone Number"
              icon="/../icons/call-icon.svg"
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

            {/* email*/}
            <TextInputField
              label="Email Address"
              placeholder="Enter email address"
              icon="/../icons/email-icon.svg"
              name="email"
              register={register}
              error={errors.email}
            />

            {/* address  */}
            <TextInputField
              label="Address"
              placeholder="Enter address"
              icon="/../icons/men-neck-icon.svg"
              name="address.street"
              register={register}
              error={errors.address?.street}
            />

            <div className="w-full flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                className="w-fit h-fit px-10 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
                onClick={() => {
                  onClose();
                  setSelectedEmergencyContact?.(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isAddPending || isUpdatePending}
                className="flex items-center justify-center w-fit h-fit px-12 py-4 bg-[#00BCD4] text-[#212121] rounded-xl shadow-none hover:bg-[#00BCD4] active:bg-[#00BCD4] cursor-pointer font-mona"
              >
                {isAddPending || isUpdatePending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  submitButtonText
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmergency;
