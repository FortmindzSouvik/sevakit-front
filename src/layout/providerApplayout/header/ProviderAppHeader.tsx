import { Menu, Search } from "lucide-react";
import { useState } from "react";
import SearchPatientModal from "./component/SearchPatientModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/redux/store";
import { useNavigate } from "react-router";
import { ROUTES } from "@/utils/routeConstants";
import { clearProviderData } from "@/redux/slices/providerSlice";

const ProviderAppHeader = ({
  onMenuClick,
  title,
}: {
  onMenuClick: () => void;
  title: string;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openSearch, setOpenSearch] = useState(false);
  const getHeaderTitle = (tab: string) => {
    switch (tab) {
      case "dashboard":
        return "Dashboard";
      case "patients":
        return "Patients";
      case "analytics":
        return "Analytics";
      case "help":
        return "Help & Support";
      case "settings":
        return "Settings";
      default:
        return "";
    }
  };

  const handleLogout = () => {
    dispatch(clearProviderData());
    navigate(`/${ROUTES.auth.login}`);
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 border-b">
      <div className="flex items-center gap-3">
        <button className="md:hidden" onClick={onMenuClick}>
          <Menu />
        </button>
        <h1 className="text-lg font-semibold">{getHeaderTitle(title)}</h1>
      </div>

      <div className="flex-1 min-w-0 mx-2 sm:mx-4 max-w-xs sm:max-w-md lg:max-w-lg">
        <div className="relative bg-[#F7FDFF] rounded-lg">
          <Search
            className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-[#666]"
            size={14}
          />
          <input
            placeholder="Search Patient"
            className="pl-8 pr-3 py-1.5 sm:pl-10 sm:pr-4 sm:py-2 w-full rounded-lg border border-[#B9F2F8]  focus:outline-none focus:ring-1 sm:focus:ring-2 focus:ring-[#B9F2F8] focus:border-[#00BCD4] bg-transparent text-xs sm:text-sm cursor-pointer font-mona"
            onClick={() => setOpenSearch(true)}
            readOnly
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <img
          src="/../icons/bell-icon.svg"
          className="w-fit h-fit cursor-pointer"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <img
              src="https://i.pravatar.cc/40"
              className="w-9 h-9 rounded-full border cursor-pointer"
              alt="profile"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {/* <DropdownMenuLabel>Logout</DropdownMenuLabel> */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer"
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <SearchPatientModal open={openSearch} onOpenChange={setOpenSearch} />
    </header>
  );
};

export default ProviderAppHeader;
