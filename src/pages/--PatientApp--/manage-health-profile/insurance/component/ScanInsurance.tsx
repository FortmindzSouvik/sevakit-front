import PhotoUpload from "@/components/form/PhotoUpload";
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

type InsuranceForm = {
  id?: string;
  frontImage: {
    fileUrl: string;
    s3Key: string;
  };
  backImage: {
    fileUrl: string;
    s3Key: string;
  };
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "add" | "edit";
  initialData?: InsuranceForm | null;
  setSelectedInsurance?: (value: InsuranceForm | null) => void;
};

const schema = yup.object().shape({
  frontImg: yup.object({
    fileUrl: yup.string().required("Front side document is required"),
    s3Key: yup.string().required(),
  }),
  backImg: yup.object({
    fileUrl: yup.string().required("Back side document is required"),
    s3Key: yup.string().required(),
  }),
});

const ScanInsurance = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  initialData,
  setSelectedInsurance,
}: Props) => {
  const isEdit = mode === "edit";
  const submitButtonText = isEdit ? "Update" : "Save";
  const loaderButtonText = isEdit ? "Updating..." : "Saving...";
  const { mutateAsync: createInsurance, isPending: isAddPending } = usePostJson(
    ["create-insurance-upload"]
  );
  const { mutateAsync: updateInsurance, isPending: isUpdatePending } =
    useUpdateData(["update-insurance-upload"]);

  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      frontImg: {
        fileUrl: "",
        s3Key: "",
      },
      backImg: {
        fileUrl: "",
        s3Key: "",
      },
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && initialData) {
      reset({
        frontImg: {
          fileUrl: initialData?.frontImage?.fileUrl,
          s3Key: initialData?.frontImage?.s3Key,
        },
        backImg: {
          fileUrl: initialData?.backImage?.fileUrl,
          s3Key: initialData?.backImage?.s3Key,
        },
      });
    } else {
      reset({
        frontImg: {
          fileUrl: "",
          s3Key: "",
        },
        backImg: {
          fileUrl: "",
          s3Key: "",
        },
      });
    }
  }, [isOpen, isEdit, initialData, reset]);

  const onSubmit = async (data: any) => {
    const payload = {
      frontImage: {
        fileUrl: data?.frontImg?.fileUrl,
        s3Key: data?.frontImg?.s3Key,
      },
      backImage: {
        fileUrl: data?.backImg?.fileUrl,
        s3Key: data?.backImg?.s3Key,
      },
    };
    try {
      if (isEdit && initialData?.id) {
        await updateInsurance({
          endpoint: apiRoutes.updateInsurance(initialData.id),
          data: payload,
        });
      } else {
        await createInsurance({
          endpoint: apiRoutes.createInsurance,
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
      <DialogContent className="max-w-md p-6 rounded-2xl ">
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

        <div className="flex flex-col items-center text-center space-y-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-black font-mona">
              Scan Insurance Card
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4 w-full px-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <p className="flex items-start text-lg font-medium font-mona text-black">
              Document Upload
            </p>

            {/* front side photo   */}
            <PhotoUpload
              label="Front of Insurance Card"
              name="frontImg"
              icon="/../icons/upload-icon.svg"
              register={register}
              setValue={setValue}
              clearErrors={clearErrors}
              error={errors.frontImg?.fileUrl}
              rename={"Upload documents"}
              value={watch("frontImg")}
              onUploadingChange={setIsUploading}
            />

            {/* back side photo   */}

            <PhotoUpload
              label="Back of Insurance Card"
              name="backImg"
              icon="/../icons/upload-icon.svg"
              register={register}
              setValue={setValue}
              clearErrors={clearErrors}
              error={errors.backImg?.fileUrl}
              rename={"Upload documents"}
              value={watch("backImg")}
              onUploadingChange={setIsUploading}
            />

            <p className="flex items-start text-sm font-medium font-mona text-[#4A4A4A]">
              Max file size: 10 MB
            </p>

            <p className="flex items-start text-sm font-medium font-mona text-[#4A4A4A]">
              Your insurance card images are not shown on your Public Health
              Profile for privacy. Only coverage details will be displayed.
            </p>

            {/* Buttons */}
            <div className="w-full flex items-center justify-center gap-6 pt-4">
              <button
                type="button"
                className="px-10 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-mona text-sm"
                onClick={() => {
                  onClose();
                  setSelectedInsurance?.(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isAddPending || isUpdatePending || isUploading}
                className={`flex items-center justify-center px-12 py-4 bg-[#00BCD4] text-[#212121] rounded-xl font-mona ${
                  isAddPending || isUpdatePending || isUploading
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                }`}
              >
                {isAddPending || isUpdatePending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {loaderButtonText}
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

export default ScanInsurance;
