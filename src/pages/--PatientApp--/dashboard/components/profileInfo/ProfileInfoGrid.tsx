import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";

const items = [
  {
    key: "personal",
    label: "Personal Info",
    icon: "/../icons/personal-info-icon.svg",
    path: "/patient/personal-information",
  },
  {
    key: "allergies",
    label: "Allergies",
    icon: "/../icons/allergies-icon.svg",
    path: "/patient/allergies",
  },
  {
    key: "insurance",
    label: "Insurance",
    icon: "/../icons/insurence-icon.svg",
    path: "/patient/insurance",
  },
  {
    key: "emergency",
    label: "Emergency Contact",
    icon: "/../icons/emergency-icon.svg",
    path: "/patient/emergency-contact",
  },
  {
    key: "advance",
    label: "Advance Care Plan",
    icon: "/../icons/advance-plan-icon.svg",
    path: "/patient/advance-plan",
  },
  {
    key: "living",
    label: "Living Will",
    icon: "/../icons/living-will-icon.svg",
    path: "/patient/living-will",
  },
  {
    key: "power",
    label: "Power of Attorney",
    icon: "/../icons/power-atony-icon.svg",
    path: "/patient/power-of-attorney",
  },
  {
    key: "pharmacy",
    label: "Pharmacy",
    icon: "/../icons/pharmacy-icon.svg",
    path: "/patient/pharmacy",
  },
  {
    key: "primary",
    label: "Care Providers",
    icon: "/../icons/prime-care-icon.svg",
    path: "/patient/primary-care-provider",
  },
  {
    key: "caregivers",
    label: "Caregivers",
    icon: "/../icons/care-giver-icon.svg",
    path: "/patient/caregiver",
  },
  {
    key: "license",
    label: "Driver’s License",
    icon: "/../icons/license-icon.svg",
    path: "/patient/driver-license",
  },
];

export default function ProfileInfoGrid() {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const visibleItems = expanded ? items : items.slice(0, 3);
  const handleNavigation = (item: any) => {
    if (item.path) {
      navigate(item.path);
    }
  };
  return (
    <Card className="bg-[#F7FDFF] rounded-3xl p-6 shadow-md w-full space-y-3">
      <div className="grid grid-cols-3 gap-3 mb-4 ">
        {visibleItems.map((item) => (
          <div
            key={item.key}
            className="flex flex-col items-center justify-center bg-[#FFFFFF] rounded-3xl py-5 cursor-pointer shadow-sm hover:shadow-md transition-all "
            onClick={() => handleNavigation(item)}
          >
            {/* ICON */}
            <div className="w-15 h-15  rounded-full flex items-center justify-center mb-2">
              <img src={item.icon} className="w-12 h-12" alt={item.key} />
            </div>

            {/* LABEL */}
            <p className="text-sm text-[#000000] font-mona font-medium text-center">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* SEE MORE BUTTON */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-3 bg-[#00BCD4] rounded-2xl text-white font-mona font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer"
      >
        {expanded ? "See Less" : "See More"}
        <img
          src="/../icons/drop-dwn-icon.svg"
          className={`w-fit h-fit transition-transform ${
            expanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
    </Card>
  );
}
