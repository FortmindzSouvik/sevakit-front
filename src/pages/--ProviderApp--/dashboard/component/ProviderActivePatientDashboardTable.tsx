import { useFetchData } from "@/hooks/useFetchData";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";

const ProviderActivePatientDashboardTable = ({
  selectedDays,
}: {
  selectedDays: string;
}) => {
  const {
    data: dashboardActivePatientDetails,
    isFetching: isFetchingDashboardActivePatinetDetails,
  } = useFetchData(
    apiRoutes.getDashboardActivePatientDetails(selectedDays),
    ["get-dashboard-active-table", selectedDays],
    !!selectedDays,
  );

  const patients = dashboardActivePatientDetails?.data ?? [];

  return (
    <div className="flex flex-col mt-4">
      <h3 className="font-medium text-lg mb-3">Most Active Patients</h3>
      <p className="text-[14px] text-[#4A4A4A] font-normal -mt-2 mb-2">
        Patients with most logins in selected period
      </p>

      <div className="bg-white p-4 min-h-[420px] flex flex-col overflow-y-auto flex-1 relative rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-[#F8FDFF] sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left border">Rank</th>
              <th className="px-4 py-3 text-left border">Patient Name</th>
              <th className="px-4 py-3 text-left border">Phone</th>
              <th className="px-4 py-3 text-right border">Logins</th>
            </tr>
          </thead>

          <tbody>
            {isFetchingDashboardActivePatinetDetails &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-4 py-3 border">
                    <div className="h-4 w-6 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-3 border">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-3 border">
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-3 border text-right">
                    <div className="h-4 w-10 bg-gray-200 rounded ml-auto" />
                  </td>
                </tr>
              ))}

            {!isFetchingDashboardActivePatinetDetails &&
              patients.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-10 text-gray-500 border"
                  >
                    No data to show
                  </td>
                </tr>
              )}

            {!isFetchingDashboardActivePatinetDetails &&
              patients.length > 0 &&
              patients.slice(0,10).map((patient: any, i: number) => (
                <tr key={i}>
                  <td className="px-4 py-3 border">{i + 1}</td>
                  <td className="px-4 py-3 border">{patient?.name}</td>
                  <td className="px-4 py-3 border">{patient?.phone}</td>
                  <td className="px-4 py-3 text-right border">
                    {patient?.loginCount}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProviderActivePatientDashboardTable;
