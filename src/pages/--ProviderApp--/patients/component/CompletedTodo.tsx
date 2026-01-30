import { ROUTES } from "@/utils/routeConstants";
import { useNavigate } from "react-router";

const CompletedTodo = () => {
  const navigate = useNavigate();

  const completedTasks = [
    {
      id: 1,
      category: "X-Ray/CT",
      description: "Chest X-ray",
      assignedDate: "May 14, 1989",
      completedDate: "May 14, 1989",
      status: "Completed",
      document: "chest_xray_report.pdf",
    },
    {
      id: 2,
      category: "MRI",
      description: "Brain MRI",
      assignedDate: "August 22, 1992",
      completedDate: "August 22, 1992",
      status: "Completed",
      document: "brain_mri_results.pdf",
    },
    {
      id: 3,
      category: "Ultrasound",
      description: "Abdominal Ultrasound",
      assignedDate: "January 5, 1985",
      completedDate: "January 5, 1985",
      status: "Pending",
      document: "ultrasound_report.pdf",
    },
  ];

  return (
    <div className="space-y-6 font-mona p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          className="flex items-center gap-2 text-base font-medium cursor-pointer"
          onClick={() =>
            navigate(
              `/${ROUTES.role.provider}/${ROUTES.provider.patients}/${ROUTES.provider.patientsDetails}`,
            )
          }
        >
          <img
            src="/../icons/back-arrow-icon.svg"
            className="w-5 h-5"
            alt="Back"
          />
          Back
        </button>
      </div>

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Completed Tasks
        </h2>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden lg:block bg-white rounded-xl border overflow-hidden font-mona">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FDFF] text-gray-600 border">
              <tr>
                {[
                  "Category",
                  "Description",
                  "Assigned Date",
                  "Completed Date",
                  "Status",
                  "Document",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-3 text-left font-medium border-b"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y">
              {completedTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800 border">
                    {task.category}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    {task.description}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    {task.assignedDate}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    {task.completedDate}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    <button className="text-[#00BCD4] hover:text-[#0097A7] font-medium text-sm flex items-center gap-1">
                      <span>📄</span>
                      {task.document}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tablet Table (hidden on mobile and desktop) */}
      <div className="hidden md:block lg:hidden bg-white rounded-xl border overflow-hidden font-mona">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FDFF] text-gray-600 border">
              <tr>
                {["Category", "Description", "Dates", "Status", "Document"].map(
                  (head) => (
                    <th
                      key={head}
                      className="px-4 py-3 text-left font-medium border-b"
                    >
                      {head}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody className="divide-y">
              {completedTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800 border">
                    {task.category}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    {task.description}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    <div className="space-y-1">
                      <div>
                        <span className="text-xs text-gray-500">Assigned:</span>
                        <p className="text-sm">{task.assignedDate}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">
                          Completed:
                        </span>
                        <p className="text-sm">{task.completedDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    <button className="text-[#00BCD4] hover:text-[#0097A7] font-medium text-sm flex items-center gap-1">
                      <span>📄</span>
                      <span className="truncate max-w-[120px]">
                        {task.document}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards (hidden on tablet and desktop) */}
      <div className="md:hidden space-y-4">
        {completedTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {task.category}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      task.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <p className="text-gray-500 text-xs">Assigned Date</p>
                <p className="font-medium">{task.assignedDate}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Completed Date</p>
                <p className="font-medium">{task.completedDate}</p>
              </div>
            </div>

            <div className="border-t pt-3">
              <button className="text-[#00BCD4] hover:text-[#0097A7] font-medium text-sm flex items-center gap-2 w-full justify-between">
                <div className="flex items-center gap-2">
                  <span>📄</span>
                  <span className="truncate">{task.document}</span>
                </div>
                <span className="text-gray-400">↓</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination for mobile/tablet */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">3</span> of{" "}
          <span className="font-medium">3</span> tasks
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button className="px-3 py-1.5 bg-[#00BCD4] text-white rounded-lg text-sm font-medium hover:bg-[#0097A7]">
            1
          </button>
          <button className="px-3 py-1.5 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1.5 border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedTodo;
