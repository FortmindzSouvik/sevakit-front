import DatePickerField from "@/components/form/DatePickerField";
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

type DLForm = {
  id?: string;
  fullName: string;
  licenseNumber: string;
  issuingState: string;
  expirationDate: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "add" | "edit";
  initialData?: DLForm | null;
  setSelectedDrivingLicense?: (value: DLForm | null) => void;
};
const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  licenseNumber: yup.string().required("License number is required"),
  issuingState: yup.string().required("Enter state is required"),
  expirationDate: yup.string().required("Expiry date is required"),
});

const AddDriversLicense = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  initialData,
  setSelectedDrivingLicense,
}: Props) => {
  const isEdit = mode === "edit";
  const submitButtonText = isEdit ? "Save Changes" : "Add";
  const loaderButtonText = isEdit ? "Updating..." : "Creating...";
  const { mutateAsync: createDrivingLicense, isPending: isAddPending } =
    usePostJson(["create-dl"]);
  const { mutateAsync: updateDrivingLicense, isPending: isUpdatePending } =
    useUpdateData(["update-dl"]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      licenseNumber: "",
      issuingState: "",
      expirationDate: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && initialData) {
      reset({
        fullName: initialData?.fullName,
        licenseNumber: initialData?.licenseNumber,
        issuingState: initialData?.issuingState,
        expirationDate: initialData?.expirationDate,
      });
    } else {
      reset({
        fullName: "",
        licenseNumber: "",
        issuingState: "",
        expirationDate: "",
      });
    }
  }, [isOpen, isEdit, initialData, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && initialData?.id) {
        await updateDrivingLicense({
          endpoint: apiRoutes.updateDrivingLicense(initialData.id),
          data,
        });
      } else {
        await createDrivingLicense({
          endpoint: apiRoutes.createDrivingLicense,
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
              {isEdit ? "Edit Driver’s License" : "Add Driver’s License"}
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
              name="fullName"
              register={register}
              error={errors.fullName}
            />

            {/* license number */}
            <TextInputField
              label="License Number"
              placeholder="Enter license number"
              icon="/../icons/name-icon.svg"
              name="licenseNumber"
              register={register}
              error={errors.licenseNumber}
            />

            {/* state number */}
            <TextInputField
              label="State"
              placeholder="Enter state"
              icon="/../icons/name-icon.svg"
              name="issuingState"
              register={register}
              error={errors.issuingState}
            />

            {/* expiry date */}
            <DatePickerField
              label="Expiry Date"
              icon="/../icons/calendar-icon.svg"
              value={watch("expirationDate")}
              allowFuture
              onChange={(v) =>
                setValue("expirationDate", v, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              error={errors.expirationDate}
            />

            <div className="w-full flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                className="w-fit h-fit px-10 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
                onClick={() => {
                  onClose();
                  setSelectedDrivingLicense?.(null);
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

export default AddDriversLicense;
