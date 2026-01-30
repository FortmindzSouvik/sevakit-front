import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
// import type { FieldError } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  icon?: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder?: string;
  //   error?: FieldError;
  error?: {
    message?: string;
  };
  className?: string;
};

const SelectField = ({
  label,
  icon,
  value,
  onChange,
  options,
  placeholder,
  error,
  className,
}: Props) => {
  return (
    <div className="flex flex-col gap-5 items-start">
      <div
        className={cn(
          `flex items-start gap-3 w-full rounded-2xl px-3 py-2.5  bg-white
        ${error ? "border border-red-500" : "border border-[#ECECEC]"}`,
          className,
        )}
      >
        {icon && (
          <>
            <img src={icon} className="w-fit h-fit mt-2.5 " />
            <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />
          </>
        )}

        <div className="flex flex-col w-full">
          <label className="text-xs text-[#424242] font-medium font-mona w-fit">
            {label}
          </label>

          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="border-0 shadow-none p-0 mt-0.5 text-sm focus:ring-0">
              <SelectValue placeholder={placeholder || "Select"} />
            </SelectTrigger>

            <SelectContent className="rounded-xl">
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error?.message && (
        <p className="text-red-500 text-xs -mt-4">{String(error.message)}</p>
      )}
    </div>
  );
};

export default SelectField;
