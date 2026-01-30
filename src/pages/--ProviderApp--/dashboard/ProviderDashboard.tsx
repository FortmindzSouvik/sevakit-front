import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppSelector } from "@/redux/store";
import { ROUTES } from "@/utils/routeConstants";
import { useState } from "react";
import { useNavigate } from "react-router";
import ProviderPatientDashboardStats from "./component/ProviderPatientDashboardStats";
import ProviderActivePatientDashboardTable from "./component/ProviderActivePatientDashboardTable";
import ProviderTaskCategoryDashboardStats from "./component/ProviderTaskCategoryDashboardStats";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [selectedDays, setSelectedDays] = useState("7");
  const { providerData } = useAppSelector((state) => state?.provider);
  const fullName =
    providerData?.firstName || providerData?.lastName
      ? `${providerData?.firstName ?? ""} ${providerData?.lastName ?? ""}`.trim()
      : "NA";

  return (
    <>
      {/* Welcome */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-semibold">
          Welcome, <span className="font-bold">{fullName}</span>
        </h2>

        <div className="flex gap-3">
          <Select
            value={selectedDays}
            onValueChange={(value) => setSelectedDays(value)}
          >
            <SelectTrigger className="h-10 w-[150px] border rounded-lg px-3 text-[16px] text-[#616161] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 font-mona">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>

            <SelectContent className="rounded-xl">
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <button
            className="bg-[#00BCD4] text-black px-4 py-2 rounded-lg cursor-pointer"
            onClick={() =>
              navigate(
                `/${ROUTES.role.provider}/${ROUTES.provider.patients}/${ROUTES.provider.addPatient}`,
              )
            }
          >
            + Add New Patient
          </button>
        </div>
      </div>

      {/* Stats */}

      <ProviderPatientDashboardStats selectedDays={selectedDays} />

      {/* Tables & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Active Patients */}
        <ProviderActivePatientDashboardTable selectedDays={selectedDays} />

        {/* Tasks */}
        <ProviderTaskCategoryDashboardStats selectedDays={selectedDays} />
      </div>
    </>
  );
};

export default ProviderDashboard;
