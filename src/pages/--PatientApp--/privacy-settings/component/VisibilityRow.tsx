import { Switch } from "@/components/ui/switch";

const VisibilityRow = ({
  title,
  desc,
  value,
  onChange,
}: {
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-between gap-4">
      {/* Left */}
      <div>
        <p className="text-sm font-semibold text-black">{title}</p>
        <p className="text-sm text-[#616161] mt-1">{desc}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border
            ${
              value
                ? "bg-[#E6FBFF] text-[#00AFC1] border-[#00AFC1]"
                : "bg-white text-[#9E9E9E] border-[#BDBDBD]"
            }`}
        >
          {value ? "Visible" : "Hide"}
        </span>

        <Switch
          checked={value}
          onCheckedChange={onChange}
          className="w-12 h-6 data-[state=checked]:bg-[#00C5D7] data-[state=unchecked]:bg-gray-300"
        />
      </div>
    </div>
  );
};

export default VisibilityRow;
