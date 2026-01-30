import { ROUTES } from "@/utils/routeConstants";
import { useNavigate } from "react-router";

const ProviderPatientDetailsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <button
          className="flex items-center gap-2 text-base font-medium cursor-pointer"
          onClick={() =>
            navigate(`/${ROUTES.role.provider}/${ROUTES.provider.patients}`)
          }
        >
          <img
            src="/../icons/back-arrow-icon.svg"
            className="w-5 h-5"
            alt="Back"
          />
          Back
        </button>

        <button className="flex items-center justify-center gap-2 bg-[#00BCD4] text-black px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto">
          <span className="text-lg">✎</span>
          Edit Patient Details
        </button>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SECTION (Patient / Other Details) */}
        <div className="flex-1 space-y-4 sm:space-y-6">
          {/* PERSONAL INFO */}
          <div className="bg-white border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:block">
              <img
                src="/../icons/doctor-avatar-icon.svg"
                className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl object-cover"
                alt="Patient"
              />
            </div>

            <div className="space-y-2 flex-1">
              <h3 className="font-semibold text-[#4A4A4A] text-lg">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-sm">
                <div>
                  <p className="text-[#4A4A4A] text-sm">Name</p>
                  <p className="font-medium text-[#000000] mt-1">
                    Michael Carter
                  </p>
                </div>

                <div>
                  <p className="text-[#4A4A4A] text-sm">Phone</p>
                  <p className="font-medium text-[#000000] mt-1">
                    +1 (415) 908-3341
                  </p>
                </div>

                <div>
                  <p className="text-[#4A4A4A] text-sm">Email</p>
                  <p className="font-medium text-[#000000] mt-1 break-all">
                    michael@example.com
                  </p>
                </div>

                <div>
                  <p className="text-[#4A4A4A] text-sm">Date of Birth</p>
                  <p className="font-medium text-[#000000] mt-1">07-14-1985</p>
                </div>
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="bg-white border rounded-2xl p-4 sm:p-5">
            <h3 className="font-semibold text-[#4A4A4A] mb-2 sm:mb-3">
              Address
            </h3>
            <p className="text-[#000000] text-sm sm:text-base">
              1225 Howard St, San Francisco, CA 94103
            </p>
          </div>

          {/* EMERGENCY CONTACT */}
          <div className="bg-white border rounded-2xl p-4 sm:p-5">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-lg">
              Emergency Contact
            </h3>

            <div className="bg-[#F6FBFC] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm">
              <div className="sm:flex-1">
                <p className="font-medium text-base sm:text-lg text-[#000000]">
                  Laura Carter
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div>
                  <span className="text-[#4A4A4A] font-medium text-sm">
                    Emergency Contact Phone
                  </span>
                  <p className="text-[#000000] text-base sm:text-[16px] font-medium mt-1">
                    +1 (415) 990-1123
                  </p>
                </div>

                <div>
                  <span className="text-[#4A4A4A] font-medium text-sm">
                    Relationship
                  </span>
                  <p className="text-[#000000] font-medium text-base sm:text-[16px] mt-1">
                    Spouse
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Care Information */}
          <div className="bg-white border rounded-2xl p-4 sm:p-5">
            <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-lg">
              Primary Care Information
            </h3>

            <div className="bg-[#F6FBFC] rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm">
              <div className="sm:flex-1">
                <span className="text-[#4A4A4A] font-medium text-sm">
                  Primary Care Provider
                </span>
                <p className="font-medium text-base sm:text-lg text-[#000000] mt-1">
                  Laura Carter
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div>
                  <span className="text-[#4A4A4A] font-medium text-sm">
                    Clinic
                  </span>
                  <p className="text-[#000000] text-base sm:text-[16px] font-medium mt-1">
                    Pacific Health Group
                  </p>
                </div>

                <div>
                  <span className="text-[#4A4A4A] font-medium text-sm">
                    Phone
                  </span>
                  <p className="text-[#000000] font-medium text-base sm:text-[16px] mt-1">
                    +1 (415) 801-2277
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Care Planning */}
          <div className="bg-white border rounded-2xl p-4 sm:p-5">
            <h3 className="font-semibold text-[#4A4A4A] mb-3 sm:mb-4 text-lg">
              Advanced Care Planning
            </h3>

            <div className="bg-[#F6FBFC] rounded-xl p-4 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-sm">
              <div className="flex-1 min-w-[150px]">
                <p className="text-[#4A4A4A] text-sm">Code Status</p>
                <p className="font-medium text-[#000000] mt-1">
                  DNR (Do Not Resuscitate)
                </p>
              </div>

              <div className="flex-1 min-w-[150px]">
                <p className="text-[#4A4A4A] text-sm">Health Proxy</p>
                <p className="font-medium text-[#000000] mt-1">Laura Carter</p>
              </div>

              <div className="flex-1 min-w-[150px]">
                <p className="text-[#4A4A4A] text-sm">Advance Directive</p>
                <p className="font-medium text-[#000000] mt-1 break-all">
                  Uploaded (advance_directive.pdf)
                </p>
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="bg-white border rounded-2xl p-4 sm:p-5">
            <h3 className="font-semibold text-[#4A4A4A] mb-3 sm:mb-4 text-lg">
              Allergies
            </h3>

            <div className="bg-[#F6FBFC] rounded-xl p-4 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-sm">
              <div className="flex-1 min-w-[120px]">
                <p className="font-medium text-base sm:text-[16px] text-[#000000]">
                  Peanuts
                </p>
              </div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-[#4A4A4A] text-sm">Reaction</p>
                <p className="font-medium text-[#000000] mt-1">Anaphylaxis</p>
              </div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-[#4A4A4A] text-sm">Severity</p>
                <p className="font-medium text-[#000000] mt-1">Moderate</p>
              </div>

              <div className="flex-1 min-w-[150px]">
                <p className="text-[#4A4A4A] text-sm">Note</p>
                <p className="font-medium text-[#000000] mt-1">
                  Reaction occurred in 2022.
                </p>
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="bg-white border rounded-2xl p-4 sm:p-5">
            <h3 className="font-semibold text-[#4A4A4A] mb-3 sm:mb-4 text-lg">
              Medications
            </h3>

            <div className="bg-[#F6FBFC] rounded-xl p-4 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-sm">
              <div className="flex-1 min-w-[120px]">
                <p className="font-medium text-base sm:text-[16px] text-[#000000]">
                  Atorvastatin
                </p>
              </div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-[#4A4A4A] text-sm">Form</p>
                <p className="font-medium text-[#000000] mt-1">Tablet</p>
              </div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-[#4A4A4A] text-sm">Dosage</p>
                <p className="font-medium text-[#000000] mt-1">10 mg</p>
              </div>

              <div className="flex-1 min-w-[150px]">
                <p className="text-[#4A4A4A] text-sm">Dosage Frequency</p>
                <p className="font-medium text-[#000000] mt-1">Once daily</p>
              </div>
            </div>
          </div>

          {/* Medical Reports */}
          <div className="bg-white border rounded-2xl p-4 sm:p-5">
            <h3 className="font-semibold text-[#4A4A4A] mb-3 sm:mb-4 text-lg">
              Medical Reports
            </h3>

            <div className="bg-[#F6FBFC] rounded-xl p-4 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-sm">
              <div className="flex-1 min-w-[120px]">
                <p className="font-medium text-base sm:text-[16px] text-[#000000]">
                  Lab Report
                </p>
              </div>

              <div className="flex-1 min-w-[150px]">
                <p className="text-[#4A4A4A] text-sm">File Name</p>
                <p className="font-medium text-[#000000] mt-1 break-all">
                  lab_panel_07_2023.pdf
                </p>
              </div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-[#4A4A4A] text-sm">Date Uploaded</p>
                <p className="font-medium text-[#000000] mt-1">07/03/2023</p>
              </div>
            </div>
          </div>

          {/* Insurance */}
          <div className="bg-white border rounded-2xl p-4 sm:p-5">
            <h3 className="font-semibold text-[#4A4A4A] mb-3 sm:mb-4 text-lg">
              Insurance
            </h3>

            <div className="bg-[#F6FBFC] rounded-xl p-4 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                <p className="font-medium text-base sm:text-[16px] text-[#000000]">
                  Blue Shield PPO
                </p>

                <span className="rounded-full bg-[#CFF4FC] px-3 py-1 text-xs font-medium text-[#009FB6] mt-1 sm:mt-0">
                  Primary Insurance
                </span>
              </div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-[#4A4A4A] text-sm">Member ID</p>
                <p className="font-medium text-[#000000] mt-1">845991239</p>
              </div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-[#4A4A4A] text-sm">Group ID</p>
                <p className="font-medium text-[#000000] mt-1">G839194</p>
              </div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-[#4A4A4A] text-sm">Expires</p>
                <p className="font-medium text-[#000000] mt-1">12/31/2025</p>
              </div>
            </div>
          </div>

          {/* Driver's License */}
          <div className="bg-white border rounded-2xl p-4 sm:p-5">
            <h3 className="font-semibold text-[#4A4A4A] mb-3 sm:mb-4 text-lg">
              Driver's License
            </h3>

            <div className="bg-[#F6FBFC] rounded-xl p-4 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-sm">
              <div className="flex items-center gap-4 sm:block">
                <img
                  src="/../icons/doctor-avatar-icon.svg"
                  alt="license"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-md border"
                />
              </div>

              <div className="flex-1 min-w-[150px]">
                <p className="font-medium text-base sm:text-[16px] text-[#000000]">
                  Johnathan Doe
                </p>
              </div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-[#4A4A4A] text-sm">License Number</p>
                <p className="font-medium text-[#000000] mt-1">TX-9218832</p>
              </div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-[#4A4A4A] text-sm">State</p>
                <p className="font-medium text-[#000000] mt-1">Texas</p>
              </div>

              <div className="flex-1 min-w-[120px]">
                <p className="text-[#4A4A4A] text-sm">Expires</p>
                <p className="font-medium text-[#000000] mt-1">12/31/2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION (To-Do List) */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="rounded-2xl border bg-white overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 bg-[#F7FDFF] gap-3">
              <h3 className="text-lg font-medium text-[#4A4A4A]">To-Do List</h3>

              <button
                className="flex items-center justify-center gap-1 rounded-lg bg-[#00BCD4] px-4 py-2 text-sm font-medium text-black w-full sm:w-auto cursor-pointer"
                onClick={() =>
                  navigate(
                    `/${ROUTES.role.provider}/${ROUTES.provider.patients}/${ROUTES.provider.createToDo}`,
                  )
                }
              >
                <span className="text-lg">+</span>
                Add To-do
              </button>
            </div>

            <div className="border-t" />

            {/* Pending Tasks */}
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <p className="mb-3 sm:mb-4 text-base font-medium text-gray-700">
                Pending Tasks
              </p>

              <div className="rounded-2xl border border-[#00BCD4]">
                <div className="p-3 sm:p-4">
                  <p className="text-sm font-medium text-[#00BCD4] mb-1">
                    Labs
                  </p>

                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Complete fasting blood test
                  </h4>

                  <p className="text-sm text-[#4A4A4A] mb-3 sm:mb-4">
                    Assigned:{" "}
                    <span className="font-medium text-[#009FB6]">
                      03-02-2024
                    </span>
                    {" • "}
                    <span className="font-medium text-[#009FB6]">Pending</span>
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row border-t border-[#00BCD4]">
                  <button className="flex-1 py-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-bl-2xl sm:rounded-bl-none cursor-pointer">
                    Delete
                  </button>

                  <div className="h-px sm:h-auto sm:w-px bg-[#00BCD4]" />

                  <button className="flex-1 py-3 text-sm font-medium text-[#00BCD4] hover:bg-cyan-50 rounded-br-2xl sm:rounded-br-2xl cursor-pointer">
                    Mark as Completed
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t" />

            {/* Completed Tasks */}
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-base font-medium text-gray-700">
                  Completed Tasks
                </p>

                <button
                  className="flex items-center gap-1 text-sm font-semibold text-[#009FB6] cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/${ROUTES.role.provider}/${ROUTES.provider.patients}/${ROUTES.provider.completeToDo}`,
                    )
                  }
                >
                  See all →
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    category: "X-Ray/CT",
                    title: "Chest X-ray",
                    assigned: "02-14-2024",
                    completed: "02-18-2024",
                    status: "Completed",
                  },
                  {
                    category: "MRI",
                    title: "Brain MRI",
                    assigned: "02-14-2024",
                    completed: "02-18-2024",
                    status: "Completed",
                  },
                  {
                    category: "Ultrasound",
                    title: "Abdominal Ultrasound",
                    assigned: "02-14-2024",
                    completed: "02-18-2024",
                    status: "Pending",
                  },
                ].map((task, index) => (
                  <div key={index} className="rounded-2xl bg-[#F3FAFC] p-4">
                    <p className="text-sm font-medium text-[#009FB6] mb-1">
                      {task.category}
                    </p>

                    <h4 className="text-base sm:text-lg font-semibold text-[#000000] mb-2">
                      {task.title}
                    </h4>

                    <p className="text-sm text-[#000000] mb-3">
                      Assigned:{" "}
                      <span className="font-medium text-[#009FB6]">
                        {task.assigned}
                      </span>
                      {" • "}
                      Completed:{" "}
                      <span className="font-medium text-[#009FB6]">
                        {task.completed}
                      </span>
                    </p>

                    <p
                      className={`text-sm font-semibold text-center ${task.status === "Completed" ? "text-[#4FB053]" : "text-red-400"}`}
                    >
                      {task.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderPatientDetailsPage;
