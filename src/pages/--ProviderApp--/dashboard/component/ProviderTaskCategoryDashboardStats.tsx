import { useFetchData } from "@/hooks/useFetchData";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";

const ProviderTaskCategoryDashboardStats = ({
  selectedDays,
}: {
  selectedDays: string;
}) => {
  const { data: dashboardTaskStats, isFetching: isFetchingDashboardTaskStats } =
    useFetchData(
      apiRoutes.getDashboardTaskStats(selectedDays),
      ["get-dashboard-task-stats", selectedDays],
      !!selectedDays,
    );

  const tasks = dashboardTaskStats?.data ?? [];

  return (
    <>
      {/* <div className="flex flex-col gap-3 mt-4">
        <h3 className="font-medium text-lg">Tasks by Category</h3>
        <p className="text-[14px] text-[#4A4A4A] font-normal -mt-2">
          Distribution of tasks across categories
        </p>
        <div className="bg-white rounded-xl border p-4 min-h-[420px] flex flex-col space-y-5">
          {[
            { name: "Labs", pending: 3, total: 3 },
            { name: "X-Ray / CT Scan", pending: 2, total: 2 },
            { name: "Administrative Paperwork", pending: 1, total: 2 },
            { name: "Hospital Discharge Records", pending: 0, total: 2 },
          ].map((t, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-3">
                <span>{t.name}</span>
                <span>
                  <span className="text-red-500">{t.pending} pending</span> |{" "}
                  <span className="text-blue-500">{t.total} total</span>
                </span>
              </div>
              <div className="h-2 bg-[#E6FAFD] rounded-full">
                <div
                  className="h-2 bg-[#00BCD4] rounded-full"
                  style={{ width: `${(t.pending / t.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div> */}
      <div className="flex flex-col gap-3 mt-4">
        <h3 className="font-medium text-lg">Tasks by Category</h3>
        <p className="text-[14px] text-[#4A4A4A] font-normal -mt-2">
          Distribution of tasks across categories
        </p>

        <div className="bg-white rounded-xl border p-4 min-h-[420px] flex flex-col space-y-5">
          {isFetchingDashboardTaskStats &&
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                  <div className="h-4 w-28 bg-gray-200 rounded" />
                </div>
                <div className="h-2 bg-gray-200 rounded-full" />
              </div>
            ))}

          {!isFetchingDashboardTaskStats && tasks.length === 0 && (
            <div className="flex items-center justify-center flex-1 text-gray-500 text-sm">
              No data to show
            </div>
          )}

          {!isFetchingDashboardTaskStats &&
            tasks.length > 0 &&
            tasks.map((t: any, i: number) => {
              const percentage =
                t.total > 0 ? Math.round((t.pending / t.total) * 100) : 0;

              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-3">
                    <span>{t.categoryName}</span>
                    <span>
                      <span className="text-red-500">{t.pending} pending</span>{" "}
                      | <span className="text-blue-500">{t.total} total</span>
                    </span>
                  </div>

                  <div className="h-2 bg-[#E6FAFD] rounded-full">
                    <div
                      className="h-2 bg-[#00BCD4] rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ProviderTaskCategoryDashboardStats;
