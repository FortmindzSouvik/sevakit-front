import { ROUTES } from "@/utils/routeConstants";
import { useNavigate } from "react-router";

const SymptomsCard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#FEFAFB] rounded-3xl shadow-md p-4 space-y-3 font-mona">
      <div className="flex items-center space-x-2">
        <img
          src="/../icons/symptom-icon.svg"
          alt="symptom-icon"
          className="w-fit h-fit"
        />
        <div>
          <p className="font-semibold  text-[#000000]">Symptoms</p>
          <p className="text-sm font-normal text-[#000000] -mt-1">
            Log and track your symptoms.
          </p>
        </div>
      </div>

      {/* symctom 1 */}

      {/* <div className="bg-[#FFE8F0] p-3 rounded-2xl flex justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-[#000000]">
            Atorvastatin 10mg
          </p>
          <p className="text-xs text-[#000000]">Nov 22, 2025</p>
        </div>
        <div className="mt-3">
          <p className="text-right text-xs font-medium text-[#E75686] ">
            Once Daily
          </p>
        </div>
      </div> */}

      {/* symctom 2 */}

      {/* <div className="bg-[#FFE8F0] p-3 rounded-2xl flex justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-[#000000]">Metformin 500mg</p>
          <p className="text-xs text-[#000000]">Jan 01, 2024 - Mar 15, 2024</p>
        </div>
        <div className="mt-3">
          <p className="text-right text-xs font-medium text-[#E75686] ">
            Twice Daily
          </p>
        </div>
      </div> */}

      <button
        className="w-full mt-3 bg-[#F7B5CA] text-[#000000] text-sm font-medium py-3 rounded-2xl flex items-center justify-center space-x-1 cursor-pointer"
        onClick={() =>
          navigate(`/${ROUTES.role.patient}/${ROUTES.patient.symptoms}`)
        }
      >
        <span>Open the Symptoms Screen</span>
        <img
          src="/../icons/arrow-black-icon.svg"
          alt="back-icon"
          className="w-3 h-3"
        />
      </button>
    </div>
  );
};

export default SymptomsCard;
