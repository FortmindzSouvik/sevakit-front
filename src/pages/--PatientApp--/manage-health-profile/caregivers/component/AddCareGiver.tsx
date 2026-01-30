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
  caregiverName: string;
  relationship: string;
  caregiverPhone: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "add" | "edit";
  initialData?: POAForm | null;
  setSelectedCareGiver?: (value: POAForm | null) => void;
};

const schema = yup.object().shape({
  caregiverName: yup.string().required("Caregiver Name is required"),
  relationship: yup.string().required("Relationship is required"),
  caregiverPhone: yup
    .string()
    .required("Phone number is required")
    .min(10, "Enter a valid phone number"),
});

const AddCareGiver = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  initialData,
  setSelectedCareGiver,
}: Props) => {
  const isEdit = mode === "edit";
  const submitButtonText = isEdit ? "Update Changes" : "Save Changes";
  const { mutateAsync: createCareGiver, isPending: isAddPending } = usePostJson(
    ["create-caregiver"]
  );
  const { mutateAsync: updateCareGiver, isPending: isUpdatePending } =
    useUpdateData(["update-caregiver"]);
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
      caregiverName: "",
      relationship: "",
      caregiverPhone: "",
    },
  });
  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && initialData) {
      reset({
        caregiverName: initialData.caregiverName || "",
        relationship: initialData?.relationship || "",
        caregiverPhone: initialData?.caregiverPhone || "",
      });
    } else {
      reset({
        caregiverName: "",
        relationship: "",
        caregiverPhone: "",
      });
    }
  }, [isOpen, isEdit, initialData, reset]);

  const onSubmit = async (data: POAForm) => {
    const payload = { ...data, manageOwnHealth: "Yes" };
    try {
      if (isEdit && initialData?.id) {
        await updateCareGiver({
          endpoint: apiRoutes.updateCareGiver(initialData.id),
          data: payload,
        });
      } else {
        await createCareGiver({
          endpoint: apiRoutes.createCareGiver,
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
            setSelectedCareGiver?.(null);
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
              {isEdit ? "Edit Caregivery" : "Add Caregivery"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4 w-full px-4 "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* caregiver Name */}
            <TextInputField
              label="Caregiver Name"
              placeholder="Enter care giver name"
              icon="/../icons/name-icon.svg"
              name="caregiverName"
              register={register}
              error={errors.caregiverName}
            />

            {/* phone  */}
            <PhoneNumberField
              label="Caregiver Phone"
              icon="/../icons/call-icon.svg"
              value={watch("caregiverPhone")}
              error={errors.caregiverPhone}
              onChange={(v) =>
                setValue("caregiverPhone", v, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />

            {/* relationship*/}
            <SelectField
              label="Caregiver Relationship to me"
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

            <div className="w-full flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                className="w-fit h-fit px-10 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
                onClick={() => {
                  onClose();
                  setSelectedCareGiver?.(null);
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

export default AddCareGiver;
