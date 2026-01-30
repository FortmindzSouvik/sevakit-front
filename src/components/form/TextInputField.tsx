import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
// import type { FieldError } from "react-hook-form";

type Props = {
  label: string;
  placeholder?: string;
  icon?: string;
  register: any;
  name: string;
  //   error?: FieldError;
  error?: {
    message?: string;
  };
  disabled?: boolean;
  className?: string;
};

const TextInputField = ({
  label,
  placeholder,
  icon,
  register,
  name,
  error,
  disabled,
  className,
}: Props) => {
  return (
    <div className="flex flex-col gap-5 items-start">
      <div
        className={cn(
          `flex items-start gap-3 w-full rounded-2xl px-3 py-2.5 bg-white
        ${error ? "border border-red-500" : "border border-[#ECECEC]"}`,
          className,
        )}
      >
        {icon && (
          <>
            <img src={icon} className="w-fit h-fit mt-2.5" />
            <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />
          </>
        )}

        <div className="flex flex-col w-full">
          <label className="text-xs text-[#424242] font-medium font-mona w-fit">
            {label}
          </label>

          <Input
            {...register(name)}
            placeholder={placeholder}
            disabled={disabled}
            // className={`border-0 shadow-none p-0 mt-0.5 h-5 text-[14px] focus-visible:ring-0  `}
            className="border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] focus-visible:ring-0 
             disabled:opacity-100 disabled:text-black disabled:bg-transparent
             disabled:[-webkit-text-fill-color:black]"
          />
        </div>
      </div>

      {error?.message && (
        <p className="text-red-500 text-xs -mt-4">{String(error.message)}</p>
      )}
    </div>
  );
};

export default TextInputField;
