import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import AddNewMedication from "./component/AddNewMedication";
import MenuPopover from "@/components/menu-popover/MenuPopover";
import MedicationDeleteModal from "./component/MedicationDeleteModal";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useFetchData } from "@/hooks/useFetchData";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";
import { useAppSelector } from "@/redux/store";
import SkeletonCard from "@/components/skeletonLoader/SkeletonCard";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { formatDate } from "@/lib/utils";

type MedicationListType = "active" | "inactive";

const Medications = () => {
  const navigate = useNavigate();
  const [openNewMedicationModal, setOpenNewMedicationModal] = useState(false);
  const [openDeleteMedicationModal, setOpenDeleteMedicationModal] =
    useState(false);

  const [activePage, setActivePage] = useState(1);
  const [inactivePage, setInactivePage] = useState(1);

  const [activeMedications, setActiveMedications] = useState<any[]>([]);
  const [inactiveMedications, setInactiveMedications] = useState<any[]>([]);

  const activeListRef = useRef<HTMLDivElement | null>(null);
  const inactiveListRef = useRef<HTMLDivElement | null>(null);

  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedMedication, setSelectedMedication] = useState<any | null>(
    null
  );
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [medicationId, setMedicationId] = useState("");

  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";

  const { isVisible, toggleVisibility, isUpdating } = useSectionVisibility(
    userId,
    "isMedicationsVisible"
  );
  const [affectedList, setAffectedList] =
    useState<MedicationListType>("active");
  const {
    data: activeData,
    isFetching: isFetchingActive,
    refetch: isActiveRefetch,
  } = useFetchData(
    `${apiRoutes.getMedicationsList}?isActive=true&page=${activePage}&limit=8&sortBy=createdAt:desc`,
    ["getMedicationsList", activePage],
    true
  );

  const {
    data: inactiveData,
    isFetching: isFetchingInactive,
    refetch: isInactiveRefetch,
  } = useFetchData(
    `${apiRoutes.getMedicationsList}?isActive=false&page=${inactivePage}&limit=8&sortBy=createdAt:desc`,
    ["getInactiveMedications", inactivePage],
    true
  );

  useEffect(() => {
    if (!activeData?.data?.results?.length) return;

    setActiveMedications((prev) =>
      activePage === 1
        ? activeData.data.results
        : [...prev, ...activeData.data.results]
    );
  }, [activeData, activePage]);

  useEffect(() => {
    if (!inactiveData?.data?.results?.length) return;

    setInactiveMedications((prev) =>
      inactivePage === 1
        ? inactiveData.data.results
        : [...prev, ...inactiveData.data.results]
    );
  }, [inactiveData, inactivePage]);

  const handleActiveScroll = () => {
    if (!activeListRef.current || isFetchingActive) return;

    const { scrollTop, scrollHeight, clientHeight } = activeListRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      if (activePage < (activeData?.data?.totalPages ?? 1)) {
        setActivePage((prev) => prev + 1);
      }
    }
  };
  const handleInactiveScroll = () => {
    if (!inactiveListRef.current || isFetchingInactive) return;

    const { scrollTop, scrollHeight, clientHeight } = inactiveListRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      if (inactivePage < (inactiveData?.data?.totalPages ?? 1)) {
        setInactivePage((prev) => prev + 1);
      }
    }
  };
  const refreshMedicationList = (list: MedicationListType) => {
    if (list === "active") {
      setActivePage(1);
      setActiveMedications([]);
      isActiveRefetch();
    }

    if (list === "inactive") {
      setInactivePage(1);
      setInactiveMedications([]);
      isInactiveRefetch();
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5 font-mona">
      <div className="flex items-center justify-center relative mb-8">
        <button className="absolute left-0">
          <img
            src="/../icons/back-arrow-icon.svg"
            alt="back arrow"
            className="w-fit h-fit cursor-pointer"
            onClick={() =>
              navigate(`/${ROUTES.role.patient}/${ROUTES.patient.dashboard}`)
            }
          />
        </button>
        <h1 className="text-base font-medium font-mona text-[#000000] ">
          Medications
        </h1>
      </div>
      {/* medication card */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/../icons/medication-icon.svg" className="w-fit h-fit" />
            <h2 className="text-base font-semibold">Medications</h2>
          </div>

          {/* medication Toggle */}
          <div className="flex items-center gap-2">
            <button
              className={`px-4 py-1 rounded-full font-mona font-medium text-sm
                ${
                  isVisible
                    ? "border border-[#00A9B8] bg-[#B9F2F8] text-[#000000]"
                    : "border border-[#E0E0E0] bg-[#E0E0E0] text-[#000000]"
                }`}
            >
              {isVisible ? "Visible" : "Hidden"}
            </button>

            {/* Switch */}
            <Switch
              id="medications-switch"
              className="w-12 h-6"
              checked={isVisible}
              disabled={isUpdating}
              onCheckedChange={toggleVisibility}
            />
          </div>
        </div>

        <button
          type="button"
          className="w-full bg-[#FFFFFF] mt-7 text-[#009FB6] text-base font-semibold font-mona border border-[#00BCD4] px-24 py-3 rounded-xl cursor-pointer"
          onClick={() => {
            setModalMode("add");
            setSelectedMedication(null);
            setOpenNewMedicationModal(true);
            setAffectedList("active");
          }}
        >
          + Add Medication
        </button>
      </div>

      {/* active medication */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        {/* Section Title */}
        <h2 className="text-base font-base mb-4">Active Medications</h2>
        <div
          ref={activeListRef}
          onScroll={handleActiveScroll}
          className="max-h-[420px] overflow-y-auto pr-1 scrollbar-hide"
        >
          {/* EMPTY */}
          {!isFetchingActive && activeMedications.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              No active medication is added yet.
            </p>
          )}
          {/* SKELETON */}
          {isFetchingActive && activePage === 1 && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} size="mt-6" />
              ))}
            </>
          )}
          {/* medication Card */}
          {activeMedications?.map((item) => {
            return (
              <div key={item?.id} className="bg-[#FFFFFF] rounded-2xl p-4 mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-fit h-fit rounded-full bg-[#F5FCFF] flex items-center justify-center mt-2">
                      <img
                        src="/../icons/med-icon.svg"
                        alt="med-icon"
                        className="w-fit h-fit"
                      />
                    </div>

                    <div className="font-mona">
                      <h3 className="text-base font-medium text-[#000000]">
                        {item?.medicationName || "NA"}
                        {item?.dosageNotes && (
                          <span className="text-[#00AEC7]">
                            {" "}
                            –{item.dosageNotes}
                          </span>
                        )}
                      </h3>

                      <p className="text-xs font-medium text-[#000000] mt-1">
                        Start Date: {formatDate(item?.createdAt) || "NA"}
                      </p>
                    </div>
                  </div>

                  <span className="text-[#009FB6] text-sm font-semibold mt-1">
                    {item?.dosageFrequency}
                  </span>

                  <MenuPopover
                    triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                    onEdit={() => {
                      setModalMode("edit");
                      setSelectedMedication(item);
                      setOpenNewMedicationModal(true);
                      setAffectedList(item.isActive ? "active" : "inactive");
                    }}
                    onDelete={() => {
                      setMedicationId(item?.id);
                      setOpenDeleteMedicationModal(true);
                      setAffectedList(item.isActive ? "active" : "inactive");
                    }}
                  />
                </div>
                {/* Divider */} {/* Prescription Section */}
                {/* <div className="border-t mt-4 mb-4"></div>
                <div className="flex justify-between items-center mx-2">
                  <div>
                    <p className="text-sm font-semibold text-[#4A4A4A] mb-1">
                      Prescription(s)
                    </p>

                    <p className="text-base font-medium text-[#000000] mb-2">
                      Atorvastatin.pdf
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-3">
                      <button className="text-[#00BCD4] text-sm font-medium">
                        View
                      </button>

                      <span className="text-gray-400">|</span>

                      <button className="text-[#009FB6] text-sm font-medium">
                        Download
                      </button>
                    </div>
                  </div>
                </div> */}
              </div>
            );
          })}
          {/* BOTTOM LOADER */}
          {isFetchingActive && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          )}
        </div>
      </div>

      {/* inactive medication */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <h2 className="text-base font-base mb-4">Inactive Medications</h2>
        <div
          ref={inactiveListRef}
          onScroll={handleInactiveScroll}
          className="max-h-[420px] overflow-y-auto pr-1 scrollbar-hide"
        >
          {/* EMPTY */}
          {!isFetchingInactive && inactiveMedications.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              No inactive medication is added yet.
            </p>
          )}
          {/* SKELETON */}
          {isFetchingInactive && inactivePage === 1 && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} size="mt-6" />
              ))}
            </>
          )}
          {/* medication Card */}
          {inactiveMedications?.map((item) => {
            return (
              <div className="bg-[#FFFFFF] rounded-2xl p-2 mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-fit h-fit rounded-full bg-[#F5FCFF] flex items-center justify-center mt-2">
                      <img
                        src="/../icons/med-icon.svg"
                        alt="med-icon"
                        className="w-fit h-fit"
                      />
                    </div>

                    <div className="font-mona">
                      <h3 className="text-base font-medium text-[#000000]">
                        {item?.medicationName || "NA"}
                        {item?.dosageNotes && (
                          <span className="text-[#00AEC7]">
                            {" "}
                            –{item.dosageNotes}
                          </span>
                        )}
                      </h3>
                      <p className="text-xs font-medium text-[#000000] mt-1">
                        Start Date: {formatDate(item?.updatedAt)}
                      </p>
                      {/* <p className="text-xs font-medium text-[#000000] mt-1">
                        End Date: Mar 12, 2025
                      </p> */}
                    </div>
                  </div>
                  <div className="flex justify-between items-start ">
                    <span className="text-[#212121] text-sm font-semibold mx-5 my-3">
                      {item?.dosageFrequency || "NA"}
                    </span>

                    <div className="mt-1.5">
                      <MenuPopover
                        triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                        onEdit={() => {
                          setModalMode("edit");
                          setSelectedMedication(item);
                          setOpenNewMedicationModal(true);
                          setAffectedList(
                            item.isActive ? "active" : "inactive"
                          );
                        }}
                        onDelete={() => {
                          setMedicationId(item?.id);
                          setOpenDeleteMedicationModal(true);
                          setAffectedList(
                            item.isActive ? "active" : "inactive"
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* BOTTOM LOADER */}
          {isFetchingInactive && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          )}
        </div>
      </div>

      <AddNewMedication
        isOpen={openNewMedicationModal}
        onClose={() => setOpenNewMedicationModal(false)}
        onSuccess={(isActive) => {
          const targetList: MedicationListType = isActive
            ? "active"
            : "inactive";

          refreshMedicationList(targetList);
          if (modalMode === "edit" && affectedList !== targetList) {
            refreshMedicationList(affectedList);
          }
          setIsSuccessOpen(true);
        }}
        mode={modalMode}
        initialData={selectedMedication}
      />

      <MedicationDeleteModal
        isOpen={openDeleteMedicationModal}
        onClose={() => setOpenDeleteMedicationModal(false)}
        medicationId={medicationId}
        onSuccess={() => {
          refreshMedicationList(affectedList);
          setOpenDeleteMedicationModal(false);
        }}
      />

      <CommonSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        desc={
          modalMode === "edit"
            ? "Medication updated successfully."
            : "Medication added successfully."
        }
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
    </div>
  );
};

export default Medications;
