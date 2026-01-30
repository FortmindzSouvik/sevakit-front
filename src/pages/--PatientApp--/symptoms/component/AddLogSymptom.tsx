import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Loader2 } from "lucide-react";
import DatePickerField from "@/components/form/DatePickerField";
import TextInputField from "@/components/form/TextInputField";
import SelectField from "@/components/form/SelectField";
import { usePostJson } from "@/hooks/usePostJson";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import useUpdateData from "@/hooks/useUpdateData";

type SymptomForm = {
  id?: string;
  symptomName: string;
  severity: string;
  duration: string;
  additionalNotes?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "add" | "edit";
  initialData?: SymptomForm | null;
  setSelectedSymptoms?: (value: SymptomForm | null) => void;
};

const schema = yup.object().shape({
  symptomName: yup.string().required("Symptom name is required"),
  severity: yup.string().required("Severity is required"),
  duration: yup.string().required("Duration is required"),
  additionalNotes: yup.string().optional(),
});

export default function AddLogSymptom({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  initialData,
  setSelectedSymptoms,
}: Props) {
  const isEdit = mode === "edit";
  const { mutateAsync: createSymptom, isPending: isAddPending } = usePostJson([
    "create-symptom",
  ]);
  const { mutateAsync: updateSymptom, isPending: isUpdatePending } =
    useUpdateData(["update-symptom"]);

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
      symptomName: "",
      severity: "",
      duration: "",
      additionalNotes: "",
    },
  });



  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && initialData) {
      reset({
        symptomName: initialData.symptomName,
        severity: initialData.severity,
        duration: initialData.duration,
        additionalNotes: initialData.additionalNotes || "",
      });
    } else {
      reset({
        symptomName: "",
        severity: "",
        duration: "",
        additionalNotes: "",
      });
    }
  }, [isOpen, isEdit, initialData, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && initialData?.id) {
        await updateSymptom({
          endpoint: apiRoutes.updateSymptom(initialData.id),
          data,
        });
      } else {
        await createSymptom({
          endpoint: apiRoutes.createSymptom,
          data,
        });
      }

      onSuccess();
      reset();
      onClose();
    } catch (error) {
      let message = "Please try again.";

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
      <DialogContent className="max-w-md p-9 rounded-2xl">
        <button
          onClick={() => {
            onClose();
            setSelectedSymptoms?.(null);
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
              {isEdit ? "Edit Symptom" : "Add Symptom"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4 w-full px-4  "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Symptom Name */}
            <TextInputField
              label="Symptom Name"
              placeholder="Enter symptom name"
              icon="/../icons/symptom-input-icon.svg"
              name="symptomName"
              register={register}
              error={errors.symptomName}
            />

            {/* Severity */}
            <SelectField
              label="Severity"
              icon="/../icons/severity-icon.svg"
              value={watch("severity")}
              onChange={(v) =>
                setValue("severity", v, { shouldValidate: true })
              }
              options={[
                { label: "Moderate", value: "Moderate" },
                { label: "Severe", value: "Severe" },
                { label: "Mild", value: "Mild" },
              ]}
              error={errors.severity}
            />

            {/* duration */}
            <DatePickerField
              label="Duration"
              icon="/../icons/duration-icon.svg"
              value={watch("duration")}
              onChange={(v) =>
                setValue("duration", v, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              error={errors.duration}
            />

            <TextInputField
              label="Additional Notes"
              placeholder="Enter additional notes"
              icon="/../icons/notes-icon.svg"
              name="additionalNotes"
              register={register}
              // error={errors.additionalNotes}
            />

            <div className="w-full flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                className="w-fit h-fit px-10 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
                onClick={() => {
                  onClose();
                  setSelectedSymptoms?.(null);
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
                  "Save"
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
