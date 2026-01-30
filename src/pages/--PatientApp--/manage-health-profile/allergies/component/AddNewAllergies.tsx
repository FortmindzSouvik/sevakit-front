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
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

type AllergyFormData = {
  id?: string;
  allergenName: string;
  reactionType: string;
  severity: string;
  notes?: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "add" | "edit";
  initialData?: AllergyFormData | null;
  setSelectedAllergy?: (value: AllergyFormData | null) => void;
};

const schema = yup.object().shape({
  allergenName: yup.string().required("Allergie name is required"),
  reactionType: yup.string().required("Reaction is required"),
  severity: yup.string().required("Severity is required"),
  notes: yup.string().optional(),
});

const AddNewAllergies = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  initialData,
  setSelectedAllergy,
}: Props) => {
  const isEdit = mode === "edit";
  const { mutateAsync: createAllergies, isPending: isAddPending } = usePostJson(
    ["create-allergies"]
  );
  const { mutateAsync: updateAllergies, isPending: isUpdatePending } =
    useUpdateData(["update-allergies"]);
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
      allergenName: "",
      reactionType: "",
      severity: "",
      notes: "",
    },
  });
  /* ---------------- PREFILL FORM (EDIT MODE) ---------------- */
  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && initialData) {
      reset({
        allergenName: initialData.allergenName,
        reactionType: initialData.reactionType,
        severity: initialData.severity,
        notes: initialData.notes || "",
      });
    } else {
      reset({
        allergenName: "",
        reactionType: "",
        severity: "",
        notes: "",
      });
    }
  }, [isOpen, isEdit, initialData, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && initialData?.id) {
        await updateAllergies({
          endpoint: apiRoutes.updateAllergy(initialData.id),
          data,
        });
      } else {
        await createAllergies({
          endpoint: apiRoutes.addAllergies,
          data,
        });
      }

      onSuccess();
      reset();
      onClose();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md p-9 rounded-2xl ">
        <button
          onClick={() => {
            onClose();
            setSelectedAllergy?.(null);
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
              {isEdit ? "Edit Allergy" : "Add Allergy"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4 w-full px-4 "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* allergy Name */}
            <TextInputField
              label="Allergy Name"
              placeholder="Penicillin"
              icon="/../icons/allergie-icon.svg"
              name="allergenName"
              register={register}
              error={errors.allergenName}
            />

            {/* Reaction */}
            <TextInputField
              label="Reaction"
              placeholder="Rash, Swelling"
              icon="/../icons/allergie-icon.svg"
              name="reactionType"
              register={register}
              error={errors.reactionType}
            />

            {/* Severity Frequency */}
            <SelectField
              label="Severity"
              icon="/../icons/allergie-icon.svg"
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

            {/* notes */}
            <TextInputField
              label="Notes"
              placeholder="Additional notes if needed"
              icon="/../icons/allergie-icon.svg"
              name="notes"
              register={register}
              error={errors.notes}
            />

            <div className="w-full flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                className="w-fit h-fit px-10 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
                onClick={() => {
                  onClose();
                  setSelectedAllergy?.(null);
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
                    Save...
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
};

export default AddNewAllergies;
