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

type POAForm = {
  id?: string;
  representativeName: string;
  relationship: string;
  email: string;
  phoneNumber: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "add" | "edit";
  initialData?: POAForm | null;
  setSelectedPowerofAttorney?: (value: POAForm | null) => void;
};

const schema = yup.object().shape({
  representativeName: yup.string().required("Full Name is required"),
  relationship: yup.string().required("Relationship is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .min(10, "Enter a valid phone number"),

  email: yup.string().required("Email is required"),
});

const AddPowerAttorney = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  initialData,
  setSelectedPowerofAttorney,
}: Props) => {
  const isEdit = mode === "edit";
  const submitButtonText = isEdit ? "Update Changes" : "Save Changes";
  const { mutateAsync: createPowerOfAttorney, isPending: isAddPending } =
    usePostJson(["create-power-of-attorney"]);
  const { mutateAsync: updatePowerOfAttorney, isPending: isUpdatePending } =
    useUpdateData(["update-power-of-attorney"]);

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
      representativeName: "",
      relationship: "",
      phoneNumber: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && initialData) {
      reset({
        representativeName: initialData.representativeName || "",
        relationship: initialData?.relationship,
        phoneNumber: initialData?.phoneNumber,
        email: initialData?.email,
      });
    } else {
      reset({
        representativeName: "",
        relationship: "",
        phoneNumber: "",
        email: "",
      });
    }
  }, [isOpen, isEdit, initialData, reset]);

  const onSubmit = async (data: POAForm) => {
    const payload = { ...data, hasPowerOfAttorney: "Yes" };
    try {
      if (isEdit && initialData?.id) {
        await updatePowerOfAttorney({
          endpoint: apiRoutes.updatePowerOfAttorney(initialData.id),
          data: payload,
        });
      } else {
        await createPowerOfAttorney({
          endpoint: apiRoutes.createPowerOfAttorneyList,
          data: payload,
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
            setSelectedPowerofAttorney?.(null);
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
              {isEdit ? "Edit Power of Attorney" : "Add Power of Attorney"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4 w-full px-4 "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* full Name */}
            <TextInputField
              label="Full Name of POA"
              placeholder="Enter full name of POA"
              icon="/../icons/name-icon.svg"
              name="representativeName"
              register={register}
              error={errors.representativeName}
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

            <div className="w-full flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                className="w-fit h-fit px-10 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
                onClick={() => {
                  onClose();
                  setSelectedPowerofAttorney?.(null);
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

export default AddPowerAttorney;
