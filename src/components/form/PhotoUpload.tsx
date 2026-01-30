import { useEffect, useRef, useState } from "react";
import type {
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  // UseFormSetError,
} from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { toast } from "sonner";

type PhotoValue = {
  fileUrl?: string;
  fileName?: string;
  s3Key?: string;
};

type PhotoUploadProps = {
  label: string;
  name: string;
  icon: string;
  register: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  clearErrors?: UseFormClearErrors<any>;
  // setError?: UseFormSetError<any>;
  error?: { message?: string };
  value?: PhotoValue;
  rename?: string;
  onUploadingChange?: (uploading: boolean) => void;
};

const PhotoUpload = ({
  label,
  name,
  icon,
  register,
  setValue,
  clearErrors,
  // setError,
  error,
  value,
  rename = "Change",
  onUploadingChange,
}: PhotoUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string | null>(value?.fileUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "pdf" | null>(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const { mutateAsync: uploadFile, isPending } = useFileUpload([
    "upload-document",
  ]);
 

  useEffect(() => {
    if (value?.fileUrl) {
      setPreview(value?.fileUrl);
      setFileType(
        value.fileUrl.toLowerCase().endsWith(".pdf") ? "pdf" : "image"
      );
      setFileName(value.fileUrl.split("/").pop() || "Uploaded file");
    } else {
      setPreview(null);
      setFileType(null);
      setFileName(null);
    }
  }, [value]);
  

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    setFileType(null);
    setValue?.(
      name,
      {
        fileUrl: "",
        fileName: "",
        s3Key: "",
      },
      { shouldValidate: true }
    );
  };

  const handleUpload = async (file: File) => {
    onUploadingChange?.(true);
    setFileType(file.type === "application/pdf" ? "pdf" : "image");

    try {
      const res = await uploadFile({
        path: apiRoutes.uploadUrl,
        file,
      });

      const uploadedUrl = res?.data?.url;
      const uploadedKey = res?.data?.key;
      const uploadedName = res?.data?.originalName;
      setFileName(res?.data?.originalName);
      setPreview(uploadedUrl);
      setValue?.(
        name,
        {
          fileUrl: uploadedUrl,
          fileName: uploadedName,
          s3Key: uploadedKey,
        },
        { shouldValidate: true }
      );
      clearErrors?.(name);
    } catch (err) {
      console.error(err);
    } finally {
      onUploadingChange?.(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl font-mona">
      <div className="bg-white p-2 rounded-xl flex items-center gap-3">
        {/* Preview */}
        {preview && (
          <div className="bg-[#F7FDFF] w-1/2 rounded-xl flex items-center gap-2 p-2">
            {fileType === "image" && (
              <img
                src={preview}
                alt="preview"
                className="w-16 h-16 object-cover rounded-lg border"
              />
            )}

            {fileType === "pdf" && (
              <div className="w-18 h-24 shrink-0 overflow-hidden rounded-lg border bg-white">
                <iframe
                  src={`${preview}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full scale-[1.2] origin-top-left pointer-events-none"
                  style={{ border: "none" }}
                />
              </div>
            )}

            <div className="flex-1 flex flex-col items-center p-2">
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-500 text-xs font-medium cursor-pointer"
              >
                Remove
              </button>

              {fileName && (
                <p className="text-xs w-24 truncate text-center">{fileName}</p>
              )}
              {fileType === "pdf" && (
                <a
                  href={preview}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#00BCD4] mt-1"
                >
                  View PDF
                </a>
              )}
            </div>
          </div>
        )}

        {/* Upload Box */}
        <div
          onClick={() => inputRef.current?.click()}
          className={`border flex gap-4 items-center border-dashed p-2 rounded-2xl cursor-pointer
            ${preview ? "w-1/2" : "w-full"}
            ${
              error
                ? "border-red-500"
                : "border-[#D9D9D9] hover:border-[#00BCD4]"
            }`}
        >
          <div className="flex border-r pr-3 pl-1 border-[#AFAFAF]">
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <img src={icon} />
            )}
          </div>

          <div className="flex flex-col">
            <p className="text-xs text-[#616161] w-fit">
              {preview ? rename : label}
            </p>
            <p className="text-xs text-[#9E9E9E] w-fit">
              {preview ? "Change" : "Choose File (JPG/PNG/PDF)"}
            </p>
          </div>
        </div>
      </div>

      {/* Hidden input */}
      <input
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        {...register(name)}
        ref={(el) => {
          register(name).ref(el);
          inputRef.current = el;
        }}
        onChange={(e: any) => {
          const file = e.target.files?.[0];
          if (!file) return;

          //  FILE SIZE VALIDATION
          if (file.size > MAX_FILE_SIZE) {
            setValue?.(name, "", { shouldValidate: true });
            toast.error("File size must be less than 10 MB");
            return;
          }

          clearErrors?.(name);
          handleUpload(file);
        }}
      />

      {error?.message && (
        <p className="text-red-500 text-xs mt-1 ml-1 w-fit">{error.message}</p>
      )}
    </div>
  );
};

export default PhotoUpload;
