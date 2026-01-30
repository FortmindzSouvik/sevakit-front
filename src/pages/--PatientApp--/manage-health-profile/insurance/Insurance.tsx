import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import MenuPopover from "@/components/menu-popover/MenuPopover";
import AddInsurance from "./component/AddInsurance";
import InsuranceDeleteModal from "./component/InsuranceDeleteModal";
import ScanInsurance from "./component/ScanInsurance";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useFetchData } from "@/hooks/useFetchData";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";
import { useAppSelector } from "@/redux/store";
import SkeletonCard from "@/components/skeletonLoader/SkeletonCard";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { formatDate, isImage, isPdf } from "@/lib/utils";

const Insurance = () => {
  const navigate = useNavigate();
  const [openDeleteInsuranceModal, setOpenDeleteInsuranceModal] =
    useState(false);
  const [openAddInsuranceModal, setOpenAddInsuranceModal] = useState(false);
  const [openScanInsuranceModal, setOpenScanInsuranceModal] = useState(false);
  const [page, setPage] = useState(1);
  const [insurance, setInsurance] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [modalUpldMode, setModalUpldMode] = useState<"add" | "edit">("add");
  const [selectedInsurance, setSelectedInsurance] = useState<any | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [insuranceId, setInsuranceId] = useState("");
  const [isUploadSuccessOpen, setIsUploadSuccessOpen] = useState(false);

  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";

  const { isVisible, toggleVisibility, isUpdating } = useSectionVisibility(
    userId,
    "isInsuranceVisible"
  );

  const { data, isFetching, refetch } = useFetchData(
    `${apiRoutes.getInsuranceList}?page=${page}&limit=8&sortBy=createdAt:desc`,
    ["getInsuranceList", page],
    true
  );
  const totalPages = data?.data?.totalPages ?? 1;

  useEffect(() => {
    if (data?.data?.results) {
      setInsurance((prev) =>
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

  const DocumentPreview = ({ url, label }: { url?: string; label: string }) => {
    if (!url) return null;

    const pdf = isPdf(url);
    const image = isImage(url);

    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="w-28 h-20 border rounded-lg flex items-center justify-center bg-[#F9FAFB] hover:bg-[#F0F9FF] transition overflow-hidden"
      >
        {image ? (
          <img src={url} alt={label} className="w-full h-full object-cover" />
        ) : pdf ? (
          <iframe
            src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
            title={`${label} PDF`}
            className="w-full h-full"
          />
        ) : (
          <span className="text-xs text-gray-500">Unsupported</span>
        )}
      </a>
    );
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
          Insurance
        </h1>
      </div>
      {/* insurance card */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src="/../icons/compliance-document-icon.svg"
              className="w-fit h-fit"
            />
            <h2 className="text-base font-semibold">Insurance</h2>
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
              id="insurance-switch"
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
          {!isFetching && insurance.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              No insurance added yet.
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
          {insurance.map((item) => {
            const hasUploadedDocs =
              item?.frontImage?.fileUrl || item?.backImage?.fileUrl;

            return (
              <div key={item?.id} className="bg-[#FFFFFF] rounded-2xl p-4 mb-4">
                <div className="flex items-start justify-between gap-3">
                  {/* LEFT CONTENT */}
                  <div className="flex-1">
                    {/* CASE 1: IMAGE / PDF UPLOADED */}
                    {hasUploadedDocs ? (
                      <>
                        <h3 className="text-base font-semibold text-[#00AEC7] mb-2">
                          Insurance Card
                        </h3>

                        <div className="flex gap-3">
                          <DocumentPreview
                            url={item?.frontImage?.fileUrl}
                            label="Front"
                          />

                          <DocumentPreview
                            url={item?.backImage?.fileUrl}
                            label="Back"
                          />
                        </div>
                      </>
                    ) : (
                      /* CASE 2: MANUAL ENTRY */
                      <>
                        <h3 className="text-base font-semibold text-[#00AEC7]">
                          {item?.providerName}
                        </h3>

                        <p className="text-sm mt-1">
                          Member ID: {item?.memberId}
                        </p>

                        <p className="text-sm mt-1">
                          Group ID: {item?.groupId}
                        </p>

                        {item?.expirationDate && (
                          <p className="text-sm mt-1">
                            Expires: {formatDate(item?.expirationDate)}
                          </p>
                        )}

                        {item?.customerServiceContact && (
                          <p className="text-sm mt-1">
                            Support: {item?.customerServiceContact}
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* RIGHT SIDE BADGE */}
                  {item?.primaryInsuredName &&
                    item?.primaryInsuredName !== "" && (
                      <span className="px-2 py-1 text-xs rounded-full bg-[#B9F2F8]">
                        {item.primaryInsuredName}
                      </span>
                    )}

                  {/* MENU */}
                  {hasUploadedDocs ? (
                    <MenuPopover
                      triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                      onEdit={() => {
                        setModalUpldMode("edit");
                        setSelectedInsurance(item);
                        setOpenScanInsuranceModal(true);
                      }}
                      onDelete={() => {
                        setInsuranceId(item?.id);
                        setOpenDeleteInsuranceModal(true);
                      }}
                    />
                  ) : (
                    <MenuPopover
                      triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                      onEdit={() => {
                        setModalMode("edit");
                        setSelectedInsurance(item);
                        setOpenAddInsuranceModal(true);
                      }}
                      onDelete={() => {
                        setInsuranceId(item?.id);
                        setOpenDeleteInsuranceModal(true);
                      }}
                    />
                  )}
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
          setSelectedInsurance(null);
          setOpenAddInsuranceModal(true);
        }}
      >
        <span className="text-xl leading-none">+</span>
        <span>Add Insurance Card Manually</span>
      </button>

      <button
        type="submit"
        className="w-full bg-[#FFFFFF] text-[#009FB6] border border-[#00BCD4] py-3.5 rounded-xl font-semibold mt-2 cursor-pointer flex items-center justify-center gap-2"
        onClick={() => {
          setModalUpldMode("add");
          setSelectedInsurance(null);
          setOpenScanInsuranceModal(true);
        }}
      >
        <img
          className="text-xl leading-none"
          alt="upload"
          src="/../icons/upload-colr-icon.svg"
        />
        <span>Scan insurance Card</span>
      </button>

      <AddInsurance
        isOpen={openAddInsuranceModal}
        onClose={() => setOpenAddInsuranceModal(false)}
        onSuccess={() => {
          setPage(1);
          refetch();
          setOpenAddInsuranceModal(false);
          setIsSuccessOpen(true);
        }}
        mode={modalMode}
        initialData={selectedInsurance}
        setSelectedInsurance={() => setSelectedInsurance(null)}
      />

      <ScanInsurance
        isOpen={openScanInsuranceModal}
        onClose={() => setOpenScanInsuranceModal(false)}
        onSuccess={() => {
          setPage(1);
          refetch();
          setOpenScanInsuranceModal(false);
          setIsUploadSuccessOpen(true);
        }}
        mode={modalUpldMode}
        initialData={selectedInsurance}
        setSelectedInsurance={() => setSelectedInsurance(null)}
      />

      <InsuranceDeleteModal
        isOpen={openDeleteInsuranceModal}
        onClose={() => setOpenDeleteInsuranceModal(false)}
        onSuccess={() => {
          refetch(), setPage(1);
        }}
        insuranceId={insuranceId}
      />

      <CommonSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        desc={
          modalMode === "edit"
            ? "Your insurance information has been updated successfully."
            : "Your insurance information has been saved successfully."
        }
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
      <CommonSuccessModal
        isOpen={isUploadSuccessOpen}
        onClose={() => setIsUploadSuccessOpen(false)}
        desc={
          modalUpldMode === "edit"
            ? "Your insurance document has been updated successfully."
            : "Your insurance document has been added successfully."
        }
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
    </div>
  );
};

export default Insurance;
