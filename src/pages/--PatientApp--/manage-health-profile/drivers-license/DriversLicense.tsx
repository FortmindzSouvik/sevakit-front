import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import MenuPopover from "@/components/menu-popover/MenuPopover";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useFetchData } from "@/hooks/useFetchData";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";
import { useAppSelector } from "@/redux/store";
import SkeletonCard from "@/components/skeletonLoader/SkeletonCard";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { formatDate, isImage, isPdf } from "@/lib/utils";
import AddDriversLicense from "./component/AddDriversLicense";
import DriversLicenseDeleteModal from "./component/DriversLicenseDeleteModal";
import ScanDrivingLicense from "./component/ScanDrivingLicense";

const DriversLicense = () => {
  const navigate = useNavigate();
  const [openDeleteDriversLicenseModal, setOpenDeleteDriversLicenseModal] =
    useState(false);
  const [openAddDriversLicenseModal, setOpenAddDriversLicenseModal] =
    useState(false);
  const [openScanDLModal, setOpenScanDLModal] = useState(false);
  const [page, setPage] = useState(1);
  const [drivingLicense, setDrivingLicense] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [modalUpldMode, setModalUpldMode] = useState<"add" | "edit">("add");
  const [selectedDrivingLicense, setSelectedDrivingLicense] = useState<
    any | null
  >(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [drivingLicenseId, setDrivingLicenseId] = useState("");
  const [isUploadSuccessOpen, setIsUploadSuccessOpen] = useState(false);

  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";

  const { isVisible, toggleVisibility, isUpdating } = useSectionVisibility(
    userId,
    "isDrivingLicenseVisible"
  );

  const { data, isFetching, refetch } = useFetchData(
    `${apiRoutes.getDrivingLicenseList}?page=${page}&limit=8&sortBy=createdAt:desc`,
    ["getDrivingLicenseList", page],
    true
  );
  const totalPages = data?.data?.totalPages ?? 1;

  useEffect(() => {
    if (data?.data?.results) {
      setDrivingLicense((prev) =>
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
          Driver’s License
        </h1>
      </div>
      {/*  Driver’s License card */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src="/../icons/compliance-document-icon.svg"
              className="w-fit h-fit"
            />
            <h2 className="text-base font-semibold"> Driver’s License</h2>
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
              id="driving-switch"
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
          {!isFetching && drivingLicense.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              No driver's license added yet.
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
          {/* driving Card */}
          {drivingLicense.map((item) => {
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
                          Driver's License
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
                          {item?.fullName}
                        </h3>
                        <p className="text-base font-normal text-[#000000] mt-1">
                          License Number: {item?.licenseNumber}
                        </p>
                        <p className="text-base font-normal text-[#000000] mt-1">
                          State: {item?.issuingState}
                        </p>
                        <p className="text-base font-normal text-[#000000] mt-1">
                          Expiration Date: {formatDate(item?.expirationDate)}
                        </p>
                      </>
                    )}
                  </div>

                  {/* MENU */}
                  {hasUploadedDocs ? (
                    <MenuPopover
                      triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                      onEdit={() => {
                        setModalUpldMode("edit");
                        setSelectedDrivingLicense(item);
                        setOpenScanDLModal(true);
                      }}
                      onDelete={() => {
                        setDrivingLicenseId(item?.id);
                        setOpenDeleteDriversLicenseModal(true);
                      }}
                    />
                  ) : (
                    <MenuPopover
                      triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                      onEdit={() => {
                        setModalMode("edit");
                        setSelectedDrivingLicense(item);
                        setOpenAddDriversLicenseModal(true);
                      }}
                      onDelete={() => {
                        setDrivingLicenseId(item?.id);
                        setOpenDeleteDriversLicenseModal(true);
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
          setSelectedDrivingLicense(null);
          setOpenAddDriversLicenseModal(true);
        }}
      >
        <span className="text-xl leading-none">+</span>
        <span>Add Driver’s License Manually</span>
      </button>

      <button
        type="submit"
        className="w-full bg-[#FFFFFF] text-[#009FB6] border border-[#00BCD4] py-3.5 rounded-xl font-semibold mt-2 cursor-pointer flex items-center justify-center gap-2"
        onClick={() => {
          setModalUpldMode("add");
          setSelectedDrivingLicense(null);
          setOpenScanDLModal(true);
        }}
      >
        <img
          className="text-xl leading-none"
          alt="upload"
          src="/../icons/upload-colr-icon.svg"
        />
        <span>Scan Diver's License</span>
      </button>

      <AddDriversLicense
        isOpen={openAddDriversLicenseModal}
        onClose={() => setOpenAddDriversLicenseModal(false)}
        onSuccess={() => {
          setPage(1);
          refetch();
          setOpenAddDriversLicenseModal(false);
          setIsSuccessOpen(true);
        }}
        mode={modalMode}
        initialData={selectedDrivingLicense}
        setSelectedDrivingLicense={() => setSelectedDrivingLicense(null)}
      />

      <ScanDrivingLicense
        isOpen={openScanDLModal}
        onClose={() => setOpenScanDLModal(false)}
        onSuccess={() => {
          setPage(1);
          refetch();
          setOpenScanDLModal(false);
          setIsUploadSuccessOpen(true);
        }}
        mode={modalUpldMode}
        initialData={selectedDrivingLicense}
        setSelectedDrivingLicense={() => setSelectedDrivingLicense(null)}
      />

      <DriversLicenseDeleteModal
        isOpen={openDeleteDriversLicenseModal}
        onClose={() => setOpenDeleteDriversLicenseModal(false)}
        onSuccess={() => {
          refetch(), setPage(1);
        }}
        drivingLicenseId={drivingLicenseId}
      />

      <CommonSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        desc={
          modalMode === "edit"
            ? "Your driving license information has been updated successfully."
            : "Your driving license information has been saved successfully."
        }
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
      <CommonSuccessModal
        isOpen={isUploadSuccessOpen}
        onClose={() => setIsUploadSuccessOpen(false)}
        desc={
          modalUpldMode === "edit"
            ? "Your driving license has been updated successfully."
            : "Your driving license has been added successfully."
        }
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
    </div>
  );
};

export default DriversLicense;
