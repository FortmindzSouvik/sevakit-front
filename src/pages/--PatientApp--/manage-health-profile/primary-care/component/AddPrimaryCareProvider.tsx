import PhoneNumberField from "@/components/form/PhoneNumberField";
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

type PCPFormData = {
  id?: string;
  doctorName: string;
  medicalFacility: string;
  doctorEmail: string;
  doctorAddress: string;
  doctorPhone: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "add" | "edit";
  initialData?: PCPFormData | null;
  setSelectedPrimaryCareProvider?: (value: PCPFormData | null) => void;
};

const schema = yup.object().shape({
  doctorName: yup.string().required("Care provider name is required"),
  medicalFacility: yup.string().required("Clinic name is required"),
  doctorEmail: yup.string().required("Email is required"),
  doctorAddress: yup.string().required("Address is required"),
  doctorPhone: yup
    .string()
    .required("Phone number is required")
    .min(10, "Enter a valid phone number"),
});

const AddPrimaryCareProvider = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  initialData,
  setSelectedPrimaryCareProvider,
}: Props) => {
  const isEdit = mode === "edit";
  const submitButtonText = isEdit ? "Save Changes" : "Care Provider";
  const loaderButtonText = isEdit ? "Changing..." : "Creating...";
  const { mutateAsync: createPrimaryCareProvider, isPending: isAddPending } =
    usePostJson(["create-primary-care-provider"]);
  const { mutateAsync: updatePrimaryCareProvider, isPending: isUpdatePending } =
    useUpdateData(["update-primary-care-provider"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      doctorName: "",
      medicalFacility: "",
      doctorEmail: "",
      doctorAddress: "",
      doctorPhone: "",
    },
  });
  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && initialData) {
      reset({
        doctorName: initialData.doctorName,
        medicalFacility: initialData.medicalFacility,
        doctorPhone: initialData.doctorPhone,
        doctorAddress: initialData.doctorAddress,
        doctorEmail: initialData.doctorEmail,
      });
    } else {
      reset({
        doctorName: "",
        medicalFacility: "",
        doctorPhone: "",
        doctorAddress: "",
        doctorEmail: "",
      });
    }
  }, [isOpen, isEdit, initialData, reset]);

  const onSubmit = async (data: PCPFormData) => {
    // console.log("ACFORM", data);

    try {
      if (isEdit && initialData?.id) {
        await updatePrimaryCareProvider({
          endpoint: apiRoutes.updatePrimaryCareProvider(initialData.id),
          data,
        });
      } else {
        await createPrimaryCareProvider({
          endpoint: apiRoutes.createPrimaryCareProvider,
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
      <DialogContent className="max-w-md p-9 rounded-2xl  ">
        <button
          onClick={() => {
            onClose();
            setSelectedPrimaryCareProvider?.(null);
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
              {isEdit ? "Edit Care Provider" : "Add Care Provider"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4 w-full px-4 "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* care provider Name */}
            <TextInputField
              label="Care Provider Name"
              placeholder="Enter care provider name"
              icon="/../icons/primary-care-input-icon.svg"
              name="doctorName"
              register={register}
              error={errors.doctorName}
            />

            {/* clininName  */}
            <TextInputField
              label="Clinic Name"
              placeholder="Enter clinic name"
              icon="/../icons/clinic-icon.svg"
              name="medicalFacility"
              register={register}
              error={errors.medicalFacility}
            />

            {/* Phone Number  */}
            <PhoneNumberField
              label="Phone Number"
              icon="/../icons/call-icon.svg"
              value={watch("doctorPhone")}
              error={errors.doctorPhone}
              onChange={(v) =>
                setValue("doctorPhone", v, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />
            {/* email */}
            <TextInputField
              label="Email"
              placeholder="Enter care provider email"
              icon="/../icons/email-icon.svg"
              name="doctorEmail"
              register={register}
              error={errors.doctorEmail}
            />

            {/* address */}
            <TextInputField
              label="Address"
              placeholder="Enter care provider address"
              icon="/../icons/men-neck-icon.svg"
              name="doctorAddress"
              register={register}
              error={errors.doctorAddress}
            />

            <div className="w-full flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                className="w-fit h-fit px-10 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
                onClick={() => {
                  onClose();
                  setSelectedPrimaryCareProvider?.(null);
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

export default AddPrimaryCareProvider;
