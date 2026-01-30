import { clearUserData } from "@/redux/slices/userSlice";
import { useAppDispatch } from "@/redux/store";
import { ROUTES } from "@/utils/routeConstants";
import { Link, useNavigate } from "react-router";

const PatientAppHeader = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(clearUserData());
    navigate(`/${ROUTES.auth.login}`);
  };
  return (
    <div className="w-full bg-[#FFFFFF]  flex justify-between items-center p-3 md:px-24 shadow-sm border-b pb-4 sticky top-0 z-10">
      <div className="flex w-full justify-between">
        {/* Left Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <img
            src="/../icons/kit-logo-icon.svg"
            alt="logo"
            className="w-fit h-fit object-contain"
          />
        </Link>

        {/* Right Profile Icon */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer">
          <img
            src="/../icons/logout-icon.svg"
            alt="logout"
            className="text-black"
            onClick={() => handleLogout()}
          />
        </button>
      </div>
    </div>
  );
};

export default PatientAppHeader;
