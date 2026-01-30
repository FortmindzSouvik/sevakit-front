import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import MenuPopover from "@/components/menu-popover/MenuPopover";
import AddPharmacy from "./component/AddPharmacy";
import PharmacyDeleteModal from "./component/PharmacyDeleteModal";
import SkeletonCard from "@/components/skeletonLoader/SkeletonCard";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useFetchData } from "@/hooks/useFetchData";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";
import { useAppSelector } from "@/redux/store";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { formatPhoneNumber } from "@/lib/utils";

const Pharmacy = () => {
  const navigate = useNavigate();
  const [openDeletePharmacyModal, setOpenDeletePharmacyModal] = useState(false);
  const [openAddPharmacyModal, setOpenAddPharmacyModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pharmacy, setPharmacy] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedPharmacy, setSelectedPharmacy] = useState<any | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [pharmacyId, setPharmacyId] = useState("");

  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";

  const { isVisible, toggleVisibility, isUpdating } = useSectionVisibility(
    userId,
    "isPharmacyVisible"
  );

  const { data, isFetching, refetch } = useFetchData(
    `${apiRoutes.getPharmacyList}?page=${page}&limit=8&sortBy=createdAt:desc`,
    ["getPharmacyList", page],
    true
  );
  const totalPages = data?.data?.totalPages ?? 1;

  useEffect(() => {
    if (data?.data?.results) {
      setPharmacy((prev) =>
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
          Pharmacy
        </h1>
      </div>
      {/* card */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src="/../icons/pharmacys-icon.svg" className="w-fit h-fit" />
            <h2 className="text-base font-semibold"> Pharmacy</h2>
          </div>

          {/* Toggle */}
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
              id="pharmacy-switch"
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
          {!isFetching && pharmacy.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              No pharmacy is added yet.
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
          {/* phrnmacy Card */}
          {pharmacy?.map((item) => {
            return (
              <div
                key={item?.id}
                className="bg-[#FFFFFF] rounded-2xl p-4 mb-4 "
              >
                <div className="flex items-start justify-between">
                  {/* Title + Start Date */}
                  <div className="font-mona w-full">
                    <div className="flex items-start justify-between">
                      <h3 className="text-base font-semibold text-[#00AEC7]">
                        {item?.pharmacyName || "NA"}
                      </h3>
                      {/* Menu Button */}
                      <MenuPopover
                        triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                        onEdit={() => {
                          setModalMode("edit");
                          setSelectedPharmacy(item);
                          setOpenAddPharmacyModal(true);
                        }}
                        onDelete={() => {
                          setPharmacyId(item?.id);
                          setOpenDeletePharmacyModal(true);
                        }}
                      />
                    </div>

                    <p className="text-base font-normal text-[#000000] mt-1">
                      Address: {item?.pharmacyAddress || "NA"}
                    </p>
                    <p className="text-base font-medium text-[#000000] mt-1 ">
                      <span className="font-medium">Phone: </span>
                      {formatPhoneNumber(item?.pharmacyPhone) || "NA"}
                    </p>
                    <div></div>
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
          setSelectedPharmacy(null);
          setOpenAddPharmacyModal(true);
        }}
      >
        <span className="text-xl leading-none">+</span>
        <span>Add Pharmacy</span>
      </button>

      <AddPharmacy
        isOpen={openAddPharmacyModal}
        onClose={() => setOpenAddPharmacyModal(false)}
        onSuccess={() => {
          setPage(1);
          refetch();
          setOpenAddPharmacyModal(false);
          setIsSuccessOpen(true);
        }}
        mode={modalMode}
        initialData={selectedPharmacy}
        setSelectedPharmacy={() => setSelectedPharmacy(null)}
      />

      <PharmacyDeleteModal
        isOpen={openDeletePharmacyModal}
        onClose={() => setOpenDeletePharmacyModal(false)}
        onSuccess={() => {
          refetch(), setPage(1);
        }}
        pharmacyId={pharmacyId}
      />

      <CommonSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        desc={
          modalMode === "edit"
            ? "Your Pharmacy information has been updated successfully."
            : "Your Pharmacy information has been saved successfully."
        }
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
    </div>
  );
};

export default Pharmacy;
