import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";

type Props = {
  label: string;
  icon: string;
  value?: string;
  onChange: (value: string) => void;
  error?: {
    message?: string;
  };
  placeholder?: string;
  allowFuture?: boolean;
  className?: string;
};

const DatePickerField = ({
  label,
  icon,
  value,
  onChange,
  error,
  placeholder = "MM-DD-YYYY",
  allowFuture = false,
  className,
}: Props) => {
  const [open, setOpen] = useState(false);

  const today = new Date();

  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 120);

  // fromYear / toYear
  const startMonth = new Date(today.getFullYear() - 120, 0);
  // new Date(year, monthIndex);
  const endMonth = allowFuture
    ? new Date(today.getFullYear() + 7, 11)
    : new Date(today.getFullYear(), today.getMonth());

  return (
    <div className="flex flex-col gap-5 items-start bg-white">
      <div
        className={cn(
          `flex items-start gap-3 w-full rounded-2xl border px-3 py-2.5 ${
            error ? "border-red-500" : "border-[#ECECEC]"
          }`,
          className,
        )}
      >
        <img src={icon} className="w-4 h-4 mt-2.5" />

        <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

        <div className="flex flex-col w-full">
          <label className="text-xs text-[#424242] font-medium font-mona w-fit">
            {label}
          </label>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="text-left border-0 shadow-none p-0 mt-0.5 h-5 text-[16px] w-full focus-visible:ring-0 font-mona text-[#616161]"
              >
                {value ? format(new Date(value), "MM-dd-yyyy") : placeholder}
              </button>
            </PopoverTrigger>

            <PopoverContent className="p-0" align="start">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                startMonth={startMonth}
                endMonth={endMonth}
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => {
                  if (!date) return;

                  if (date < minDate) return;
                  if (!allowFuture && date > today) return;

                  onChange(date.toISOString());
                  setOpen(false);
                }}
                disabled={(date) => {
                  if (date < minDate) return true;
                  if (!allowFuture && date > today) return true;
                  return false;
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {error?.message && (
        <p className="text-red-500 text-xs -mt-4">{String(error.message)}</p>
      )}
    </div>
  );
};

export default DatePickerField;
