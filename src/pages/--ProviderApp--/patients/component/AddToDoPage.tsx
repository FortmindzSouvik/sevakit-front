import PhotoUpload from "@/components/form/PhotoUpload";
import SelectField from "@/components/form/SelectField";
import TextInputField from "@/components/form/TextInputField";
import { ROUTES } from "@/utils/routeConstants";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const AddToDoPage = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  console.log("isUploading", isUploading);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      document: {
        fileUrl: "",
        s3Key: "",
      },
      category: "",
      description: "",
    },
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
            Create To-do
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8">
          {/* ================= Create todo ================= */}
          <div className="rounded-2xl border bg-[#F7FDFF] p-6">
            <h2 className="text-lg font-semibold text-gray-900">Create Todo</h2>

            {/* Form fields */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectField
                key={watch("category") || "category"}
                label="Category"
                icon="/../icons/tv-icon.svg"
                value={watch("category")}
                onChange={(v) =>
                  setValue("category", v, {
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
                error={errors.category}
                className={`py-1.5`}
              />

              <PhotoUpload
                label="Upload File"
                name="document"
                icon="/../icons/upload-icon.svg"
                register={register}
                setValue={setValue}
                clearErrors={clearErrors}
                error={errors.document?.fileUrl}
                rename={"Upload File"}
                value={watch("document")}
                onUploadingChange={setIsUploading}
              />
            </div>

            <div className="mt-4">
              <TextInputField
                label="Description"
                placeholder="Enter description"
                icon="/../icons/name-icon.svg"
                name="description"
                register={register}
                error={errors.description}
                className={`py-1.5`}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddToDoPage;
