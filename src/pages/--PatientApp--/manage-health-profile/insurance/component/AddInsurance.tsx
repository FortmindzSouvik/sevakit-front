import DatePickerField from "@/components/form/DatePickerField";
import PhoneNumberField from "@/components/form/PhoneNumberField";
// import RadioField from "@/components/form/RadioField";
import TextInputField from "@/components/form/TextInputField";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
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

type InsuranceForm = {
  id?: string;
  providerName: string;
  memberId: string;
  groupId: string;
  expirationDate: string;
  primaryInsuredName: string;
  customerServiceContact: string;
  isSecondary?: boolean;
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
  providerName: yup.string().required("Provider Name is required"),
  memberId: yup.string().required("Member ID is required"),
  groupId: yup.string().required("Group ID is required"),
  primaryInsuredName: yup.string().optional(),
  expirationDate: yup.string().required("Expiry date is required"),
  customerServiceContact: yup
    .string()
    .required("Phone number is required")
    .min(10, "Enter a valid phone number"),
  isSecondary: yup.boolean().optional(),
});

const AddInsurance = ({
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  initialData,
  setSelectedInsurance,
}: Props) => {
  const isEdit = mode === "edit";
  const submitButtonText = isEdit ? "Save Changes" : "Add Insurance";
  const loaderButtonText = isEdit ? "Updating..." : "Creating...";
  const { mutateAsync: createInsurance, isPending: isAddPending } = usePostJson(
    ["create-insurance"]
  );
  const { mutateAsync: updateInsurance, isPending: isUpdatePending } =
    useUpdateData(["update-insurance"]);

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
      providerName: "",
      memberId: "",
      groupId: "",
      primaryInsuredName: "",
      expirationDate: "",
      customerServiceContact: "",
      isSecondary: false,
    },
  });
  // const isSecondary = watch("isSecondary");
  useEffect(() => {
    if (!isOpen) return;

    if (isEdit && initialData) {
      reset({
        providerName: initialData?.providerName,
        memberId: initialData?.memberId,
        groupId: initialData?.groupId,
        primaryInsuredName: initialData?.primaryInsuredName,
        expirationDate: initialData?.expirationDate,
        customerServiceContact: initialData?.customerServiceContact,
        isSecondary: !!initialData.isSecondary,
      });
    } else {
      reset({
        providerName: "",
        memberId: "",
        groupId: "",
        primaryInsuredName: "",
        expirationDate: "",
        customerServiceContact: "",
        isSecondary: false,
      });
    }
  }, [isOpen, isEdit, initialData, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && initialData?.id) {
        await updateInsurance({
          endpoint: apiRoutes.updateInsurance(initialData.id),
          data,
        });
      } else {
        await createInsurance({
          endpoint: apiRoutes.createInsurance,
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
      <DialogContent className="max-w-md p-9 rounded-2xl max-h-[90vh] overflow-y-auto ">
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
              {isEdit ? "Edit Insurance Card" : "Add Insurance Card"}
            </DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4 w-full px-4 "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* provider Name */}
            <TextInputField
              label="Provider Name"
              placeholder="Enter provider name"
              icon="/../icons/share-profile-icon.svg"
              name="providerName"
              register={register}
              error={errors.providerName}
            />

            {/* Member ID */}
            <TextInputField
              label="Member ID"
              placeholder="Enter member ID"
              icon="/../icons/tv-icon.svg"
              name="memberId"
              register={register}
              error={errors.memberId}
            />

            {/* group ID */}
            <TextInputField
              label="Group ID"
              placeholder="Enter group ID"
              icon="/../icons/name-icon.svg"
              name="groupId"
              register={register}
              error={errors.groupId}
            />
            {/* expiry date */}
            <DatePickerField
              label="Expiry Date"
              icon="/../icons/calendar-icon.svg"
              allowFuture
              value={watch("expirationDate")}
              onChange={(v) =>
                setValue("expirationDate", v, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              error={errors.expirationDate}
            />

            {/* primary insured name */}
            <TextInputField
              label="Primary Insured Name"
              placeholder="John Doe"
              icon="/../icons/group-icon.svg"
              name="primaryInsuredName"
              register={register}
              error={errors.primaryInsuredName}
            />
            <p className="flex items-start text-sm font-medium font-mona text-[#4A4A4A]">
              Name of insured - if different from user
            </p>

            {/* customerServiceContact  */}
            <PhoneNumberField
              label="Customer Service Contact"
              icon="/../icons/call-icon.svg"
              value={watch("customerServiceContact")}
              error={errors.customerServiceContact}
              onChange={(v) =>
                setValue("customerServiceContact", v, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
            />
            <div className="flex items-center gap-3 mt-2">
              <Switch
                checked={watch("isSecondary")}
                className="w-12 h-6"
                onCheckedChange={(checked) =>
                  setValue("isSecondary", checked, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              />

              <span className="text-sm font-mona font-medium text-[#4A4A4A]">
                Mark it as a secondary insurance
              </span>
            </div>

            {/* <RadioField
              value={isSecondary ? "yes" : ""}
              onChange={() => {
                setValue("isSecondary", !isSecondary, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              options={[
                {
                  label: "Mark it as a secondary insurance",
                  value: "yes",
                },
              ]}
            /> */}

            <div className="w-full flex items-center justify-center gap-6 pt-2">
              <button
                type="button"
                className="w-1/3 h-fit px-8 py-4 border border-[#00BCD4] text-[#00BCD4] rounded-xl font-normal cursor-pointer font-mona text-sm"
                onClick={() => {
                  onClose();
                  setSelectedInsurance?.(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isAddPending || isUpdatePending}
                className="flex items-center justify-center w-2/3 h-fit px-10 py-4 bg-[#00BCD4] text-[#212121] rounded-xl shadow-none hover:bg-[#00BCD4] active:bg-[#00BCD4] cursor-pointer font-mona"
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

export default AddInsurance;
