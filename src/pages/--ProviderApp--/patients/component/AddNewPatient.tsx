import DatePickerField from "@/components/form/DatePickerField";
import PhoneNumberField from "@/components/form/PhoneNumberField";
import PhotoUpload from "@/components/form/PhotoUpload";
import SelectField from "@/components/form/SelectField";
import SwitchField from "@/components/form/SwitchField";
import TextInputField from "@/components/form/TextInputField";
import { ROUTES } from "@/utils/routeConstants";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const AddNewPatient = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  console.log("isUploading", isUploading);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      driverFullName: "",
      driverLicenseNumber: "",
      driverIssuingState: "",
      driverExpirationDate: "",
      firstName: "",
      lastName: "",
      dateofBirth: "",
      gender: "",
      phoneNumber: "",
      email: "",
      frontImg: {
        fileUrl: "",
        s3Key: "",
      },
      profilePhoto: {
        fileUrl: "",
        s3Key: "",
      },
      backImg: {
        fileUrl: "",
        s3Key: "",
      },
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },

      emergencyContacts: [
        {
          contactName: "",
          relationship: "",
          contactPhoneNumber: "",
          contactEmail: "",
          address: {
            street: "",
            city: "",
            state: "",
            zip: "",
            country: "",
          },
        },
      ],

      advanceCareFields: [
        {
          resuscitationPreference: "",
          codeStatusDocument: {
            fileUrl: "",
            fileName: "",
            s3Key: "",
          },
        },
      ],

      allergiesFields: [
        {
          allergenName: "",
          reactionType: "",
          severity: "",
          notes: "",
        },
      ],

      medicationFields: [
        {
          medicationEntryMethod: "",
          medicationName: "",
          form: "",
          dosageNotes: "",
          dosageFrequency: "",
          isActive: false,
          isReminder: false,
        },
      ],

      medicalReportsFields: [
        {
          title: "",
          documentType: "",
          uploadedBy: "",
          recordDate: "",
          document: {
            fileUrl: "",
            s3Key: "",
          },
        },
      ],
      insuranceFields: [
        {
          providerName: "",
          memberId: "",
          groupId: "",
          primaryInsuredName: "",
          expirationDate: "",
          customerServiceContact: "",
          isSecondary: false,
          frontImg: {
            fileUrl: "",
            s3Key: "",
          },
          backImg: {
            fileUrl: "",
            s3Key: "",
          },
        },
      ],

      doctorName: "",
      medicalFacility: "",
      doctorEmail: "",
      doctorAddress: "",
      doctorPhone: "",
      primaryCareAddress: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
    },
  });

  const {
    fields: emergencyFields,
    append: appendEmergency,
    remove: removeEmergency,
  } = useFieldArray({
    control,
    name: "emergencyContacts",
  });

  const {
    fields: advanceCareFields,
    append: appendAdvanceCare,
    remove: removeAdvanceCare,
  } = useFieldArray({
    control,
    name: "advanceCareFields",
  });

  const {
    fields: allergiesFields,
    append: appendAllergies,
    remove: removeAllergies,
  } = useFieldArray({
    control,
    name: "allergiesFields",
  });

  const {
    fields: medicationFields,
    append: appendMedication,
    remove: removeMedication,
  } = useFieldArray({
    control,
    name: "medicationFields",
  });

  const {
    fields: medicalReportsFields,
    append: appendMedicalReports,
    remove: removeMedicalReports,
  } = useFieldArray({
    control,
    name: "medicalReportsFields",
  });

  const {
    fields: insuranceFields,
    append: appendIsurance,
    remove: removeInsurance,
  } = useFieldArray({
    control,
    name: "insuranceFields",
  });

  const onSubmit = (data: any) => {
    console.log(data);
    alert("Form submitted successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 fornt-mona">
        <button
          className="flex items-center gap-2 text-[16px] font-medium cursor-pointer"
          onClick={() =>
            navigate(`/${ROUTES.role.provider}/${ROUTES.provider.patients}`)
          }
        >
          <img src="/../icons/back-arrow-icon.svg" className="w-fit h-fit" />
          Back
        </button>

        <div className="flex gap-2">
          <button className="w-fit h-fit border text-[#00BCD4] border-[#00BCD4] rounded-sm px-2 py-1.5 font-medium">
            Cancel
          </button>
          <button className="bg-[#00BCD4] text-black px-4 py-2 rounded-sm text-sm font-medium flex items-center gap-2 cursor-pointer">
            Create Patient
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8">
          {/* ================= Driver’s License ================= */}
          <div className="rounded-2xl border bg-[#F7FDFF] p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Driver’s License
            </h2>
            <p className="mt-1 text-sm text-gray-500">Upload Document</p>

            {/* Upload section */}
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* front side photo   */}
              <PhotoUpload
                label="Front of Driving License"
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
                label="Back of Driving License"
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
            </div>

            {/* Form fields */}
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* full Name */}
              <TextInputField
                label="Full Name"
                placeholder="Enter full name"
                icon="/../icons/name-icon.svg"
                name="driverFullName"
                register={register}
                error={errors.driverFullName}
                className={`py-1.5`}
              />

              {/* license number */}
              <TextInputField
                label="License Number"
                placeholder="Enter license number"
                icon="/../icons/id-badge1-icon.svg"
                name="driverLicenseNumber"
                register={register}
                error={errors.driverLicenseNumber}
                className={`py-1.5`}
              />
              {/* state number */}
              <TextInputField
                label="State"
                placeholder="Enter state"
                icon="/../icons/men-neck-icon.svg"
                name="driverIssuingState"
                register={register}
                error={errors.driverIssuingState}
                className={`py-1.5`}
              />

              {/* expiry date */}
              <DatePickerField
                label="Expiry Date"
                icon="/../icons/calendar-icon.svg"
                value={watch("driverExpirationDate")}
                allowFuture
                onChange={(v) =>
                  setValue("driverExpirationDate", v, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                error={errors.driverExpirationDate}
                className={`py-1.5`}
              />
            </div>
          </div>

          {/* ================= Personal Information ================= */}
          <div className="rounded-2xl border bg-[#F7FDFF] p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h2>

            {/* Profile photo */}
            <div className="mt-4">
              {/* profile photo   */}
              <PhotoUpload
                label="Profile Photo"
                name="profilePhoto"
                icon="/../icons/upload-icon.svg"
                register={register}
                setValue={setValue}
                clearErrors={clearErrors}
                error={errors.profilePhoto?.fileUrl}
                rename={"Upload Pic"}
                value={watch("profilePhoto")}
                onUploadingChange={setIsUploading}
              />
            </div>

            {/* Form fields */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* first Name */}
              <TextInputField
                label="First Name"
                placeholder="Enter your first name"
                icon="/../icons/name-icon.svg"
                name="firstName"
                register={register}
                error={errors.firstName}
                className={`py-1.5`}
              />
              <TextInputField
                label="Last Name"
                placeholder="Enter your last name"
                icon="/../icons/name-icon.svg"
                name="lastName"
                register={register}
                error={errors.lastName}
                className={`py-1.5`}
              />

              {/* gender Entry */}
              <SelectField
                key={watch("gender") || "gender"}
                label="Gender"
                icon="/../icons/tv-icon.svg"
                value={watch("gender")}
                onChange={(v) =>
                  setValue("gender", v, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: false,
                  })
                }
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Other", value: "other" },
                ]}
                error={errors.gender}
                className={`py-1.5`}
              />

              {/* expiry date */}
              <DatePickerField
                label="Date of birth"
                icon="/../icons/calendar-icon.svg"
                value={watch("dateofBirth")}
                allowFuture
                onChange={(v) =>
                  setValue("dateofBirth", v, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                error={errors.dateofBirth}
                className={`py-1.5`}
              />
            </div>
          </div>

          {/* ================= Personal Contact ================= */}
          <div className="rounded-2xl border bg-[#F7FDFF] p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Conatct
            </h2>

            {/* Form fields */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* phone  */}
              <PhoneNumberField
                label="Phone Number"
                icon="/../icons/call-icon.svg"
                value={watch("phoneNumber")}
                error={errors.phoneNumber}
                onChange={(v) =>
                  setValue("phoneNumber", v, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
                className={`py-1`}
              />

              {/* email */}
              <TextInputField
                label="Email"
                placeholder="john.doe@example.com"
                icon="/../icons/email-icon.svg"
                name="email"
                register={register}
                error={errors.email}
                className={`py-1.5`}
              />
            </div>
          </div>

          {/* ================= Personal address ================= */}
          <div className="rounded-2xl border bg-[#F7FDFF] p-6">
            <h2 className="text-lg font-semibold text-gray-900">Address</h2>

            {/* Profile photo */}
            <div className="mt-4">
              {/* street */}
              <TextInputField
                label="Street"
                placeholder="123 Main St"
                icon="/../icons/men-neck-icon.svg"
                name="address.street"
                register={register}
                error={errors?.address?.street}
                className={`py-1.5`}
              />
            </div>

            {/* Form fields */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* city */}
              <TextInputField
                label="City"
                placeholder="San Francisco"
                icon="/../icons/men-neck-icon.svg"
                name="address.city"
                register={register}
                error={errors?.address?.city}
                className={`py-1.5`}
              />
              {/* state */}
              <TextInputField
                label="State"
                placeholder="San Francisco"
                icon="/../icons/men-neck-icon.svg"
                name="address.state"
                register={register}
                error={errors?.address?.state}
                className={`py-1.5`}
              />
              {/* zip */}
              <TextInputField
                label="Zip"
                placeholder="CA94105"
                icon="/../icons/men-neck-icon.svg"
                name="address.zip"
                register={register}
                error={errors?.address?.zip}
                className={`py-1.5`}
              />
              {/* country */}
              <TextInputField
                label="Country"
                placeholder="United State"
                icon="/../icons/men-neck-icon.svg"
                name="address.country"
                register={register}
                error={errors?.address?.country}
                className={`py-1.5`}
              />
            </div>
          </div>

          {/* ================= Emergency ================= */}
          <div className="rounded-2xl border bg-[#F7FDFF] p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Emergency Contact
            </h2>

            {emergencyFields.map((field, index) => (
              <div
                key={field.id}
                className="relative mt-6 rounded-xl border bg-white p-12"
              >
                {/* Remove button */}
                {emergencyFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEmergency(index)}
                    className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full border border-red-400 text-red-500 bg-white hover:bg-red-500 hover:text-white transition"
                  >
                    <Minus size={16} />
                  </button>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <TextInputField
                    label="Full Name"
                    placeholder="Enter full name"
                    icon="/../icons/name-icon.svg"
                    name={`emergencyContacts.${index}.contactName`}
                    register={register}
                    error={errors?.emergencyContacts?.[index]?.contactName}
                    className={`py-1.5`}
                  />

                  <SelectField
                    label="Relationship"
                    icon="/../icons/family-icon.svg"
                    value={watch(`emergencyContacts.${index}.relationship`)}
                    onChange={(v) =>
                      setValue(`emergencyContacts.${index}.relationship`, v)
                    }
                    options={[
                      { label: "Father", value: "father" },
                      { label: "Mother", value: "mother" },
                      { label: "Spouse", value: "spouse" },
                    ]}
                    error={errors?.emergencyContacts?.[index]?.relationship}
                    className={`py-1.5`}
                  />

                  <PhoneNumberField
                    label="Phone Number"
                    icon="/../icons/call-icon.svg"
                    value={watch(
                      `emergencyContacts.${index}.contactPhoneNumber`,
                    )}
                    error={
                      errors?.emergencyContacts?.[index]?.contactPhoneNumber
                    }
                    onChange={(v) =>
                      setValue(
                        `emergencyContacts.${index}.contactPhoneNumber`,
                        v,
                      )
                    }
                    className={`py-1`}
                  />

                  <TextInputField
                    label="Email Address"
                    placeholder="Enter email address"
                    icon="/../icons/email-icon.svg"
                    name={`emergencyContacts.${index}.contactEmail`}
                    register={register}
                    error={errors?.emergencyContacts?.[index]?.contactEmail}
                    className={`py-1.5`}
                  />
                </div>

                {/* Address */}
                <p className="mt-4 text-sm text-gray-500 border-b pb-1">
                  Address
                </p>

                <div className="mt-4 space-y-4">
                  <TextInputField
                    label="Street"
                    placeholder="123 Main St"
                    icon="/../icons/men-neck-icon.svg"
                    name={`emergencyContacts.${index}.address.street`}
                    register={register}
                    error={errors?.emergencyContacts?.[index]?.address?.street}
                    className={`py-1.5`}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <TextInputField
                      label="City"
                      placeholder="San Francisco"
                      icon="/../icons/men-neck-icon.svg"
                      name={`emergencyContacts.${index}.address.city`}
                      register={register}
                      className={`py-1.5`}
                    />
                    <TextInputField
                      label="State"
                      placeholder="California"
                      icon="/../icons/men-neck-icon.svg"
                      name={`emergencyContacts.${index}.address.state`}
                      register={register}
                      className={`py-1.5`}
                    />
                    <TextInputField
                      label="Zip"
                      placeholder="94105"
                      icon="/../icons/men-neck-icon.svg"
                      name={`emergencyContacts.${index}.address.zip`}
                      register={register}
                      className={`py-1.5`}
                    />
                    <TextInputField
                      label="Country"
                      placeholder="United States"
                      icon="/../icons/men-neck-icon.svg"
                      name={`emergencyContacts.${index}.address.country`}
                      register={register}
                      className={`py-1.5`}
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() =>
                  appendEmergency({
                    contactName: "",
                    relationship: "",
                    contactPhoneNumber: "",
                    contactEmail: "",
                    address: {
                      street: "",
                      city: "",
                      state: "",
                      zip: "",
                      country: "",
                    },
                  })
                }
                className="flex items-center border px-3 py-2.5 rounded-sm text-[#00BCD4] border-[#00BCD4] cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Emergency Contact
              </button>
            </div>
          </div>

          {/* ================= Primary Care ================= */}
          <div className="rounded-2xl border bg-[#F7FDFF] p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Primary Care Information
            </h2>
            {/* Form fields */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* care provider Name */}
              <TextInputField
                label="Care Provider Name"
                placeholder="Enter care provider name"
                icon="/../icons/primary-care-input-icon.svg"
                name="doctorName"
                register={register}
                error={errors.doctorName}
                className={`py-1.5`}
              />

              {/* clininName  */}
              <TextInputField
                label="Clinic Name"
                placeholder="Enter clinic name"
                icon="/../icons/clinic-icon.svg"
                name="medicalFacility"
                register={register}
                error={errors.medicalFacility}
                className={`py-1.5`}
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
                className={`py-1`}
              />
              {/* email */}
              <TextInputField
                label="Email"
                placeholder="Enter care provider email"
                icon="/../icons/email-icon.svg"
                name="doctorEmail"
                register={register}
                error={errors.doctorEmail}
                className={`py-1.5`}
              />
            </div>
            <div className="mt-4">
              <p className="mt-1 text-sm text-gray-500 border-b mb-3">
                Address
              </p>
              <TextInputField
                label="Street"
                placeholder="123 Main St"
                icon="/../icons/men-neck-icon.svg"
                name="primaryCareAddress.street"
                register={register}
                error={errors?.primaryCareAddress?.street}
                className={`py-1.5`}
              />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* city */}
              <TextInputField
                label="City"
                placeholder="San Francisco"
                icon="/../icons/men-neck-icon.svg"
                name="primaryCareAddress.city"
                register={register}
                error={errors?.primaryCareAddress?.city}
                className={`py-1.5`}
              />
              {/* state */}
              <TextInputField
                label="State"
                placeholder="San Francisco"
                icon="/../icons/men-neck-icon.svg"
                name="primaryCareAddress.state"
                register={register}
                error={errors?.primaryCareAddress?.state}
                className={`py-1.5`}
              />
              {/* zip */}
              <TextInputField
                label="Zip"
                placeholder="CA94105"
                icon="/../icons/men-neck-icon.svg"
                name="primaryCareAddress.zip"
                register={register}
                error={errors?.primaryCareAddress?.zip}
                className={`py-1.5`}
              />
              {/* country */}
              <TextInputField
                label="Country"
                placeholder="United State"
                icon="/../icons/men-neck-icon.svg"
                name="primaryCareAddress.country"
                register={register}
                error={errors?.primaryCareAddress?.country}
                className={`py-1.5`}
              />
            </div>
          </div>

          {/* ================= Advance care plan ================= */}
          <div className="rounded-2xl border bg-[#F7FDFF] p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Advance Care Planning
            </h2>

            {advanceCareFields.map((field, index) => (
              <div
                key={field.id}
                className="relative mt-6 rounded-xl border bg-white p-11"
              >
                {/* Remove button */}
                {advanceCareFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAdvanceCare(index)}
                    className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full border border-red-400 text-red-500 bg-white hover:bg-red-500 hover:text-white transition"
                  >
                    <Minus size={16} />
                  </button>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* code status*/}
                  <SelectField
                    label="Code Status"
                    icon="/../icons/advance-care-icon.svg"
                    value={watch(
                      `advanceCareFields.${index}.resuscitationPreference`,
                    )}
                    onChange={(v) =>
                      setValue(
                        `advanceCareFields.${index}.resuscitationPreference`,
                        v,
                        {
                          shouldValidate: true,
                        },
                      )
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
                    error={
                      errors?.advanceCareFields?.[index]
                        ?.resuscitationPreference
                    }
                    className={`py-1.5`}
                  />

                  {/* upload photo   */}
                  <PhotoUpload
                    label="Upload ACP Document"
                    name={`advanceCareFields.${index}.codeStatusDocument`}
                    icon="/../icons/upload-icon.svg"
                    register={register}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    error={
                      errors?.advanceCareFields?.[index]?.codeStatusDocument
                        ?.fileUrl
                    }
                    rename={"Upload documents"}
                    value={watch(
                      `advanceCareFields.${index}.codeStatusDocument`,
                    )}
                    onUploadingChange={setIsUploading}
                  />
                </div>
              </div>
            ))}

            {/* Add button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() =>
                  appendAdvanceCare({
                    resuscitationPreference: "",
                    codeStatusDocument: {
                      fileUrl: "",
                      fileName: "",
                      s3Key: "",
                    },
                  })
                }
                className="flex items-center border px-3 py-2.5 rounded-sm text-[#00BCD4] border-[#00BCD4] cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Advance Care Planning
              </button>
            </div>
          </div>

          {/* ================= Allergies ================= */}
          <div className="rounded-2xl border bg-[#F7FDFF] p-6">
            <h2 className="text-lg font-semibold text-gray-900">Allergies</h2>

            {allergiesFields.map((field, index) => (
              <div
                key={field.id}
                className="relative mt-6 rounded-xl border bg-white p-11"
              >
                {/* Remove button */}
                {allergiesFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAllergies(index)}
                    className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full border border-red-400 text-red-500 bg-white hover:bg-red-500 hover:text-white transition"
                  >
                    <Minus size={16} />
                  </button>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <TextInputField
                    label="Allergy Name"
                    placeholder="Penicillin"
                    icon="/../icons/allergie-icon.svg"
                    name={`allergiesFields.${index}.allergenName`}
                    register={register}
                    error={errors?.allergiesFields?.[index]?.allergenName}
                    className={`py-1.5`}
                  />

                  <TextInputField
                    label="Reaction"
                    placeholder="Rash, Swelling"
                    icon="/../icons/allergie-icon.svg"
                    name={`allergiesFields.${index}.reactionType`}
                    register={register}
                    error={errors?.allergiesFields?.[index]?.reactionType}
                    className={`py-1.5`}
                  />

                  <SelectField
                    label="Severity"
                    icon="/../icons/allergie-icon.svg"
                    value={watch(`allergiesFields.${index}.severity`)}
                    onChange={(v) =>
                      setValue(`allergiesFields.${index}.severity`, v)
                    }
                    options={[
                      { label: "Moderate", value: "Moderate" },
                      { label: "Severe", value: "Severe" },
                      { label: "Mild", value: "Mild" },
                    ]}
                    error={errors?.allergiesFields?.[index]?.severity}
                    className={`py-1.5`}
                  />

                  <TextInputField
                    label="Notes"
                    placeholder="Additional notes if needed"
                    icon="/../icons/allergie-icon.svg"
                    name={`allergiesFields.${index}.notes`}
                    register={register}
                    error={errors?.allergiesFields?.[index]?.notes}
                    className={`py-1.5`}
                  />
                </div>
              </div>
            ))}

            {/* Add button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() =>
                  appendAllergies({
                    allergenName: "",
                    reactionType: "",
                    severity: "",
                    notes: "",
                  })
                }
                className="flex items-center border px-3 py-2.5 rounded-sm text-[#00BCD4] border-[#00BCD4] cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Log Allergies
              </button>
            </div>
          </div>

          {/* ================= Medication ================= */}
          <div className="rounded-2xl border bg-[#F7FDFF] p-6">
            <h2 className="text-lg font-semibold text-gray-900">Medications</h2>

            {medicationFields.map((field, index) => (
              <div
                key={field.id}
                className="relative mt-6 rounded-xl border bg-white p-12"
              >
                {/* Remove button */}
                {medicationFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full border border-red-400 text-red-500 bg-white hover:bg-red-500 hover:text-white transition"
                  >
                    <Minus size={16} />
                  </button>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <SelectField
                    label="Medication Entry Method"
                    icon="/../icons/manual-entry-icon.svg"
                    value={watch(
                      `medicationFields.${index}.medicationEntryMethod`,
                    )}
                    onChange={(v) =>
                      setValue(
                        `medicationFields.${index}.medicationEntryMethod`,
                        v,
                      )
                    }
                    options={[
                      { label: "Manual Entry", value: "manual" },
                      // { label: "Upload Prescription", value: "upload" },
                    ]}
                    error={
                      errors?.medicationFields?.[index]?.medicationEntryMethod
                    }
                    className={`py-1.5`}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mona">
                    <SwitchField
                      label="Currently Active?"
                      value={
                        watch(`medicationFields.${index}.isActive`) ?? false
                      }
                      onChange={(v) =>
                        setValue(`medicationFields.${index}.isActive`, v, {
                          shouldValidate: true,
                        })
                      }
                      error={errors?.medicationFields?.[index]?.isActive}
                      className="py-0.5"
                    />

                    <SwitchField
                      label="Need a Reminder?"
                      value={
                        watch(`medicationFields.${index}.isReminder`) ?? false
                      }
                      onChange={(v) =>
                        setValue(`medicationFields.${index}.isReminder`, v, {
                          shouldValidate: true,
                        })
                      }
                      error={errors?.medicationFields?.[index]?.isReminder}
                      className="py-0.5"
                    />
                  </div>

                  <TextInputField
                    label="Medication Name"
                    placeholder="Generic"
                    icon="/../icons/medi-icon.svg"
                    name={`medicationFields.${index}.medicationName`}
                    register={register}
                    error={errors?.medicationFields?.[index]?.medicationName}
                    className={`py-1.5`}
                  />

                  <TextInputField
                    label="Form"
                    placeholder="Tablet, Capsule"
                    icon="/../icons/med-black-icon.svg"
                    name={`medicationFields.${index}.form`}
                    register={register}
                    error={errors?.medicationFields?.[index]?.form}
                    className={`py-1.5`}
                  />

                  <TextInputField
                    label="Dosage"
                    placeholder="Additional notes if needed"
                    icon="/../icons/dosage-icon.svg"
                    name={`medicationFields.${index}.dosageNotes`}
                    register={register}
                    error={errors?.medicationFields?.[index]?.dosageNotes}
                    className={`py-1.5`}
                  />

                  <SelectField
                    label="Dosage Frequency"
                    icon="/../icons/dosage-freq-icon.svg"
                    value={watch(`medicationFields.${index}.dosageFrequency`)}
                    onChange={(v) =>
                      setValue(`medicationFields.${index}.dosageFrequency`, v)
                    }
                    options={[
                      { label: "Once Daily", value: "Once Daily" },
                      { label: "Twice Daily", value: "Twice Daily" },
                    ]}
                    error={errors?.medicationFields?.[index]?.dosageFrequency}
                    className={`py-1.5`}
                  />
                </div>
              </div>
            ))}

            {/* Add button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() =>
                  appendMedication({
                    medicationEntryMethod: "",
                    medicationName: "",
                    form: "",
                    dosageNotes: "",
                    dosageFrequency: "",
                    isActive: false,
                    isReminder: false,
                  })
                }
                className="flex items-center border px-3 py-2.5 rounded-sm text-[#00BCD4] border-[#00BCD4] cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Medications
              </button>
            </div>
          </div>

          {/* ================= Medical reports ================= */}
          <div className="rounded-2xl border bg-[#F7FDFF] p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Medical Reports
            </h2>

            {medicalReportsFields.map((field, index) => (
              <div
                key={field.id}
                className="relative mt-6 rounded-xl border bg-white p-12"
              >
                {/* Remove button */}
                {medicalReportsFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicalReports(index)}
                    className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full border border-red-400 text-red-500 bg-white hover:bg-red-500 hover:text-white transition"
                  >
                    <Minus size={16} />
                  </button>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <TextInputField
                    label="Report Title"
                    placeholder="Enter report title"
                    icon="/../icons/medi-icon.svg"
                    name={`medicalReportsFields.${index}.title`}
                    register={register}
                    error={errors?.medicalReportsFields?.[index]?.title}
                    className={`py-1.5`}
                  />

                  <SelectField
                    label="Category"
                    icon="/../icons/manual-entry-icon.svg"
                    value={watch(`medicalReportsFields.${index}.documentType`)}
                    onChange={(v) =>
                      setValue(`medicalReportsFields.${index}.documentType`, v)
                    }
                    options={[
                      { label: "Lab", value: "Lab" },
                      { label: "X-Ray/CT", value: "X-Ray/CT" },
                      { label: "Administrative", value: "Administrative" },
                      {
                        label: "Discharge Summary",
                        value: "Discharge Summary",
                      },
                      {
                        label: "Medicines & Pharmacy",
                        value: "Medicines & Pharmacy",
                      },
                      { label: "Referrals", value: "Referrals" },
                      {
                        label: "Insurance & Billing",
                        value: "Insurance & Billing",
                      },
                      { label: "Other", value: "Other" },
                    ]}
                    error={errors?.medicalReportsFields?.[index]?.documentType}
                    className={`py-1.5`}
                  />

                  <TextInputField
                    label="Uploader"
                    placeholder="Uploaded by"
                    icon="/../icons/med-black-icon.svg"
                    name={`medicalReportsFields.${index}.uploadedBy`}
                    register={register}
                    error={errors?.medicalReportsFields?.[index]?.uploadedBy}
                    className={`py-1.5`}
                  />

                  <DatePickerField
                    label="Date of Report"
                    icon="/../icons/calendar-icon.svg"
                    value={watch(`medicalReportsFields.${index}.recordDate`)}
                    onChange={(v) =>
                      setValue(`medicalReportsFields.${index}.recordDate`, v, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      })
                    }
                    error={errors?.medicalReportsFields?.[index]?.recordDate}
                    className={`py-1.5`}
                  />
                </div>

                {/* Address */}
                <p className="mt-4 text-sm text-gray-500 border-b pb-1">
                  Documents
                </p>

                <div className="mt-4">
                  {/* profile photo   */}
                  <PhotoUpload
                    label="Upload Document"
                    name="document"
                    icon="/../icons/upload-icon.svg"
                    register={register}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    error={
                      errors?.medicalReportsFields?.[index]?.document?.fileUrl
                    }
                    rename={"Upload"}
                    value={watch(`medicalReportsFields.${index}.document`)}
                    onUploadingChange={setIsUploading}
                  />
                </div>
              </div>
            ))}

            {/* Add button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() =>
                  appendMedicalReports({
                    title: "",
                    documentType: "",
                    uploadedBy: "",
                    recordDate: "",
                    document: {
                      fileUrl: "",
                      s3Key: "",
                    },
                  })
                }
                className="flex items-center border px-3 py-2.5 rounded-sm text-[#00BCD4] border-[#00BCD4] cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Medical Reports
              </button>
            </div>
          </div>

          {/* ================= Insurance ================= */}
          <div className="rounded-2xl border bg-[#F7FDFF] p-6">
            <h2 className="text-lg font-semibold text-gray-900">Insurance</h2>
            <p className="mt-1 text-sm text-gray-500">Upload Document</p>

            {insuranceFields.map((field, index) => (
              <div
                key={field.id}
                className="relative mt-6 rounded-xl border bg-white p-5"
              >
                {/* Remove button */}
                {insuranceFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInsurance(index)}
                    className="absolute top-3 right-4 flex items-center justify-center w-6 h-6 rounded-full border border-red-400 text-red-500 bg-white hover:bg-red-500 hover:text-white transition"
                  >
                    <Minus size={14} />
                  </button>
                )}

                <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* front side photo   */}
                  <PhotoUpload
                    label="Front of Insurance Card"
                    name="frontImg"
                    icon="/../icons/upload-icon.svg"
                    register={register}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    error={errors?.insuranceFields?.[index]?.frontImg?.fileUrl}
                    rename={"Upload documents"}
                    value={watch(`insuranceFields.${index}.frontImg`)}
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
                    error={errors?.insuranceFields?.[index]?.backImg?.fileUrl}
                    rename={"Upload documents"}
                    value={watch(`insuranceFields.${index}.backImg`)}
                    onUploadingChange={setIsUploading}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <TextInputField
                    label="Provider Name"
                    placeholder="Enter provider name"
                    icon="/../icons/share-profile-icon.svg"
                    name={`insuranceFields.${index}.providerName`}
                    register={register}
                    error={errors?.insuranceFields?.[index]?.providerName}
                    className={`py-1.5`}
                  />

                  <TextInputField
                    label="Member ID"
                    placeholder="Enter member ID"
                    icon="/../icons/tv-icon.svg"
                    name={`insuranceFields.${index}.memberId`}
                    register={register}
                    error={errors?.insuranceFields?.[index]?.memberId}
                    className={`py-1.5`}
                  />

                  <TextInputField
                    label="Group ID"
                    placeholder="Enter group ID"
                    icon="/../icons/name-icon.svg"
                    name={`insuranceFields.${index}.groupId`}
                    register={register}
                    error={errors?.insuranceFields?.[index]?.groupId}
                    className={`py-1.5`}
                  />

                  <DatePickerField
                    label="Expiry Date"
                    icon="/../icons/calendar-icon.svg"
                    allowFuture
                    value={watch(`insuranceFields.${index}.expirationDate`)}
                    onChange={(v) =>
                      setValue(`insuranceFields.${index}.expirationDate`, v, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      })
                    }
                    error={errors?.insuranceFields?.[index]?.expirationDate}
                    className={`py-1.5`}
                  />

                  <TextInputField
                    label="Primary Insured Name"
                    placeholder="John Doe"
                    icon="/../icons/group-icon.svg"
                    name={`insuranceFields.${index}.primaryInsuredName`}
                    register={register}
                    error={errors?.insuranceFields?.[index]?.primaryInsuredName}
                    className={`py-1.5`}
                  />

                  <PhoneNumberField
                    label="Customer Service Contact"
                    icon="/../icons/call-icon.svg"
                    value={watch(
                      `insuranceFields.${index}.customerServiceContact`,
                    )}
                    error={errors.phoneNumber}
                    onChange={(v) =>
                      setValue(
                        `insuranceFields.${index}.customerServiceContact`,
                        v,
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                          shouldTouch: true,
                        },
                      )
                    }
                    className={`py-1`}
                  />
                </div>
              </div>
            ))}

            {/* Add button */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() =>
                  appendIsurance({
                    providerName: "",
                    memberId: "",
                    groupId: "",
                    primaryInsuredName: "",
                    expirationDate: "",
                    customerServiceContact: "",
                    isSecondary: false,
                    frontImg: {
                      fileUrl: "",
                      s3Key: "",
                    },
                    backImg: {
                      fileUrl: "",
                      s3Key: "",
                    },
                  })
                }
                className="flex items-center border px-3 py-2.5 rounded-sm text-[#00BCD4] border-[#00BCD4] cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Insurance
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddNewPatient;
