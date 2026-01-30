import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import MenuPopover from "@/components/menu-popover/MenuPopover";
import AddEmergency from "./component/AddEmergency";
import EmergencyDeleteModal from "./component/EmergencyDeleteModal";
import { useAppSelector } from "@/redux/store";
import { useFetchData } from "@/hooks/useFetchData";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import SkeletonCard from "@/components/skeletonLoader/SkeletonCard";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { formatPhoneNumber } from "@/lib/utils";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";

const EmergencyContact = () => {
  const navigate = useNavigate();
  const [openDeleteEmergencyModal, setOpenDeleteEmergencyModal] =
    useState(false);
  const [openAddEmergencyModal, setOpenAddEmergencyModal] = useState(false);
  const [page, setPage] = useState(1);
  const [emergencyContact, setEmergencyContact] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedEmergencyContact, setSelectedEmergencyContact] = useState<
    any | null
  >(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [emergencyId, setEmergencyId] = useState("");

  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";

  const { isVisible, toggleVisibility, isUpdating } = useSectionVisibility(
    userId,
    "isEmergencyContactVisible"
  );

  const { data, isFetching, refetch } = useFetchData(
    `${apiRoutes.getEmergecyList}?page=${page}&limit=8&sortBy=createdAt:desc`,
    ["getEmergencyList", page],
    true
  );
  const totalPages = data?.data?.totalPages ?? 1;

  useEffect(() => {
    if (data?.data?.results) {
      setEmergencyContact((prev) =>
        page === 1 ? data?.data?.results : [...prev, ...data?.data?.results]
      );
    }
  }, [data, page]);

  const handleScroll = () => {
    if (!listRef.current || isFetching) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;

    if (isNearBottom && page < totalPages) {
      setPage((prev) => prev + 1);
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
          Emergency Contact
        </h1>
      </div>
      {/* insurance card */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src="/../icons/light-emergency-on-icon.svg"
              className="w-fit h-fit"
            />
            <h2 className="text-base font-semibold"> Emergency Contact</h2>
          </div>

          {/* insurance Toggle */}
          <div className="flex items-center gap-2 ">
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
              id="emergency-switch"
              className="w-12 h-6"
              checked={isVisible}
              disabled={isUpdating}
              onCheckedChange={toggleVisibility}
            />
          </div>
        </div>
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="max-h-[420px] overflow-y-auto pr-1 scrollbar-hide"
        >
          {/* EMPTY */}
          {!isFetching && emergencyContact.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              No emergency contact added yet.
            </p>
          )}
          {/* SKELETON */}
          {isFetching && page === 1 && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} size="mt-6" />
              ))}
            </>
          )}
          {/* emergency Card */}
          {emergencyContact.map((item) => (
            <div key={item.id} className="bg-[#FFFFFF] rounded-2xl p-4 ">
              <div className="flex items-start justify-between">
                {/* Title + Start Date */}
                <div className="font-mona">
                  <h3 className="text-base font-semibold text-[#00AEC7]">
                    {item?.contactName || "NA"}
                  </h3>
                  <p className="text-base font-normal text-[#000000] mt-1 capitalize">
                    Relationship: {item?.relationship || "NA"}
                  </p>

                  <p className="text-base font-medium text-[#000000] mt-1 ">
                    <span className="font-medium">Phone: </span>
                    {formatPhoneNumber(item.phoneNumber)}
                  </p>
                  <p className="text-sm font-normal text-[#000000] mt-1">
                    Email: {item?.email || "NA"}
                  </p>
                </div>

                {/* Menu Button */}
                <MenuPopover
                  triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                  onEdit={() => {
                    setModalMode("edit");
                    setSelectedEmergencyContact(item);
                    setOpenAddEmergencyModal(true);
                  }}
                  onDelete={() => {
                    setEmergencyId(item?.id);
                    setOpenDeleteEmergencyModal(true);
                  }}
                />
              </div>
            </div>
          ))}
          {/* BOTTOM LOADER */}
          {isFetching && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          )}
        </div>
      </div>
      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-[#00BCD4] text-[#212121] py-3.5 rounded-xl font-semibold mt-2 cursor-pointer flex items-center justify-center gap-2"
        onClick={() => {
          setModalMode("add");
          setSelectedEmergencyContact(null);
          setOpenAddEmergencyModal(true);
        }}
      >
        <span className="text-xl leading-none">+</span>
        <span>Add Emergency Contact</span>
      </button>

      <AddEmergency
        isOpen={openAddEmergencyModal}
        onClose={() => setOpenAddEmergencyModal(false)}
        onSuccess={() => {
          setPage(1);
          refetch();
          setOpenAddEmergencyModal(false);
          setIsSuccessOpen(true);
        }}
        mode={modalMode}
        initialData={selectedEmergencyContact}
        setSelectedEmergencyContact={() => setSelectedEmergencyContact(null)}
      />

      <EmergencyDeleteModal
        isOpen={openDeleteEmergencyModal}
        onClose={() => setOpenDeleteEmergencyModal(false)}
        onSuccess={() => {
          refetch(), setPage(1);
        }}
        emergencyId={emergencyId}
      />

      <CommonSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        desc={
          modalMode === "edit"
            ? "Your emergency contact has been updated successfully."
            : "Your emergency contact has been saved successfully."
        }
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
    </div>
  );
};

export default EmergencyContact;
