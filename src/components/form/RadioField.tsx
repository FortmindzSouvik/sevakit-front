import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type RadioOption = {
  label: string;
  value: string;
};

type RadioFieldProps = {
  value?: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  className?: string;
};

export default function RadioField({
  value,
  onChange,
  options,
  className,
}: RadioFieldProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className={cn("space-y-4", className)}
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-2">
          <RadioGroupItem value={option.value} id={option.value} />
          <Label
            htmlFor={option.value}
            className="text-sm font-medium text-[#4A4A4A] cursor-pointer"
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
