import SelectField from "@/components/form/SelectField";
import SwitchField from "@/components/form/SwitchField";
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
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

type MedicationForm = {
  id?: string;
  medicationEntryMethod: string;
  medicationName: string;
  form: string;
  dosageFrequency: string;
  dosageNotes?: string;
  isActive?: boolean;
  isReminder?: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (isActive: boolean) => void;
  mode?: "add" | "edit";
  initialData?: MedicationForm | null;
  setSelectedMedication?: (value: MedicationForm | null) => void;
};

const schema = yup.object().shape({
  medicationEntryMethod: yup.string().required("Medication Entry is required"),
  medicationName: yup.string().required("Medication Name is required"),
  form: yup.string().required("Form is required"),
  dosageNotes: yup.string().optional(),
  dosageFrequency: yup.string().required("Dosage Frequency is required"),
  isActive: yup.boolean().optional(),
  isReminder: yup.boolean().optional(),
});

const AddNewMedication = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  initialData,
  setSelectedMedication,
}: Props) => {
  const isEdit = mode === "edit";
  const submitButtonText = isEdit ? "Update Medication" : "Add Medication";
  const afterSubmitButtontext = isEdit ? "Updating..." : "Adding...";

  const { mutateAsync: createMedication, isPending: isAddPending } =
    usePostJson(["create-medication"]);
  const { mutateAsync: updateMedication, isPending: isUpdatePending } =
    useUpdateData(["update-medication"]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      medicationEntryMethod: "",
      medicationName: "",
      form: "",
      dosageNotes: "",
      dosageFrequency: "",
      isActive: false,
      isReminder: false,
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && initialData) {
      reset({
        medicationEntryMethod: initialData.medicationEntryMethod,
        medicationName: initialData.medicationName,
        form: initialData?.form,
        dosageNotes: initialData.dosageNotes || "",
        dosageFrequency: initialData.dosageFrequency || "",
        isActive: initialData.isActive || false,
        isReminder: initialData.isReminder || false,
      });
    } else {
      reset({
        medicationEntryMethod: "",
        medicationName: "",
        form: "",
        dosageNotes: "",
        dosageFrequency: "",
        isActive: false,
        isReminder: false,
      });
    }
  }, [isOpen, isEdit, initialData, reset]);

  const onSubmit = async (data: MedicationForm) => {
    console.log("data", data);
    try {
      if (isEdit && initialData?.id) {
        await updateMedication({
          endpoint: apiRoutes.updateMedication(initialData.id),
          data,
        });
      } else {
        await createMedication({
          endpoint: apiRoutes.createMedication,
          data,
        });
      }

      // onSuccess();
      onSuccess(!!data.isActive);

      reset();
      onClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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
              Add New Medication
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4 w-full px-4 "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Medication Entry */}
            <SelectField
              label="Medication Entry Method"
              icon="/../icons/manual-entry-icon.svg"
              value={watch("medicationEntryMethod")}
              onChange={(v) =>
                setValue("medicationEntryMethod", v, { shouldValidate: true })
              }
              options={[
                { label: "Manual Entry", value: "manual" },
                // { label: "Upload Prescription", value: "upload" },
              ]}
              error={errors.medicationEntryMethod}
            />

            {/* Medication Name */}
            <TextInputField
              label="Medication Name"
              placeholder="Generic"
              icon="/../icons/medi-icon.svg"
              name="medicationName"
              register={register}
              error={errors.medicationName}
            />

            {/* Form */}
            <TextInputField
              label="Form"
              placeholder="Tablet, Capsule"
              icon="/../icons/med-black-icon.svg"
              name="form"
              register={register}
              error={errors.form}
            />

            {/* Dosage */}
            <TextInputField
              label="Dosage"
              placeholder="Additional notes if needed"
              icon="/../icons/dosage-icon.svg"
              name="dosageNotes"
              register={register}
              error={errors.dosageNotes}
            />

            {/* Dosage Frequency */}
            <SelectField
              label="Dosage Frequency"
              icon="/../icons/dosage-freq-icon.svg"
              value={watch("dosageFrequency")}
              onChange={(v) =>
                setValue("dosageFrequency", v, { shouldValidate: true })
              }
              options={[
                { label: "Once Daily", value: "Once Daily" },
                { label: "Twice Daily", value: "Twice Daily" },
              ]}
              error={errors.dosageFrequency}
            />

            {/* Switches */}
            <div className="grid grid-cols-2 gap-5 font-mona">
              <SwitchField
                label="Currently Active?"
                value={watch("isActive") ?? false}
                onChange={(v) =>
                  setValue("isActive", v, { shouldValidate: true })
                }
                error={errors.isActive}
              />

              <SwitchField
                label="Need a Reminder?"
                value={watch("isReminder") ?? false}
                onChange={(v) =>
                  setValue("isReminder", v, { shouldValidate: true })
                }
                error={errors.isReminder}
              />
            </div>
            <div className="w-full flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                className="w-fit h-fit px-10 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
                onClick={() => {
                  onClose();
                  setSelectedMedication?.(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isAddPending || isUpdatePending}
                className="flex items-center justify-center w-fit h-fit px-12 py-4 bg-[#00BCD4] text-[#212121] rounded-xl shadow-none hover:bg-[#00BCD4] active:bg-[#00BCD4] cursor-pointer font-mona"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {afterSubmitButtontext}
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

export default AddNewMedication;
