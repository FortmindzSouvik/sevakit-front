import { ROUTES } from "@/utils/routeConstants";
import { useNavigate } from "react-router";

const MedicationCard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#F7FDFF] rounded-3xl shadow-md p-4 space-y-3 font-mona">
      <div className="flex items-center space-x-2">
        <img
          src="/../icons/doctor-icon.svg"
          alt="doctor-icon"
          className="w-fit h-fit"
        />
        <div>
          <p className="font-semibold  text-[#000000]">Medications</p>
          <p className="text-sm font-normal text-[#000000] -mt-1">
            Manage your current medications.
          </p>
        </div>
      </div>

      {/* Medication 1 */}

      {/* <div className="bg-[#F4F9FF] p-3 rounded-2xl flex justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-[#000000]">
            Atorvastatin 10mg
          </p>
          <p className="text-xs text-[#000000]">Nov 22, 2025</p>
        </div>
        <div className="mt-3">
          <p className="text-right text-xs font-medium text-[#009FB6] ">
            Once Daily
          </p>
        </div>
      </div> */}

      {/* Medication 2 */}

      {/* <div className="bg-[#F4F9FF] p-3 rounded-2xl flex justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-[#000000]">Metformin 500mg</p>
          <p className="text-xs text-[#000000]">Jan 01, 2024 - Mar 15, 2024</p>
        </div>
        <div className="mt-3">
          <p className="text-right text-xs font-medium text-[#009FB6] ">
            Twice Daily
          </p>
        </div>
      </div> */}

      <button
        className="w-full mt-3 bg-[#B9F2F8] text-[#000000] text-sm font-medium py-3 rounded-2xl flex items-center justify-center space-x-1 cursor-pointer"
        onClick={() =>
          navigate(`/${ROUTES.role.patient}/${ROUTES.patient.medications}`)
        }
      >
        <span>Open the Medications Screen</span>
        <img
          src="/../icons/arrow-black-icon.svg"
          alt="back-icon"
          className="w-fit h-fit"
        />
      </button>
    </div>
  );
};

export default MedicationCard;
