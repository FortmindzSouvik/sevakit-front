import MultiPhotoUpload from "@/components/form/MultiPhotoUpload";
import TextAreaField from "@/components/form/TextAreaField";
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

type LWForm = {
  id?: string;
  summary: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "add" | "edit";
  initialData?: LWForm | null;
  setSelectedLivingWill?: (value: LWForm | null) => void;
};

const schema = yup.object().shape({
  summary: yup.string().required("Living will summary is required"),
  documents: yup
    .array()
    .required("Document upload is required")
    .min(1, "Document upload is required"),
});

const AddLivingWill = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  initialData,
  setSelectedLivingWill,
}: Props) => {
  const isEdit = mode === "edit";
  const submitButtonText = isEdit ? "Update Living Will" : "Save Living Will";
  const { mutateAsync: createAdvanceCarePaln, isPending: isAddPending } =
    usePostJson(["create-living-will"]);
  const { mutateAsync: updateAdvanceCarePaln, isPending: isUpdatePending } =
    useUpdateData(["update-living-will"]);
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
      summary: "",
      documents: [],
    },
  });
  const transformDocumentsForForm = (documents: any[] = []) => {
    return documents.map((doc) => ({
      fileName: doc.fileName,
      url: doc.fileUrl,
    }));
  };
  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && initialData) {
      reset({
        summary: initialData.summary || "",
        documents: transformDocumentsForForm(
          // @ts-ignore – documents come from API
          initialData.documents || []
        ),
      });
    } else {
      reset({
        summary: "",
        documents: [],
      });
    }
  }, [isOpen, isEdit, initialData, reset]);

  const transformDocumentsForApi = (documents: any[]) => {
    return documents.map(({ fileName, url }) => ({
      fileName,
      fileUrl: url,
    }));
  };

  const onSubmit = async (data: any) => {
    console.log("ACFORM", data);
    const payload = {
      summary: data?.summary,
      documents: transformDocumentsForApi(data?.documents),
    };
    try {
      if (isEdit && initialData?.id) {
        await updateAdvanceCarePaln({
          endpoint: apiRoutes.updateLivingWill(initialData.id),
          data: payload,
        });
      } else {
        await createAdvanceCarePaln({
          endpoint: apiRoutes.createLivingWill,
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
      <DialogContent className="max-w-md p-9 rounded-2xl max-h-[90vh] overflow-y-auto ">
        <button
          onClick={() => {
            onClose();
            setSelectedLivingWill?.(null);
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
              {isEdit ? "Edit Living Will" : "Add Living Will"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4 w-full px-4 "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* full Name */}
            <TextAreaField
              label="Living Will Summary"
              placeholder="Describe your end-of-life care preferences, life support instructions,and any guidance for your healthcare providers."
              icon="/../icons/family-icon.svg"
              name="summary"
              register={register}
              error={errors.summary}
            />

            {/* upload photo   */}

            <MultiPhotoUpload
              label="Upload Living Will Document(s)"
              name="documents"
              icon="/../icons/upload-icon.svg"
              register={register}
              setValue={setValue}
              clearErrors={clearErrors}
              error={errors.documents}
              value={watch("documents")}
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
                  setSelectedLivingWill?.(null);
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

export default AddLivingWill;
