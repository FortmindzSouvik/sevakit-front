import { useFetchData } from "@/hooks/useFetchData";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";

const ProviderPatientDashboardStats = ({
  selectedDays,
}: {
  selectedDays: string;
}) => {
  const { data: dashboardCount, isFetching: isFetchingDashboardCount } =
    useFetchData(
      apiRoutes.getDashboardCount(selectedDays),
      ["get-dashboard-count", selectedDays],
      !!selectedDays,
    );

    return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Patients */}
      <div className="bg-white rounded-xl p-5 border">
        <p className="text-sm text-gray-500">Total Patients</p>

        {isFetchingDashboardCount ? (
          <div className="mt-2 space-y-2 animate-pulse">
            <div className="h-8 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        ) : (
          <>
            <h3 className="text-3xl font-semibold mt-1">
              {dashboardCount?.data?.totalRegisteredPatients}
            </h3>
            <p className="text-sm text-green-600 mt-1">
              All registered patients
            </p>
          </>
        )}
      </div>

      {/* New Today */}
      <div className="bg-white rounded-xl p-5 border">
        <p className="text-sm text-gray-500">New Today</p>

        {isFetchingDashboardCount ? (
          <div className="mt-2 space-y-2 animate-pulse">
            <div className="h-8 w-14 bg-gray-200 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
        ) : (
          <>
            <h3 className="text-3xl font-semibold mt-1">
              {dashboardCount?.data?.newToday}
            </h3>
            <p className="text-sm text-green-600 mt-1">
              Yesterday: {dashboardCount?.data?.yesterday}
            </p>
          </>
        )}
      </div>

      {/* Active Patients */}
      <div className="bg-white rounded-xl p-5 border">
        <p className="text-sm text-gray-500">Active Patients</p>

        {isFetchingDashboardCount ? (
          <div className="mt-2 space-y-2 animate-pulse">
            <div className="h-8 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-36 bg-gray-200 rounded" />
          </div>
        ) : (
          <>
            <h3 className="text-3xl font-semibold mt-1">
              {dashboardCount?.data?.activePatients}
            </h3>
            <p className="text-sm text-green-600 mt-1">
              In last {selectedDays} days
            </p>
          </>
        )}
      </div>

      {/* Pending Tasks */}
      <div className="bg-white rounded-xl p-5 border">
        <p className="text-sm text-gray-500">Pending Tasks</p>

        {isFetchingDashboardCount ? (
          <div className="mt-2 space-y-2 animate-pulse">
            <div className="h-8 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        ) : (
          <>
            <h3 className="text-3xl font-semibold mt-1">
              {dashboardCount?.data?.pendingTodoTasks}
            </h3>
            <p className="text-sm text-green-600 mt-1">
              Total: {dashboardCount?.data?.totalTodoTasks}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderPatientDashboardStats;
