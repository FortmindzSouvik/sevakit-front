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

type PharmacyFormData = {
  id?: string;
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyPhone: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode?: "add" | "edit";
  initialData?: PharmacyFormData | null;
  setSelectedPharmacy?: (value: PharmacyFormData | null) => void;
};

const schema = yup.object().shape({
  pharmacyName: yup.string().required("Full Name is required"),
  pharmacyAddress: yup.string().required("Address is required"),
  pharmacyPhone: yup
    .string()
    .required("Phone number is required")
    .min(10, "Enter a valid phone number"),
});

const AddPharmacy = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  initialData,
  setSelectedPharmacy,
}: Props) => {
  const isEdit = mode === "edit";
  const submitButtonText = isEdit ? "Save Changes" : "Save Pharmacy";
  const { mutateAsync: createPharmacy, isPending: isAddPending } = usePostJson([
    "create-pharmacy",
  ]);
  const { mutateAsync: updatePharmacy, isPending: isUpdatePending } =
    useUpdateData(["update-pharmacy"]);
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
      pharmacyName: "",
      pharmacyAddress: "",
      pharmacyPhone: "",
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && initialData) {
      reset({
        pharmacyName: initialData.pharmacyName,
        pharmacyAddress: initialData.pharmacyAddress,
        pharmacyPhone: initialData.pharmacyPhone,
      });
    } else {
      reset({
        pharmacyName: "",
        pharmacyAddress: "",
        pharmacyPhone: "",
      });
    }
  }, [isOpen, isEdit, initialData, reset]);

  const onSubmit = async (data: PharmacyFormData) => {
    // console.log("ACFORM", data);

    try {
      if (isEdit && initialData?.id) {
        await updatePharmacy({
          endpoint: apiRoutes.updatePharmacy(initialData.id),
          data,
        });
      } else {
        await createPharmacy({
          endpoint: apiRoutes.createPharmacy,
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
      <DialogContent className="max-w-md p-9 rounded-2xl  overflow-y-auto ">
        <button
          onClick={() => {
            onClose();
            setSelectedPharmacy?.(null);
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
              {isEdit ? "Edit Pharmacy" : "Add Pharmacy"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4 w-full px-4 "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* pharmacy Name */}
            <TextInputField
              label="Pharmacy Name"
              placeholder="Enter pharmacy Name"
              icon="/../icons/pharmacy-input-icon.svg"
              name="pharmacyName"
              register={register}
              error={errors.pharmacyName}
            />

            {/* address  */}
            <TextInputField
              label="Pharmacy Address"
              placeholder="Enter pharmacy address"
              icon="/../icons/men-neck-icon.svg"
              name="pharmacyAddress"
              register={register}
              error={errors.pharmacyAddress}
            />

            {/* phone  */}
            <PhoneNumberField
              label="Pharmacy Phone Number"
              icon="/../icons/call-icon.svg"
              value={watch("pharmacyPhone")}
              error={errors.pharmacyPhone}
              onChange={(v) =>
                setValue("pharmacyPhone", v, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />

            <div className="w-full flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                className="w-fit h-fit px-10 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
                onClick={() => {
                  onClose();
                  setSelectedPharmacy?.(null);
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

export default AddPharmacy;
