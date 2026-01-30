import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DocumentUploadProps {
  label: string;
  file: File | null;
  preview: string | null;
  onChange: (file: File | null) => void;
  onPreviewChange: (url: string | null) => void;
  rename?: string;
  isUploading?: boolean;
}

const DocumentUpload = ({
  label,
  file,
  preview,
  onChange,
  onPreviewChange,
  rename = "Change",
  isUploading,
}: DocumentUploadProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileType, setFileType] = useState<"image" | "pdf" | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    onChange(selected);
    onPreviewChange(URL.createObjectURL(selected));

    if (selected.type === "application/pdf") {
      setFileType("pdf");
    } else if (selected.type.startsWith("image/")) {
      setFileType("image");
    }
  };

  const handleRemove = () => {
    onChange(null);
    onPreviewChange(null);
    setFileType(null);
  };

  // cleanup preview url
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="bg-white p-2 rounded-xl flex items-center gap-3">
      {/* Preview */}
      {file && preview && (
        <div className="bg-[#F7FDFF] w-1/2 rounded-xl flex items-center gap-2 p-2">
          {/* Image Preview */}
          {fileType === "image" && (
            <img
              src={preview}
              className="w-16 h-16 object-cover rounded-lg border"
              alt="preview"
            />
          )}

          {/* PDF Preview */}

          {fileType === "pdf" && (
            <div className="w-18 h-24 shrink-0 overflow-hidden rounded-lg border bg-white">
              <iframe
                src={`${preview}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full scale-[1.2] origin-top-left pointer-events-none"
                style={{ border: "none" }}
              />
            </div>
          )}

          <div className="flex-1 flex flex-col items-center ">
            <button
              type="button"
              className="text-red-500 text-xs font-medium cursor-pointer"
              onClick={handleRemove}
            >
              Remove
            </button>

            <p className="text-xs w-26 font-medium truncate text-center">
              {file.name}
            </p>

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

      {/* Upload / Change */}
      <div
        onClick={() => inputRef.current?.click()}
        className={`border flex gap-4 items-center border-dashed p-2 border-[#AFAFAF] rounded-2xl cursor-pointer ${
          file ? "w-1/2" : "w-full"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex border-r pr-3 pl-1 border-[#AFAFAF]">
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <img src="/../icons/upload-icon.svg" />
          )}
        </div>

        <div className="flex flex-col">
          <div className="text-sm text-[#616161]">{file ? rename : label}</div>
          <div className="text-[#9E9E9E]">
            {file ? "Change" : "Choose File (PDF/JPG/PNG)"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
