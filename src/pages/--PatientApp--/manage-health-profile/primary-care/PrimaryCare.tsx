import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import MenuPopover from "@/components/menu-popover/MenuPopover";
import AddPrimaryCareProvider from "./component/AddPrimaryCareProvider";
import PrimaryCareDeleteModal from "./component/PrimaryCareDeleteModal";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useFetchData } from "@/hooks/useFetchData";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";
import { useAppSelector } from "@/redux/store";
import SkeletonCard from "@/components/skeletonLoader/SkeletonCard";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { formatPhoneNumber } from "@/lib/utils";

const PrimaryCare = () => {
  const navigate = useNavigate();
  const [openDeletePrimaryCareModal, setOpenDeletePrimaryCareModal] =
    useState(false);
  const [openAddPrimaryCareModal, setOpenAddPrimaryCareModal] = useState(false);

  const [page, setPage] = useState(1);
  const [primaryCareProvider, setPrimaryCareProvider] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedPrimaryCareProvider, setSelectedPrimaryCareProvider] =
    useState<any | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [primaryCareProviderId, setPrimaryCareProviderId] = useState("");

  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";

  const { isVisible, toggleVisibility, isUpdating } = useSectionVisibility(
    userId,
    "isPrimaryCareDoctorVisible"
  );

  const { data, isFetching, refetch } = useFetchData(
    `${apiRoutes.getPrimaryCareProviderList}?page=${page}&limit=8&sortBy=createdAt:desc`,
    ["getPrimaryCareProviderList", page],
    true
  );
  const totalPages = data?.data?.totalPages ?? 1;

  useEffect(() => {
    if (data?.data?.results) {
      setPrimaryCareProvider((prev) =>
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
          Care Providers
        </h1>
      </div>
      {/* insurance card */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src="/../icons/primary-care-icon.svg"
              className="w-fit h-fit"
            />
            <h2 className="text-base font-semibold"> Care Providers</h2>
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
              id="primary-care-switch"
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
          {!isFetching && primaryCareProvider.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              No care provider is added yet.
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
          {/* primary care provider Card */}
          {primaryCareProvider?.map((item) => {
            return (
              <div
                key={item?.id}
                className="bg-[#FFFFFF] rounded-2xl p-4 mb-4"
              >
                <div className="flex items-start justify-between">
                  {/* Title + Start Date */}
                  <div className="font-mona w-full">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold text-[#00AEC7] capitalize">
                        {item?.doctorName || "NA"}
                      </h3>
                      <button
                        className={`px-2.5 py-1.5 rounded-full font-mona font-medium text-xs  bg-[#B9F2F8] text-[#000000] `}
                      >
                        Care providers
                      </button>
                      {/* Menu Button */}
                      <MenuPopover
                        triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                        onEdit={() => {
                          setModalMode("edit");
                          setSelectedPrimaryCareProvider(item);
                          setOpenAddPrimaryCareModal(true);
                        }}
                        onDelete={() => {
                          setPrimaryCareProviderId(item?.id);
                          setOpenDeletePrimaryCareModal(true);
                        }}
                      />
                    </div>
                    <p className="text-sm font-normal text-[#000000] mt-1 capitalize">
                      Clinic: {item?.medicalFacility}
                    </p>
                    <p className="text-sm font-normal text-[#000000] mt-1">
                      Phone: {formatPhoneNumber(item?.doctorPhone) || "NA"}
                    </p>
                    <p className="text-sm font-normal text-[#000000] mt-1">
                      Email: {item?.doctorEmail || "NA"}
                    </p>
                    <p className="text-sm font-normal text-[#000000] mt-1 capitalize">
                      Address: {item?.doctorAddress || "NA"}
                    </p>
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
      <button
        type="submit"
        className="w-full bg-[#00BCD4] text-[#212121] py-3.5 rounded-xl font-semibold mt-2 cursor-pointer flex items-center justify-center gap-2"
        onClick={() => {
          setModalMode("add");
          setSelectedPrimaryCareProvider(null);
          setOpenAddPrimaryCareModal(true);
        }}
      >
        <span className="text-xl leading-none">+</span>
        <span>Add Care Provider</span>
      </button>

      <AddPrimaryCareProvider
        isOpen={openAddPrimaryCareModal}
        onClose={() => setOpenAddPrimaryCareModal(false)}
        onSuccess={() => {
          setPage(1);
          refetch();
          setOpenAddPrimaryCareModal(false);
          setIsSuccessOpen(true);
        }}
        mode={modalMode}
        initialData={selectedPrimaryCareProvider}
        setSelectedPrimaryCareProvider={() =>
          setSelectedPrimaryCareProvider(null)
        }
      />

      <PrimaryCareDeleteModal
        isOpen={openDeletePrimaryCareModal}
        onClose={() => setOpenDeletePrimaryCareModal(false)}
        onSuccess={() => {
          refetch(), setPage(1);
        }}
        primaryCareProviderId={primaryCareProviderId}
      />

      <CommonSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        desc={
          modalMode === "edit"
            ? "Your Care Provider information has been updated successfully."
            : "Your Care Provider information has been saved successfully."
        }
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
    </div>
  );
};

export default PrimaryCare;
