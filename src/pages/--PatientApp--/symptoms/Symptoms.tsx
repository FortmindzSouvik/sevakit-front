import { Switch } from "@/components/ui/switch";
import AddLogSymptom from "./component/AddLogSymptom";
import { useEffect, useRef, useState } from "react";
import SymptomDeleteModal from "./component/SymptomDeleteModal";
import { useNavigate } from "react-router";
import { ROUTES } from "@/utils/routeConstants";
import MenuPopover from "@/components/menu-popover/MenuPopover";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useFetchData } from "@/hooks/useFetchData";
import SkeletonCard from "@/components/skeletonLoader/SkeletonCard";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { formatDateTime, formatDurationSince } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { toast } from "sonner";
import useUpdateData from "@/hooks/useUpdateData";

const Symptoms = () => {
  const navigate = useNavigate();
  const [openLogModal, setOpenLogModal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [openDeleteLogModal, setOpenDeleteLogModal] = useState(false);
  const [page, setPage] = useState(1);
  const [symptoms, setSymptoms] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedSymptoms, setSelectedSymptoms] = useState<any | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [symptomId, setSymptomId] = useState("");

  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";
  const { data: userDetails } = useFetchData(
    `${apiRoutes.getParticularUserList(userId)}`,
    ["get-user-particular-list"],
    true
  );

  const { mutateAsync: updateUserDetails, isPending: isUpdating } =
    useUpdateData(["update-symptoms-visibility"]);

  const isSymptomsVisible = userDetails?.data?.isSymptomsVisible;

  const { data, isFetching, refetch } = useFetchData(
    `${apiRoutes.getSymptomList}?page=${page}&limit=8&sortBy=createdAt:desc`,
    ["getAllergiesList", page],
    true
  );
  const totalPages = data?.data?.totalPages ?? 1;

  useEffect(() => {
    if (data?.data?.results) {
      setSymptoms((prev) =>
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

  useEffect(() => {
    if (typeof isSymptomsVisible === "boolean") {
      setIsVisible(isSymptomsVisible);
    }
  }, [isSymptomsVisible]);

  const handleVisibilityToggle = async (value: boolean) => {
    setIsVisible(value);

    try {
      await updateUserDetails({
        endpoint: apiRoutes.updateUserDetails(userId),
        data: {
          isSymptomsVisible: value,
        },
      });
    } catch (error) {
      // rollback on failure
      setIsVisible(!value);
      toast.error("Failed to update visibility");
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
          Symptoms
        </h1>
      </div>

      {/* symptom card */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/../icons/head-side-cough-icon.svg"
              alt="head-side-cough-icon"
              className="w-fit h-fit"
            />
            <h2 className="text-base font-semibold">Symptoms</h2>
          </div>

          {/* Visibility Toggle */}
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
              id="visibility-switch"
              className="w-12 h-6"
              checked={isVisible}
              disabled={isUpdating}
              onCheckedChange={handleVisibilityToggle}
            />
          </div>
        </div>

        <div
          ref={listRef}
          onScroll={handleScroll}
          className="max-h-[420px] overflow-y-auto pr-1 scrollbar-hide"
        >
          {/* EMPTY */}
          {!isFetching && symptoms.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              No symptoms added yet.
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
          {/* Symptoms Card */}
          {symptoms.map((item) => (
            <div key={item.id} className="bg-[#FFFFFF] rounded-xl p-5 mt-5 ">
              <div className="flex justify-between">
                <h3 className="text-[#00AEC7] text-[18px] font-semibold">
                  {item.symptomName}
                </h3>

                {/* Options Menu */}
                <div className="relative">
                  {/* Menu Button */}
                  <MenuPopover
                    triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                    onEdit={() => {
                      setModalMode("edit");
                      setSelectedSymptoms(item);
                      setOpenLogModal(true);
                    }}
                    onDelete={() => {
                      setSymptomId(item?.id);
                      setOpenDeleteLogModal(true);
                    }}
                  />
                </div>
              </div>

              <p className="text-sm mt-2">
                <span className="font-medium">Severity:</span>{" "}
                <span className="text-[#000000] font-semibold capitalize">
                  {item.severity}
                </span>
              </p>

              <p className="text-sm mt-1">
                <span className="font-medium">Duration:</span>{" "}
                <span className="text-[#000000] font-semibold">
                  {formatDurationSince(item?.duration)}
                </span>
              </p>

              {item?.additionalNotes && (
                <div className="bg-[#E8F9FF] text-[#000000] mt-4 p-2 text-sm">
                  {item?.additionalNotes}
                </div>
              )}

              <p className="text-[12px] mt-3 text-[#000000]">
                Logged:
                <span className="font-medium">
                  {formatDateTime(item?.updatedAt)}
                </span>
              </p>
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

      {/* Log Symptom Button */}
      <div className="mt-4">
        <button
          className="w-full bg-[#00BCD4] text-[#212121] py-4 rounded-xl text-base font-semibold font-mona flex items-center justify-center gap-2 cursor-pointer"
          onClick={() => {
            setModalMode("add");
            setSelectedSymptoms(null);
            setOpenLogModal(true);
          }}
        >
          + Log Symptom
        </button>
      </div>

      {/* Modal */}
      <AddLogSymptom
        isOpen={openLogModal}
        onClose={() => setOpenLogModal(false)}
        onSuccess={() => {
          setPage(1);
          refetch();
          setOpenLogModal(false);
          setIsSuccessOpen(true);
        }}
        mode={modalMode}
        initialData={selectedSymptoms}
        setSelectedSymptoms={() => setSelectedSymptoms(null)}
      />
      <SymptomDeleteModal
        isOpen={openDeleteLogModal}
        onClose={() => setOpenDeleteLogModal(false)}
        onSuccess={() => {
          refetch(), setPage(1);
        }}
        symptomId={symptomId}
      />

      <CommonSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        desc={
          modalMode === "edit"
            ? "Your symptom has been updated successfully."
            : "Your symptom has been logged successfully."
        }
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
    </div>
  );
};

export default Symptoms;
