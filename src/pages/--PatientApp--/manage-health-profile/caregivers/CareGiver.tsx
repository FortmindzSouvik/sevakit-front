import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import MenuPopover from "@/components/menu-popover/MenuPopover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddCareGiver from "./component/AddCareGiver";
import CaregiverDeleteModal from "./component/CaregiverDeleteModal";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import useUpdateData from "@/hooks/useUpdateData";
import { useFetchData } from "@/hooks/useFetchData";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";
import { useAppSelector } from "@/redux/store";
import SkeletonCard from "@/components/skeletonLoader/SkeletonCard";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { formatPhoneNumber } from "@/lib/utils";

const CareGiver = () => {
  const navigate = useNavigate();

  const [openDeleteCaregiverModal, setOpenDeleteCaregiverModal] =
    useState(false);
  const [openAddCaregiverModal, setOpenAddCaregiverModal] = useState(false);

  const [value, setValue] = useState<"Yes" | "No">("No");

  const [page, setPage] = useState(1);
  const [careGiver, setCareGiver] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedCareGiver, setSelectedCareGiver] = useState<any | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [careGiverId, setCareGiverId] = useState("");

  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";

  const { isVisible, toggleVisibility, isUpdating } = useSectionVisibility(
    userId,
    "isCaregiversVisible"
  );

  const { mutateAsync: updateCareGiver, isPending: isUpdatePending } =
    useUpdateData(["update-caregiver"]);

  const { data, isFetching, refetch } = useFetchData(
    `${apiRoutes.getCareGiverList}?page=${page}&limit=8&sortBy=createdAt:desc`,
    ["getCareGiverList", page],
    true
  );
  const totalPages = data?.data?.totalPages ?? 1;

  useEffect(() => {
    if (data?.data?.results) {
      setCareGiver((prev) =>
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
    if (careGiver.length > 0) {
      setCareGiverId(careGiver[0].id);
    }
    if (careGiver?.length > 0 && careGiver[0]?.manageOwnHealth === "Yes") {
      setValue("Yes");
    }
  }, [careGiver]);

  const handleCareGiver = async (val: "Yes" | "No") => {
    setValue(val);
    if (!careGiverId) {
      setCareGiverId("");
      return;
    }
    try {
      await updateCareGiver({
        endpoint: apiRoutes.updateCareGiver(careGiverId),
        data: {
          manageOwnHealth: val,
        },
      });
    } catch (error) {
      // rollback
      setValue((prev) => (prev === "Yes" ? "No" : "Yes"));
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
          Caregivers
        </h1>
      </div>
      {/* insurance card */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src="/../icons/user-nurse-icon.svg" className="w-fit h-fit" />
            <h2 className="text-base font-semibold">Caregivers</h2>
          </div>

          {/*  Toggle */}
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
              id="caregiver-attorney"
              className="w-12 h-6"
              checked={isVisible}
              disabled={isUpdating}
              onCheckedChange={toggleVisibility}
            />
          </div>
        </div>
        <div className="mb-3 ">
          <div className="flex items-start justify-between">
            {/* select filed */}
            <div
              className={`flex items-start gap-3 w-full rounded-2xl px-3 py-2.5 bg-white border border-[#ECECEC]`}
            >
              <>
                <img
                  src="/../icons/user-nurse-icon.svg"
                  className="w-5 h-5 mt-1.5 "
                />
                <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />
              </>

              <div className="flex flex-col w-full">
                {/* SKELETON */}
                {isFetching && page === 1 && (
                  <>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <SkeletonCard key={i} size="mt-6" />
                    ))}
                  </>
                )}
                <label className="text-xs text-[#424242] font-medium font-mona w-fit">
                  Mange Own Health
                </label>

                <Select
                  value={value}
                  onValueChange={handleCareGiver}
                  disabled={isUpdatePending}
                >
                  <SelectTrigger className="border-0 shadow-none p-0 mt-0.5 text-sm focus:ring-0">
                    <SelectValue placeholder={"Select"} />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl">
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        {careGiver[0]?.manageOwnHealth === "Yes" && value === "Yes" && (
          <div
            ref={listRef}
            onScroll={handleScroll}
            className="max-h-[420px] overflow-y-auto pr-1 scrollbar-hide"
          >
            {/* SKELETON */}
            {/* {isFetching && page === 1 && (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonCard key={i} size="mt-6" />
                ))}
              </>
            )} */}

            {/* EMPTY */}
            {!isFetching && careGiver.length === 0 && value === "Yes" && (
              <p className="text-center text-sm text-gray-500">
                Care giver is not added yet.
              </p>
            )}

            {/* emergency Card */}
            {careGiver.map((item) => {
              return (
                <div key={item?.id} className="bg-[#FFFFFF] rounded-2xl p-4 ">
                  <div className="flex items-start justify-between">
                    {/* Title + Start Date */}
                    <div className="font-mona">
                      <h3 className="text-base font-semibold text-[#00AEC7] capitalize">
                        {item?.caregiverName || "NA"}
                      </h3>
                      <p className="text-base font-normal text-[#000000] mt-1 capitalize">
                        Relationship: {item?.relationship || "NA"}
                      </p>

                      <p className="text-base font-medium text-[#000000] mt-1 ">
                        <span className="font-medium">Phone: </span>
                        {formatPhoneNumber(item?.caregiverPhone) || "NA"}
                      </p>
                    </div>

                    {/* Menu Button */}
                    <MenuPopover
                      triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                      onEdit={() => {
                        setModalMode("edit");
                        setSelectedCareGiver(item);
                        setOpenAddCaregiverModal(true);
                      }}
                      onDelete={() => {
                        setCareGiverId(item?.id);
                        setOpenDeleteCaregiverModal(true);
                      }}
                    />
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
        )}
      </div>
      {/* Submit */}
      {value === "Yes" && careGiver.length === 0 && (
        <button
          type="submit"
          className="w-full bg-[#00BCD4] text-[#212121] py-3.5 rounded-xl font-semibold mt-2 cursor-pointer flex items-center justify-center gap-2"
          onClick={() => {
            setOpenAddCaregiverModal(true);
            setSelectedCareGiver(null);
            setModalMode("add");
          }}
        >
          <span className="text-xl leading-none">+</span>
          <span>Add Caregiver</span>
        </button>
      )}

      <AddCareGiver
        isOpen={openAddCaregiverModal}
        onClose={() => setOpenAddCaregiverModal(false)}
        onSuccess={() => {
          setPage(1);
          refetch();
          setOpenAddCaregiverModal(false);
          setCareGiverId("");
          setIsSuccessOpen(true);
        }}
        mode={modalMode}
        initialData={selectedCareGiver}
        setSelectedCareGiver={() => setSelectedCareGiver(null)}
      />

      <CaregiverDeleteModal
        isOpen={openDeleteCaregiverModal}
        onClose={() => setOpenDeleteCaregiverModal(false)}
        onSuccess={() => {
          refetch(), setPage(1);
          setCareGiverId("");
        }}
        careGiverId={careGiverId}
      />
      <CommonSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        desc={
          modalMode === "edit"
            ? "Your Caregiver information has been updated successfully."
            : "Your Caregiver information has been saved successfully."
        }
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
    </div>
  );
};

export default CareGiver;
