import { useNavigate } from "react-router";

interface MedicalAccountPrivacyProps {
  title: string;
  des: string;
  icon: string;
  navigateTo?: string;
}

const MedicalAccountPrivacyComponent = ({
  title,
  des,
  icon,
  navigateTo,
}: MedicalAccountPrivacyProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigateTo && navigate(navigateTo)}
      className="bg-[#E8F9FF] rounded-3xl shadow-md p-3 font-mona cursor-pointer transition-all hover:shadow-lg active:scale-[0.98]"
    >
      <div className="flex items-center space-x-3">
        <img src={icon} className="w-fit h-fit" alt={title} />

        <div>
          <p className="font-semibold text-[16px] text-black">{title}</p>
          <p className="text-sm text-[#444444] -mt-1">{des}</p>
        </div>
      </div>
    </div>
  );
};

export default MedicalAccountPrivacyComponent;
