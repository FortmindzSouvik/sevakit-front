import { cn } from "@/lib/utils";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type PhoneNumberFieldProps = {
  label: string;
  icon: string;
  value?: string;
  error?: { message?: string };
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

const PhoneNumberField = ({
  label,
  icon,
  value,
  error,
  onChange,
  disabled,
  className,
}: PhoneNumberFieldProps) => {
  return (
    <>
      <div
        className={cn(
          `flex items-start gap-3 w-full rounded-xl border bg-white px-3 py-2.5  ${
            error ? "border-red-500" : "border-[#ECECEC]"
          }`,
          className,
        )}
      >
        <img src={icon} className="w-4 h-4 mt-2.5" />
        <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

        <div className="flex flex-col w-full">
          <label className="text-[12px] text-[#616161] font-medium font-mona w-fit">
            {label}
          </label>

          <PhoneInput
            country="us"
            enableSearch
            value={value}
            disabled={disabled}
            countryCodeEditable={false}
            containerClass="phone-input-wrapper"
            dropdownClass="phone-dropdown"
            searchClass="phone-search"
            onChange={(raw) => {
              // Normalize to E.164 format
              const digitsOnly = `${raw}`.replace(/\D/g, "");
              const e164 = digitsOnly ? `+${digitsOnly}` : "";
              onChange(e164);
            }}
            inputStyle={{
              width: "100%",
              border: "none",
              height: "30px",
              fontSize: "16px",
              boxShadow: "none",
            }}
            buttonStyle={{
              border: "none",
              background: "transparent",
            }}
            dropdownStyle={{ borderRadius: "10px" }}
            containerStyle={{ width: "100%" }}
          />
        </div>
      </div>

      {error?.message && (
        // <p className="text-red-500 text-xs mt-1 ml-1">{error.message}</p>
        <p className="text-red-500 text-xs -mt-4 w-fit">
          {String(error.message)}
        </p>
      )}
    </>
  );
};

export default PhoneNumberField;
