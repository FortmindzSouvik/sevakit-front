import { useEffect, useRef, useState } from "react";
import type {
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { toast } from "sonner";

type UploadedFile = {
  fileName: string;
  url: string;
  type: "image" | "pdf";
};

type Props = {
  label: string;
  name: string;
  icon: string;
  register: UseFormRegister<any>;
  setValue?: UseFormSetValue<any>;
  clearErrors?: UseFormClearErrors<any>;
  error?: { message?: string };
  value?: UploadedFile[];
  onUploadingChange?: (uploading: boolean) => void;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const MultiPhotoUpload = ({
  label,
  name,
  icon,
  register,
  setValue,
  clearErrors,
  error,
  value = [],
  onUploadingChange,
}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<UploadedFile[]>(value);
  const { mutateAsync: uploadFile, isPending } = useFileUpload([
    "upload-document",
  ]);

  const getFileType = (fileName: string, url: string): "image" | "pdf" => {
    if (fileName?.toLowerCase().endsWith(".pdf")) return "pdf";
    if (url?.toLowerCase().includes(".pdf")) return "pdf";
    return "image";
  };

  /* ---------------- Sync edit data ---------------- */
  useEffect(() => {
    if (!value || value.length === 0) {
      setFiles([]);
      return;
    }

    const normalizedFiles: UploadedFile[] = value.map((file) => ({
      fileName: file.fileName,
      url: file.url,
      type: file.type || getFileType(file.fileName, file.url),
    }));

    setFiles(normalizedFiles);
  }, [value]);

  /* ---------------- Remove file ---------------- */
  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    setValue?.(name, updated, { shouldValidate: true });
  };

  /* ---------------- Upload handler ---------------- */
  const handleUpload = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 10 MB");
      return;
    }
    onUploadingChange?.(true);
    const type: "image" | "pdf" =
      file.type === "application/pdf" ? "pdf" : "image";

    try {
      const res = await uploadFile({
        path: apiRoutes.uploadUrl,
        file,
      });

      const newFile: UploadedFile = {
        fileName: res?.data?.originalName || file.name,
        url: res?.data?.url,
        type,
      };

      const updated = [...files, newFile];

      setFiles(updated);
      setValue?.(name, updated, { shouldValidate: true });
      clearErrors?.(name);
    } catch {
      toast.error("File upload failed");
    } finally {
      onUploadingChange?.(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl font-mona space-y-2">
      {/* ---------------- Preview Grid ---------------- */}
      {files.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {files.map((file, index) => (
            <div
              key={index}
              className=" bg-[#F7FDFF] rounded-xl p-2 border flex flex-col items-center"
            >
              {/* Image */}
              {file.type === "image" && (
                <img
                  src={file.url}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-md"
                />
              )}

              {/* PDF */}
              {file.type === "pdf" && (
                <iframe
                  src={`${file.url}#toolbar=0`}
                  className="w-full h-24 rounded-md pointer-events-none"
                />
              )}

              <p className="text-xs mt-2 truncate text-center w-full">
                {file.fileName}
              </p>

              {file.type === "pdf" && (
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#00BCD4] mt-1"
                >
                  View PDF
                </a>
              )}
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="mt-1 text-xs text-red-500 font-medium cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- Upload Box ---------------- */}
      <div
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed rounded-xl p-3 cursor-pointer flex items-center gap-3
          ${
            error ? "border-red-500" : "border-[#D9D9D9] hover:border-[#00BCD4]"
          }`}
      >
        {isPending ? (
          <Loader2 className="animate-spin w-4 h-4" />
        ) : (
          <img src={icon} />
        )}

        <div>
          <p className="text-xs text-[#616161] w-fit">{label}</p>
          <p className="text-xs text-[#9E9E9E] w-fit">
            Upload JPG / PNG / PDF (Multiple)
          </p>
        </div>
      </div>

      {/* ---------------- Hidden input ---------------- */}
      <input
        type="file"
        multiple
        accept="image/*,application/pdf"
        className="hidden"
        {...register(name)}
        ref={(el) => {
          register(name).ref(el);
          inputRef.current = el;
        }}
        onChange={(e: any) => {
          const selectedFiles = Array.from(e.target.files || []) as File[];
          selectedFiles.forEach((file) => {
            handleUpload(file);
          });
          e.target.value = "";
        }}
      />

      {error?.message && (
        <p className="text-red-500 text-xs w-fit">{error.message}</p>
      )}
    </div>
  );
};

export default MultiPhotoUpload;
