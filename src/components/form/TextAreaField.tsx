import { Textarea } from "@/components/ui/textarea";

type Props = {
  label: string;
  placeholder?: string;
  icon?: string;
  register: any;
  name: string;
  rows?: number;
  error?: {
    message?: string;
  };
};

const TextAreaField = ({
  label,
  placeholder,
  icon,
  register,
  name,
  rows = 4,
  error,
}: Props) => {
  return (
    <div className="flex flex-col gap-5 items-start">
      <div
        className={`flex items-start gap-3 w-full rounded-2xl px-3 py-2.5 bg-white
        ${error ? "border border-red-500" : "border border-[#ECECEC]"}`}
      >
        {icon && (
          <>
            <img src={icon} className="w-fit h-fit mt-8" />
            <div className="h-6 w-px bg-[#D9D9D9] mt-7" />
          </>
        )}

        <div className="flex flex-col w-full">
          <label className="text-xs text-[#424242] font-medium font-mona w-fit">
            {label}
          </label>

          <Textarea
            {...register(name)}
            placeholder={placeholder}
            rows={rows}
            className="border-0 shadow-none p-0 mt-1 text-[16px] resize-none focus-visible:ring-0"
          />
        </div>
      </div>

      {error?.message && (
        <p className="text-red-500 text-xs -mt-4">{String(error.message)}</p>
      )}
    </div>
  );
};

export default TextAreaField;
