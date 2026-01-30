import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import MenuPopover from "@/components/menu-popover/MenuPopover";
import AdvancePlanDeleteModal from "./components/AdvancePlanDeleteModal";
import AddAdvancePlan from "./components/AddAdvancePlan";
import { useAppSelector } from "@/redux/store";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useFetchData } from "@/hooks/useFetchData";
import SkeletonCard from "@/components/skeletonLoader/SkeletonCard";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { formatDate } from "@/lib/utils";

const AdvancePlan = () => {
  const navigate = useNavigate();
  const [openDeleteAdvancePlanModal, setOpenDeleteAdvancePlanModal] =
    useState(false);
  const [openAddAdvancePlanModal, setOpenAddAdvancePlanModal] = useState(false);
  const [page, setPage] = useState(1);
  const [advancePlan, setAdvancePlan] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedAdvancePlan, setSelectedAdvancePlan] = useState<any | null>(
    null
  );
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [advancePlanId, setAdvancePlanId] = useState("");

  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";

  const { isVisible, toggleVisibility, isUpdating } = useSectionVisibility(
    userId,
    "isAdvancedCarePlanVisible"
  );

  const { data, isFetching, refetch } = useFetchData(
    `${apiRoutes.getAdvanceCarePlanList}?page=${page}&limit=8&sortBy=createdAt:desc`,
    ["getAdvancePlanList", page],
    true
  );
  const totalPages = data?.data?.totalPages ?? 1;

  useEffect(() => {
    if (data?.data?.results) {
      setAdvancePlan((prev) =>
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

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          Advanced Care Plan
        </h1>
      </div>
      {/* insurance card */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src="/../icons/hand-holding-heart-icon.svg"
              className="w-fit h-fit"
            />
            <h2 className="text-base font-semibold"> Advanced Care Plan</h2>
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
              id="advance-plan-switch"
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
          {!isFetching && advancePlan.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              No advance care plan added yet.
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
          {advancePlan.map((item) => {
            return (
              <div key={item?.id} className="bg-[#FFFFFF] rounded-2xl p-4 ">
                <div className="flex items-start justify-between">
                  {/* Title + Start Date */}
                  <div className="font-mona w-full">
                    <div className="flex items-start justify-between">
                      {" "}
                      <h3 className="text-base font-semibold text-[#00AEC7]">
                        Code Status:{item?.resuscitationPreference || "NA"}
                      </h3>
                      {/* Menu Button */}
                      <MenuPopover
                        triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                        onEdit={() => {
                          setModalMode("edit");
                          setSelectedAdvancePlan(item);
                          setOpenAddAdvancePlanModal(true);
                        }}
                        onDelete={() => {
                          setAdvancePlanId(item?.id);
                          setOpenDeleteAdvancePlanModal(true);
                        }}
                      />
                    </div>
                    <p className="text-base font-normal text-[#000000] mt-1">
                      Last Updated: {formatDate(item?.updatedAt)}
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-base font-medium text-[#000000]  ">
                        <span className="font-medium">Document: </span>
                        On file
                      </p>
                      <span className="flex justify-between items-center gap-2 text-[#009FB6] font-mona font-medium text-sm ">
                        <span
                          className="flex justify-center items-center gap-1"
                          onClick={() =>
                            handleDownload(
                              item?.codeStatusDocument?.fileUrl,
                              item?.codeStatusDocument?.fileName
                            )
                          }
                        >
                          Download
                          <img
                            src="/../icons/dwnld-icon.svg"
                            alt="download"
                            className="w-fit h-fit cursor-pointer"
                          />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
      {advancePlan?.length <= 0 && (
        <button
          type="submit"
          className="w-full bg-[#00BCD4] text-[#212121] py-3.5 rounded-xl font-semibold mt-2 cursor-pointer flex items-center justify-center gap-2"
          onClick={() => {
            setModalMode("add");
            setSelectedAdvancePlan(null);
            setOpenAddAdvancePlanModal(true);
          }}
        >
          <span className="text-xl leading-none">+</span>
          <span>Advanced Care Plan</span>
        </button>
      )}

      <AddAdvancePlan
        isOpen={openAddAdvancePlanModal}
        onClose={() => setOpenAddAdvancePlanModal(false)}
        onSuccess={() => {
          setPage(1);
          refetch();
          setOpenAddAdvancePlanModal(false);
          setIsSuccessOpen(true);
        }}
        mode={modalMode}
        initialData={selectedAdvancePlan}
        setSelectedAdvancePlan={() => setSelectedAdvancePlan(null)}
      />

      <AdvancePlanDeleteModal
        isOpen={openDeleteAdvancePlanModal}
        onClose={() => setOpenDeleteAdvancePlanModal(false)}
        onSuccess={() => {
          refetch(), setPage(1), setAdvancePlanId("");
        }}
        advancePlanId={advancePlanId}
      />

      <CommonSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        desc={
          modalMode === "edit"
            ? "Your Advanced Care Plan has been updated successfully."
            : "Your Advanced Care Plan has been saved successfully."
        }
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
    </div>
  );
};

export default AdvancePlan;
