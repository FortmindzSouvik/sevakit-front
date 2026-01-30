import DatePickerField from "@/components/form/DatePickerField";
import PhotoUpload from "@/components/form/PhotoUpload";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup.string().required("Report title is required"),
  documentType: yup.string().required("Category select is required"),
  document: yup.object({
    fileUrl: yup.string().required("Document is required"),
    s3Key: yup.string().required(),
  }),
  uploadedBy: yup.string().required("Uploaded by is required"),
  recordDate: yup.string().required("Date of report is required"),
});

const AddMedicalReport = ({
  isOpen,
  onClose,
  onSuccess,
  hasReports,
  globalMedicalReportId,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  hasReports: boolean;
  globalMedicalReportId?: string;
}) => {
  const { mutateAsync: createMedicalReport, isPending: isAddPending } =
    usePostJson(["create-medical-report"]);
  const { mutateAsync: updateMedicalReport, isPending: isUpdatePending } =
    useUpdateData(["update-medical-report"]);

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
      title: "",
      documentType: "",
      uploadedBy: "",
      recordDate: "",
      document: {
        fileUrl: "",
        s3Key: "",
      },
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const payload = {
        files: [
          {
            title: data.title,
            recordDate: data.recordDate,
            documentType: data.documentType,
            uploadedBy: data.uploadedBy,
            fileName: data.document.fileUrl.split("/").pop(),
            fileUrl: data.document.fileUrl,
            s3Key: data.document.s3Key,
          },
        ],
      };

      if (!hasReports) {
        await createMedicalReport({
          endpoint: apiRoutes.createMedicalReport,
          data: payload,
        });

      } else {
        if (!globalMedicalReportId) throw new Error("Missing reportId");

        await updateMedicalReport({
          endpoint: apiRoutes.updateMedicalReport(globalMedicalReportId),
          data: payload,
        });
      }
      onSuccess();
      reset();
    } catch (error) {
      let message = "Failed! Please try again.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
      console.error(error);
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
              Upload Medical Report
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4 w-full px-4 "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* report title  */}
            <TextInputField
              label="Report Title"
              placeholder="Enter report title"
              icon="/../icons/medi-icon.svg"
              name="title"
              register={register}
              error={errors.title}
            />

            {/* category */}
            <SelectField
              label="Category"
              icon="/../icons/manual-entry-icon.svg"
              value={watch("documentType")}
              onChange={(v) =>
                setValue("documentType", v, { shouldValidate: true })
              }
              options={[
                { label: "Lab", value: "Lab" },
                { label: "X-Ray/CT", value: "X-Ray/CT" },
                { label: "Administrative", value: "Administrative" },
                { label: "Discharge Summary", value: "Discharge Summary" },
                {
                  label: "Medicines & Pharmacy",
                  value: "Medicines & Pharmacy",
                },
                { label: "Referrals", value: "Referrals" },
                { label: "Insurance & Billing", value: "Insurance & Billing" },
                { label: "Other", value: "Other" },
              ]}
              error={errors.documentType}
            />

            {/* uploadedBy */}
            <TextInputField
              label="Uploader"
              placeholder="Uploaded by"
              icon="/../icons/med-black-icon.svg"
              name="uploadedBy"
              register={register}
              error={errors.uploadedBy}
            />

            {/* date of report */}
            <DatePickerField
              label="Date of Report"
              icon="/../icons/calendar-icon.svg"
              value={watch("recordDate")}
              onChange={(v) =>
                setValue("recordDate", v, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              error={errors.recordDate}
            />
            <p className="flex items-start text-[#000000] text-base font-medium font-mona mb-0 ">
              Documents
            </p>
            {/* upload photo   */}
            <PhotoUpload
              label="Upload Document"
              name="document"
              icon="/../icons/upload-icon.svg"
              register={register}
              setValue={setValue}
              clearErrors={clearErrors}
              error={errors.document?.fileUrl}
              rename={"Upload"}
              value={watch("document")}
            />
            <p className="flex items-start text-sm font-medium font-mona text-[#4A4A4A] -mt-3">
              Max file size: 10 MB
            </p>
            <div className="w-full flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                className="w-fit h-fit px-10 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
                onClick={() => {
                  onClose();
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
                    Uploading...
                  </>
                ) : (
                  "Upload Report"
                )}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicalReport;
