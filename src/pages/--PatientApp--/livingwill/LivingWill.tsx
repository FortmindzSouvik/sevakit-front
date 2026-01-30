import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import AddLivingWill from "./component/AddLivingWill";
import LivingWillDeleteModal from "./component/LivingWillDeleteModal";
import MenuPopover from "@/components/menu-popover/MenuPopover";
import { Switch } from "@/components/ui/switch";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";
import { useAppSelector } from "@/redux/store";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useFetchData } from "@/hooks/useFetchData";
import SkeletonCard from "@/components/skeletonLoader/SkeletonCard";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";

const LivingWill = () => {
  const navigate = useNavigate();
  const [openDeleteLivingWillModal, setOpenDeleteLivingWillModal] =
    useState(false);
  const [openAddLivingWillModal, setOpenAddLivingWillModal] = useState(false);

  const [page, setPage] = useState(1);
  const [advancePlan, setAdvancePlan] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedLivingWill, setSelectedLivingWill] = useState<any | null>(
    null
  );
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [livingWillId, setLivingWillId] = useState("");

  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";

  const { isVisible, toggleVisibility, isUpdating } = useSectionVisibility(
    userId,
    "isWillVisible"
  );

  const { data, isFetching, refetch } = useFetchData(
    `${apiRoutes.getLivingWillList}?page=${page}&limit=8&sortBy=createdAt:desc`,
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

  const handleView = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
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
          Living Will
        </h1>
      </div>

      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src="/../icons/living-wills-icon.svg"
              className="w-fit h-fit"
            />
            <h2 className="text-base font-semibold"> Living Will</h2>
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
              id="living-will-switch"
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
              No living will is added yet.
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
          {advancePlan?.map((item) => {
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
                        Living Will Summary
                      </h3>
                      {/* Menu Button */}
                      <MenuPopover
                        triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                        onEdit={() => {
                          setModalMode("edit");
                          setSelectedLivingWill(item);
                          setOpenAddLivingWillModal(true);
                        }}
                        onDelete={() => {
                          setLivingWillId(item?.id);
                          setOpenDeleteLivingWillModal(true);
                        }}
                      />
                    </div>
                    <p className="text-base font-normal text-[#000000] mt-1">
                      {item?.summary || "NA"}
                    </p>

                    <div>
                      <div className="w-full border-t border-[#ECECEC] mt-3"></div>
                      {/* Attachments */}
                      <div className="space-y-2 text-sm p-2">
                        <p className="text-[##000000] font-medium text-sm">
                          Documents
                        </p>
                        {Array.isArray(item?.documents) &&
                        item.documents.length > 0 ? (
                          item.documents.map((doc: any) => (
                            <div
                              key={doc?.id || doc?.fileUrl}
                              className="flex items-center justify-between font-mona"
                            >
                              <span className="text-[#000000] text-[11px] font-medium">
                                {doc?.fileName || "Document"}
                              </span>

                              <div className="flex gap-2">
                                <button
                                  className="cursor-pointer text-[#00BCD4]"
                                  onClick={() => handleView(doc.fileUrl)}
                                >
                                  View
                                </button>
                                <span className="text-[#AFAFAF]">|</span>
                                <button
                                  className="cursor-pointer text-[#009FB6]"
                                  onClick={() =>
                                    handleDownload(doc.fileUrl, doc.fileName)
                                  }
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-gray-400">
                            No documents uploaded
                          </p>
                        )}
                      </div>
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
      <button
        type="submit"
        className="w-full bg-[#00BCD4] text-[#212121] py-3.5 rounded-xl font-semibold mt-2 cursor-pointer flex items-center justify-center gap-2"
        onClick={() => {
          setModalMode("add");
          setSelectedLivingWill(null);
          setOpenAddLivingWillModal(true);
        }}
      >
        <span className="text-xl leading-none">+</span>
        <span>Add Living Will</span>
      </button>

      <AddLivingWill
        isOpen={openAddLivingWillModal}
        onClose={() => setOpenAddLivingWillModal(false)}
        onSuccess={() => {
          setPage(1);
          refetch();
          setOpenAddLivingWillModal(false);
          setIsSuccessOpen(true);
        }}
        mode={modalMode}
        initialData={selectedLivingWill}
        setSelectedLivingWill={() => setSelectedLivingWill(null)}
      />

      <LivingWillDeleteModal
        isOpen={openDeleteLivingWillModal}
        onClose={() => setOpenDeleteLivingWillModal(false)}
        onSuccess={() => {
          refetch(), setPage(1);
        }}
        livingWillId={livingWillId}
      />

      <CommonSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        desc={
          modalMode === "edit"
            ? "Your living will information has been updated successfully."
            : "Your living will information has been saved successfully."
        }
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
    </div>
  );
};

export default LivingWill;
