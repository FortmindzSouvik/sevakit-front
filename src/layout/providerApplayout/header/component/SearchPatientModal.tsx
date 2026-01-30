import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { X, Search, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { format } from "date-fns";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { usePostJson } from "@/hooks/usePostJson";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { toast } from "sonner";
import { AxiosError } from "axios";

type SearchForm = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email?: string;
  phoneNumber?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required."),
  lastName: yup.string().required("Last name is required."),
  dateOfBirth: yup.string().required("Date of birth is required."),
  email: yup.string().email("Invalid email").optional(),
  phoneNumber: yup.string().optional(),
});

const SearchPatientModal = ({ open, onOpenChange }: Props) => {
  const { mutateAsync: searchPatient, isPending: isSearchPatientPending } =
    usePostJson(["search-patient"]);

  const {
    mutateAsync: sendRequestToPatient,
    isPending: isSendRequestToPatientPending,
  } = usePostJson(["send-request-patient"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      email: "",
      phoneNumber: "",
    },
  });

  const [openDob, setOpenDob] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const onSubmit = async (data: SearchForm) => {
    const isoDate = data?.dateOfBirth;
    const formattedDob = format(new Date(isoDate), "yyyy-MM-dd");

    const payload = {
      firstName: data?.firstName?.toLowerCase(),
      lastName: data?.lastName?.toLowerCase(),
      dateOfBirth: formattedDob,
      ...(data?.email && { email: data.email }),
      ...(data?.phoneNumber && { phoneNumber: data.phoneNumber }),
    };

    setSearchResult(null);
    try {
      const response = await searchPatient({
        endpoint: apiRoutes.searchPatient,
        data: payload,
      });
      setSearchResult(response?.data?.patient || null);
    } catch (error) {
      console.log("error", error);
      setSearchResult(null);
      setHasSearched(true);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await trigger();
    setShowErrors(true);
    if (isValid) {
      handleSubmit(onSubmit)(e);
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    if (value.trim() && errors[fieldName as keyof typeof errors]) {
      clearErrors(fieldName as any);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setValue("dateOfBirth", date.toISOString(), {
        shouldValidate: true,
      });
      setOpenDob(false);
      if (errors.dateOfBirth) {
        clearErrors("dateOfBirth");
      }
    }
  };

  const handlePhoneChange = (value: string) => {
    const e164 = value ? `+${value}` : "";
    setValue("phoneNumber", e164, {
      shouldValidate: true,
    });
    if (errors.phoneNumber) {
      clearErrors("phoneNumber");
    }
  };

  const handleSendRequest = async (id: string) => {
    try {
      await sendRequestToPatient({
        endpoint: apiRoutes.sendRequestToPatient,
        data: {
          receiver: id,
        },
      });
      toast.success("Invitation sent to patient successfully.");
    } catch (err) {
      console.log("err", err);
      if (err instanceof AxiosError) {
        if (err?.response?.data?.code === 400) {
          toast.error("An invitation has already been sent to this patient.");
        }
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full h-screen max-w-full md:max-w-6xl lg:max-w-7xl max-h-none p-0 rounded-none sm:rounded-xl flex flex-col mx-auto font-mona">
        {/* Header */}
        <DialogHeader className="px-4 sm:px-6 py-4 border-b flex flex-row items-center justify-between">
          <DialogTitle className="text-base sm:text-lg font-medium">
            Search Patient
          </DialogTitle>

          <button
            onClick={() => {
              (onOpenChange(false),
                reset(),
                setSearchResult(null),
                setHasSearched(false));
            }}
            className="p-1 sm:p-2 cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </DialogHeader>

        {/* Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Search Fields Container */}
          <div className="space-y-2">
            <form
              onSubmit={handleFormSubmit}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-3"
            >
              {/* First Name */}
              <div className="sm:col-span-1 lg:col-span-1 space-y-1">
                <div className="h-14">
                  <div
                    className={`flex items-center gap-2 w-full rounded-lg border bg-white px-3 py-3 h-14 ${
                      showErrors && errors.firstName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src="/../icons/name-icon.svg"
                      alt="name-icon"
                      className="w-4 h-4"
                    />
                    <div className="h-8 w-px bg-[#D9D9D9]" />
                    <div className="flex flex-col w-full">
                      <label className="text-xs text-[#616161] font-medium font-mona">
                        First Name<span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter"
                        {...register("firstName", {
                          onChange: (e) =>
                            handleInputChange("firstName", e.target.value),
                        })}
                        className="border-0 shadow-none p-0 mt-0.5 h-6 text-[16px] sm:text-[16px] focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </div>
                {showErrors && errors.firstName && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div className="sm:col-span-1 lg:col-span-1 space-y-1">
                <div className="h-14">
                  <div
                    className={`flex items-center gap-2 w-full rounded-lg border bg-white px-3 py-3 h-14 ${
                      showErrors && errors.lastName
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src="/../icons/name-icon.svg"
                      alt="name-icon"
                      className="w-4 h-4"
                    />
                    <div className="h-8 w-px bg-[#D9D9D9]" />
                    <div className="flex flex-col w-full">
                      <label className="text-xs text-[#616161] font-medium font-mona">
                        Last Name<span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter"
                        {...register("lastName", {
                          onChange: (e) =>
                            handleInputChange("lastName", e.target.value),
                        })}
                        className="border-0 shadow-none p-0 mt-0.5 h-6 text-[16px] sm:text-[16px] focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </div>
                {showErrors && errors.lastName && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="sm:col-span-1 lg:col-span-1 space-y-1">
                <div className="h-14">
                  <div
                    className={`flex items-center gap-2 w-full rounded-lg border bg-white px-3 py-3 h-14 ${
                      showErrors && errors.dateOfBirth
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src="/../icons/calendar-icon.svg"
                      alt="calendar-icon"
                      className="w-4 h-4"
                    />
                    <div className="h-8 w-px bg-[#D9D9D9]" />
                    <div className="flex flex-col w-full">
                      <label className="text-xs text-[#616161] font-medium font-mona">
                        Date of Birth<span className="text-red-500">*</span>
                      </label>

                      <Popover open={openDob} onOpenChange={setOpenDob}>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="text-left border-0 shadow-none p-0 mt-0.5 h-6 text-[16px] sm:text-[16px] w-full focus-visible:ring-0 font-mona text-[#616161] hover:cursor-pointer"
                          >
                            {watch("dateOfBirth")
                              ? format(
                                  new Date(watch("dateOfBirth")!),
                                  "MM-dd-yyyy",
                                )
                              : "MM-DD-YYYY"}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="p-0 w-auto"
                          align="start"
                          side="bottom"
                          sideOffset={5}
                        >
                          <Calendar
                            mode="single"
                            captionLayout="dropdown"
                            selected={
                              watch("dateOfBirth")
                                ? new Date(watch("dateOfBirth")!)
                                : undefined
                            }
                            onSelect={handleDateChange}
                            className="rounded-md border"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                {showErrors && errors.dateOfBirth && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="sm:col-span-1 lg:col-span-1 space-y-1">
                <div className="h-14">
                  <div
                    className={`flex items-center gap-2 w-full rounded-lg border bg-white px-3 py-3 h-14 ${
                      showErrors && errors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src="/../icons/email-icon.svg"
                      alt="email-icon"
                      className="w-4 h-4"
                    />
                    <div className="h-8 w-px bg-[#D9D9D9]" />
                    <div className="flex flex-col w-full">
                      <label className="text-xs text-[#616161] font-medium font-mona">
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="Enter"
                        {...register("email", {
                          onChange: (e) =>
                            handleInputChange("email", e.target.value),
                        })}
                        className="border-0 shadow-none p-0 mt-0.5 h-6 text-[16px] sm:text-[16px] focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </div>
                {showErrors && errors.email && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="sm:col-span-1 lg:col-span-1 space-y-1">
                <div className="h-14">
                  <div
                    className={`flex items-center gap-2 w-full rounded-lg border bg-white px-3 py-3 h-14 ${
                      showErrors && errors.phoneNumber
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src="/../icons/call-icon.svg"
                      alt="phone-icon"
                      className="w-4 h-4"
                    />
                    <div className="h-8 w-px bg-[#D9D9D9]" />
                    <div className="flex flex-col w-full">
                      <label className="text-xs text-[#616161] font-medium font-mona">
                        Phone
                      </label>
                      <div className="mt-0.5 h-6">
                        <PhoneInput
                          country={"us"}
                          enableSearch
                          countryCodeEditable={false}
                          value={watch("phoneNumber")?.replace("+", "") || ""}
                          onChange={handlePhoneChange}
                          inputStyle={{
                            width: "100%",
                            border: "none",
                            height: "24px",
                            fontSize: "16px",
                            boxShadow: "none",
                            paddingLeft: "42px",
                            backgroundColor: "transparent",
                          }}
                          buttonStyle={{
                            border: "none",
                            background: "transparent",
                            padding: "0 5px 0 0",
                            height: "24px",
                          }}
                          dropdownStyle={{
                            fontSize: "16x",
                          }}
                          containerStyle={{
                            width: "100%",
                            marginTop: "-1px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {showErrors && errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Search Button */}
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="h-14 flex items-end">
                  <button
                    type="submit"
                    disabled={isSearchPatientPending}
                    className={`h-14 w-full rounded-lg flex items-center justify-center transition-colors ${isSearchPatientPending ? "bg-[#B2EBF2] cursor-not-allowed" : "bg-[#00BCD4] hover:bg-[#00acc1] cursor-pointer"} `}
                  >
                    <Search className="text-white w-5 h-5 " />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Search Result */}
          <div className="mt-6 sm:mt-8 font-mona">
            <h4 className="text-lg font-medium border-b mb-3">Search Result</h4>

            {/* loader */}
            {isSearchPatientPending && (
              <div className="border rounded-xl p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* result */}
            {!isSearchPatientPending && searchResult && (
              <div className="border rounded-xl overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="bg-[#F8FDFF]">
                    <tr>
                      <th className="border px-4 py-3 text-left">
                        Patient Name
                      </th>
                      <th className="border px-4 py-3 text-left">
                        Date of Birth
                      </th>
                      <th className="border px-4 py-3 text-left">
                        Phone Number
                      </th>
                      <th className="border px-4 py-3 text-left">Email</th>
                      <th className="border px-4 py-3 text-left">Request</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-4 py-3 capitalize">
                        {searchResult.firstName} {searchResult.lastName}
                      </td>
                      <td className="border px-4 py-3">
                        {format(
                          new Date(searchResult.dateOfBirth),
                          "MMM dd, yyyy",
                        )}
                      </td>
                      <td className="border px-4 py-3">
                        {searchResult.phoneNumber || "-"}
                      </td>
                      <td className="border px-4 py-3">
                        {searchResult.email || "-"}
                      </td>
                      <td className="border px-4 py-3 ">
                        <Send
                          size={18}
                          onClick={() => {
                            if (
                              isSendRequestToPatientPending ||
                              isSearchPatientPending
                            )
                              return;
                            handleSendRequest(searchResult?.id);
                          }}
                          className={`${
                            isSendRequestToPatientPending ||
                            isSearchPatientPending
                              ? "text-gray-400 cursor-not-allowed"
                              : "cursor-pointer text-black hover:text-[#00BCD4]"
                          }`}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* no result found */}
            {!isSearchPatientPending && hasSearched && !searchResult && (
              <div className="flex justify-center mt-16">
                <div className="text-center max-w-md space-y-5">
                  <img
                    src="/../icons/!-sign-color-icon.svg"
                    className="mx-auto w-20 h-20"
                  />
                  <h2 className="text-xl font-bold">
                    This patient is not registered in KIT.
                  </h2>
                  <p className="text-gray-600">
                    Would you like to create an account?
                  </p>

                  <div className="flex gap-3">
                    <button
                      className="w-1/3 border border-[#00BCD4] rounded-xl py-3 cursor-pointer"
                      onClick={() => {
                        (onOpenChange(false),
                          reset(),
                          setSearchResult(null),
                          setHasSearched(false));
                      }}
                    >
                      Cancel
                    </button>
                    <button className="w-2/3 bg-[#009FB6] rounded-xl py-3">
                      Create Patient Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchPatientModal;
