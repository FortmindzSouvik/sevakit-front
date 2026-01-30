import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/utils/routeConstants";
import { useNavigate } from "react-router";

const ProviderPatientsPage = () => {
  const navigate = useNavigate();

  const patients = [
    {
      id: 1,
      name: "Michael Carter",
      dob: "May 14, 1989",
      phone: "+1 (415) 908-3341",
      email: "carter@example.com",
      lastLogin: "08/12/2025",
      created: "05/12/2025",
    },
    {
      id: 2,
      name: "Sarah Thompson",
      dob: "August 22, 1992",
      phone: "+1 (612) 234-5678",
      email: "sarah.thompson@example.com",
      lastLogin: "09/20/2025",
      created: "06/15/2025",
    },
    {
      id: 3,
      name: "David Nguyen",
      dob: "January 5, 1985",
      phone: "+1 (905) 876-5432",
      email: "david.nguyen@example.com",
      lastLogin: "10/30/2025",
      created: "07/01/2025",
    },
  ];

  return (
    <div className="space-y-6 font-mona p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
          Manage all patients
        </h2>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Select>
            <SelectTrigger className="h-10 w-full sm:w-[150px] border rounded-lg px-3 text-[16px] text-[#616161] focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 font-mona">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="30days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          <button
            className="bg-[#00BCD4] text-black px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
            onClick={() =>
              navigate(
                `/${ROUTES.role.provider}/${ROUTES.provider.patients}/${ROUTES.provider.addPatient}`,
              )
            }
          >
            <span className="text-lg leading-none">+</span>
            Add New Patient
          </button>
        </div>
      </div>

      {/* Desktop Table (hidden on mobile) */}
      <div className="hidden lg:block bg-white rounded-xl border overflow-hidden font-mona">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FDFF] text-gray-600 border">
              <tr>
                {[
                  "Patient Name",
                  "Date of Birth",
                  "Phone Number",
                  "Email",
                  "Last Login",
                  "Created",
                  "Action",
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
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800 border">
                    {patient.name}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    {patient.dob}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    {patient.phone}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    {patient.email}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    {patient.lastLogin}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    {patient.created}
                  </td>
                  <td className="px-4 py-3 border">
                    <div className="flex items-center gap-3 text-[#00BCD4]">
                      <img
                        src="/../icons/provider-edit-icon.svg"
                        alt="edit"
                        className="w-fit h-fit cursor-pointer"
                      />
                      <img
                        src="/../icons/provider-view-icon.svg"
                        alt="view"
                        className="w-fit h-fit cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/${ROUTES.role.provider}/${ROUTES.provider.patients}/${ROUTES.provider.patientsDetails}`,
                          )
                        }
                      />
                    </div>
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
                {[
                  "Patient Name",
                  "Date of Birth",
                  "Phone",
                  "Last Login",
                  "Action",
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
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800 border">
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-[150px]">
                      {patient.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    {patient.dob}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    {patient.phone}
                  </td>
                  <td className="px-4 py-3 text-gray-800 border">
                    {patient.lastLogin}
                  </td>
                  <td className="px-4 py-3 border">
                    <div className="flex items-center gap-3 text-[#00BCD4]">
                      <img
                        src="/../icons/provider-edit-icon.svg"
                        alt="edit"
                        className="w-fit h-fit cursor-pointer"
                      />
                      <img
                        src="/../icons/provider-view-icon.svg"
                        alt="view"
                        className="w-fit h-fit cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/${ROUTES.role.provider}/${ROUTES.provider.patients}/${ROUTES.provider.patientsDetails}`,
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards (hidden on tablet and desktop) */}
      <div className="md:hidden space-y-4">
        {patients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{patient.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="/../icons/provider-edit-icon.svg"
                  alt="edit"
                  className="w-5 h-5 cursor-pointer"
                />
                <img
                  src="/../icons/provider-view-icon.svg"
                  alt="view"
                  className="w-5 h-5 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/${ROUTES.role.provider}/${ROUTES.provider.patients}/${ROUTES.provider.patientsDetails}`,
                    )
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Date of Birth</p>
                <p className="font-medium">{patient.dob}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{patient.phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Login</p>
                <p className="font-medium">{patient.lastLogin}</p>
              </div>
              <div>
                <p className="text-gray-500">Created</p>
                <p className="font-medium">{patient.created}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProviderPatientsPage;
