import PhotoUpload from "@/components/form/PhotoUpload";
import SelectField from "@/components/form/SelectField";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

type ACForm = {
  id?: string;
  codeStatusDocument: {
    fileUrl: string;
    fileName: string;
    s3Key: string;
  };
  resuscitationPreference: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "add" | "edit";
  initialData?: ACForm | null;
  setSelectedAdvancePlan?: (value: ACForm | null) => void;
};

const schema = yup.object().shape({
  resuscitationPreference: yup.string().required("Code status is required"),
  codeStatusDocument: yup.object({
    fileUrl: yup.string().required("Advance care plan document is required"),
    fileName: yup.string().required(),
    s3Key: yup.string().required(),
  }),
});

const AddAdvancePlan = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  initialData,
  setSelectedAdvancePlan,
}: Props) => {
  const isEdit = mode === "edit";
  const submitButtonText = isEdit ? "Update Advance Plan" : "Save Advance Plan";
  const { mutateAsync: createAdvanceCarePaln, isPending: isAddPending } =
    usePostJson(["create-advance-care-plan"]);
  const { mutateAsync: updateAdvanceCarePaln, isPending: isUpdatePending } =
    useUpdateData(["update-advance-care-plan"]);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      resuscitationPreference: "",
      codeStatusDocument: {
        fileUrl: "",
        fileName: "",
        s3Key: "",
      },
    },
  });
  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && initialData) {
      reset({
        resuscitationPreference: initialData.resuscitationPreference,
        codeStatusDocument: {
          fileUrl: initialData.codeStatusDocument.fileUrl,
          fileName: initialData.codeStatusDocument.fileName,
          s3Key: initialData.codeStatusDocument.s3Key,
        },
      });
    } else {
      reset({
        resuscitationPreference: "",
        codeStatusDocument: {
          fileUrl: "",
          fileName: "",
          s3Key: "",
        },
      });
    }
  }, [isOpen, isEdit, initialData, reset]);

  const onSubmit = async (data: ACForm) => {
    console.log("ACFORM", data);
    try {
      if (isEdit && initialData?.id) {
        await updateAdvanceCarePaln({
          endpoint: apiRoutes.updateAdvanceCarePaln(initialData.id),
          data,
        });
      } else {
        await createAdvanceCarePaln({
          endpoint: apiRoutes.createAdvanceCarePaln,
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
      <DialogContent className="max-w-md p-9 rounded-2xl ">
        <button
          onClick={() => {
            onClose();
            setSelectedAdvancePlan?.(null);
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
              {isEdit ? "Edit Advanced Care Plan" : "Add Advanced Care Plan"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4 w-full px-4 "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* code status*/}
            <SelectField
              label="Code Status"
              icon="/../icons/advance-care-icon.svg"
              value={watch("resuscitationPreference")}
              onChange={(v) =>
                setValue("resuscitationPreference", v, { shouldValidate: true })
              }
              options={[
                {
                  label: "Full Code (Attempt Resuscitation)",
                  value: "Full Code (Attempt Resuscitation)",
                },
                {
                  label: "Do Not Resuscitate (DNR)",
                  value: "Do Not Resuscitate (DNR)",
                },
                {
                  label: "Do Not Attempt Resuscitation (DNAR)",
                  value: "Do Not Attempt Resuscitation (DNAR)",
                },
                {
                  label: "Not Sure",
                  value: "Not Sure",
                },
              ]}
              error={errors.resuscitationPreference}
            />

            {/* upload photo   */}
            <PhotoUpload
              label="Upload ACP Document"
              name="codeStatusDocument"
              icon="/../icons/upload-icon.svg"
              register={register}
              setValue={setValue}
              clearErrors={clearErrors}
              error={errors.codeStatusDocument?.fileUrl}
              rename={"Upload documents"}
              value={watch("codeStatusDocument")}
              onUploadingChange={setIsUploading}
            />
            <p className="flex items-start text-sm font-medium font-mona text-[#4A4A4A]">
              Max file size: 10 MB
            </p>
            <div className="w-full flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                className="w-1/3 h-fit p-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
                onClick={() => {
                  onClose();
                  setSelectedAdvancePlan?.(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isAddPending || isUpdatePending || isUploading}
                className={`flex items-center justify-center w-2/3 h-fit p-4 bg-[#00BCD4] text-[#212121] rounded-xl shadow-none hover:bg-[#00BCD4] active:bg-[#00BCD4] font-mona ${
                  isAddPending || isUpdatePending || isUploading
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                }`}
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

export default AddAdvancePlan;
