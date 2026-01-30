import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  error?: {
    message?: string;
  };
  className?: string;
};

const SwitchField = ({ label, value, onChange, error, className }: Props) => {
  return (
    <div className="flex flex-col gap-1">
      {/* Box */}
      <div
        className={cn(
          `flex flex-col items-center justify-center gap-2 rounded-2xl py-4 border
          ${error ? "border-red-500" : "border-[#ECECEC]"}`,
          className,
        )}
      >
        <p className="text-sm text-[#424242] font-medium">{label}</p>

        <div className="flex items-center gap-3 text-sm font-medium font-mona">
          <span>No</span>

          <Switch
            checked={value}
            onCheckedChange={onChange}
            className="data-[state=checked]:bg-[#00C5D7] data-[state=unchecked]:bg-gray-300 w-11.5 h-5"
          />

          <span>Yes</span>
        </div>
      </div>

      {error?.message && (
        <p className="text-red-500 text-xs ml-2">Required field</p>
      )}
    </div>
  );
};

export default SwitchField;
