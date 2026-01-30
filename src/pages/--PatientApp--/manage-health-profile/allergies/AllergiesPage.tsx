import MenuPopover from "@/components/menu-popover/MenuPopover";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import AddNewAllergies from "./component/AddNewAllergies";
import AllergyDeleteModal from "./component/AllergyDeleteModal";
import { useFetchData } from "@/hooks/useFetchData";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import SkeletonCard from "@/components/skeletonLoader/SkeletonCard";
import { useAppSelector } from "@/redux/store";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";

const AllergiesPage = () => {
  const navigate = useNavigate();
  const listRef = useRef<HTMLDivElement | null>(null);

  const [openNewAddAllergiesModal, setOpenNewAddAllergiesModal] =
    useState(false);
  const [openDeleteAllergyModal, setOpenDeleteAllergyModal] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [allergies, setAllergies] = useState<any[]>([]);
  const [selectedAllergy, setSelectedAllergy] = useState<any | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [allerygyId, setAllerygyId] = useState("");

  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";

  const { isVisible, toggleVisibility, isUpdating } = useSectionVisibility(
    userId,
    "isAllergiesVisible"
  );

  /* ---------------- FETCH API ---------------- */
  const { data, isFetching, refetch } = useFetchData(
    `${apiRoutes.getAllergiesList}?page=${page}&limit=8&sortBy=createdAt:desc`,
    ["getAllergiesList", page],
    true
  );

  const totalPages = data?.data?.totalPages ?? 1;

  /* ---------------- APPEND DATA ---------------- */
  useEffect(() => {
    if (data?.data?.results) {
      setAllergies((prev) =>
        page === 1 ? data?.data?.results : [...prev, ...data?.data?.results]
      );
    }
  }, [data, page]);

  /* ---------------- INFINITE SCROLL ---------------- */
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (isFetching) return;

  //     const nearBottom =
  //       window.innerHeight + window.scrollY >=
  //       document.documentElement.scrollHeight - 150;

  //     if (nearBottom && page < totalPages) {
  //       setPage((prev) => prev + 1);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, [isFetching, page, totalPages]);

  const handleScroll = () => {
    if (!listRef.current || isFetching) return;

    const { scrollTop, scrollHeight, clientHeight } = listRef.current;

    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;

    if (isNearBottom && page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Severe":
        return "text-[#FF0000]";
      case "Moderate":
        return "text-[#E5B122]";
      case "Mild":
        return "text-[#00A86B]";
      default:
        return "text-[#212121]";
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5 font-mona">
      {/* HEADER */}
      <div className="flex items-center justify-center relative mb-8">
        <button className="absolute left-0">
          <img
            src="/../icons/back-arrow-icon.svg"
            alt="back"
            className="w-fit h-fit cursor-pointer"
            onClick={() =>
              navigate(`/${ROUTES.role.patient}/${ROUTES.patient.dashboard}`)
            }
          />
        </button>
        <h1 className="text-base font-medium">Allergies</h1>
      </div>

      {/* CARD */}
      <div className="bg-[#F7FDFF] p-5 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold">Allergies</h2>

          <div className="flex items-center gap-2">
            <button
              className={`px-4 py-1 rounded-full font-medium text-sm
                ${
                  isVisible
                    ? "border border-[#00A9B8] bg-[#B9F2F8] text-[#000000]"
                    : "border border-[#E0E0E0] bg-[#E0E0E0] text-[#000000]"
                }`}
            >
              {isVisible ? "Visible" : "Hidden"}
            </button>

            <Switch
              id="allergies-switch"
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
          {!isFetching && allergies.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              No allergies added yet.
            </p>
          )}
          {/* SKELETON */}
          {isFetching && page === 1 && (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          )}
          {/* LIST */}
          {allergies.map((item) => (
            <div
              key={item.id}
              className="bg-[#FFFFFF] px-4 py-3 rounded-3xl mb-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#009FB6]">
                    {item.allergenName}
                  </h3>

                  <p className="mt-2">
                    <span className="font-semibold">Reaction: </span>
                    {item.reactionType}
                  </p>

                  <p className="mt-1">
                    <span className="font-semibold">Severity: </span>
                    <span
                      className={`font-semibold ${getSeverityColor(
                        item.severity
                      )}`}
                    >
                      {item.severity}
                    </span>
                  </p>
                  {item.notes && (
                    <div className="mt-4 bg-[#B9F2F8] px-4 py-2 rounded-xl w-fit">
                      {" "}
                      <p className="text-sm">Notes: “{item.notes}”</p>{" "}
                    </div>
                  )}
                </div>

                <MenuPopover
                  triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                  onEdit={() => {
                    setModalMode("edit");
                    setSelectedAllergy(item);
                    setOpenNewAddAllergiesModal(true);
                  }}
                  onDelete={() => {
                    setAllerygyId(item?.id);
                    setOpenDeleteAllergyModal(true);
                  }}
                />
              </div>
            </div>
          ))}

          {/* BOTTOM LOADER */}
          {isFetching && (
            // <div className="flex justify-center py-6">
            //   <Loader2 className="w-6 h-6 animate-spin text-[#00BCD4]" />
            // </div>
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </>
          )}
        </div>
      </div>

      {/* ADD */}
      <button
        onClick={() => {
          setModalMode("add");
          setSelectedAllergy(null);
          setOpenNewAddAllergiesModal(true);
        }}
        className="flex items-center justify-center w-full bg-[#00BCD4] py-3.5 rounded-xl font-semibold cursor-pointer"
      >
        + Add Allergies
      </button>

      {/* MODALS */}
      <AddNewAllergies
        isOpen={openNewAddAllergiesModal}
        onClose={() => {
          setOpenNewAddAllergiesModal(false);
        }}
        onSuccess={() => {
          setPage(1);
          refetch();
          setOpenNewAddAllergiesModal(false);
          setIsSuccessOpen(true);
        }}
        mode={modalMode}
        initialData={selectedAllergy}
        setSelectedAllergy={() => setSelectedAllergy(null)}
      />

      <AllergyDeleteModal
        isOpen={openDeleteAllergyModal}
        onClose={() => setOpenDeleteAllergyModal(false)}
        onSuccess={() => {
          refetch(), setPage(1);
        }}
        allergyId={allerygyId}
      />

      <CommonSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        desc={
          modalMode === "edit"
            ? "Your allergy information has been updated successfully."
            : "Your allergy information has been saved successfully."
        }
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
    </div>
  );
};

export default AllergiesPage;
