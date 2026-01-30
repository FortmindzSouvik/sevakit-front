import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import MenuPopover from "@/components/menu-popover/MenuPopover";
import AddDriversLicense from "./component/AddDriversLicense";
import DriversLicenseDeleteModal from "./component/DriversLicenseDeleteModal";
import DocumentUpload from "@/components/form/DocumentUpload";
import { useAppSelector } from "@/redux/store";
import { useSectionVisibility } from "@/hooks/useSectionVisibility";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useFetchData } from "@/hooks/useFetchData";
import SkeletonCard from "@/components/skeletonLoader/SkeletonCard";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { formatDate } from "@/lib/utils";
import { useFileUpload } from "@/hooks/useFileUpload";

const DriversLicense = () => {
  const navigate = useNavigate();
  // const [frontFile, setFrontFile] = useState<File | null>(null);
  // const [backFile, setBackFile] = useState<File | null>(null);

  // const [frontPreview, setFrontPreview] = useState<string | null>(null);
  // const [backPreview, setBackPreview] = useState<string | null>(null);

  const [openDeleteDriversLicenseModal, setOpenDeleteDriversLicenseModal] =
    useState(false);
  const [openAddDriversLicenseModal, setOpenAddDriversLicenseModal] =
    useState(false);

  const [page, setPage] = useState(1);
  const [drivingLicense, setDrivingLicense] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedDrivingLicense, setSelectedDrivingLicense] = useState<
    any | null
  >(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [drivingLicenseId, setDrivingLicenseId] = useState("");

  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";

  const { isVisible, toggleVisibility, isUpdating } = useSectionVisibility(
    userId,
    "isDrivingLicenseVisible"
  );

  const {
    isVisible: isDocVisible,
    toggleVisibility: toggleDocVisibility,
    isUpdating: isDocUpdating,
  } = useSectionVisibility(userId, "isDrivingLicenseDocumentsVisible");

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

  // useEffect(() => {
  //   return () => {
  //     if (frontPreview) URL.revokeObjectURL(frontPreview);
  //     if (backPreview) URL.revokeObjectURL(backPreview);
  //   };
  // }, [frontPreview, backPreview]);

  const [frontDoc, setFrontDoc] = useState<{
    file: File | null;
    preview: string | null;
    uploadedUrl?: string;
  }>({
    file: null,
    preview: null,
  });

  const [backDoc, setBackDoc] = useState<{
    file: File | null;
    preview: string | null;
    uploadedUrl?: string;
  }>({
    file: null,
    preview: null,
  });
  const [uploadingSide, setUploadingSide] = useState<"front" | "back" | null>(
    null
  );

  const { mutateAsync: uploadFile } = useFileUpload([
    "upload-documents",
  ]);

  const handleFrontUpload = async (file: File | null) => {
    setUploadingSide("front");
    if (!file) {
      setFrontDoc({ file: null, preview: null });
      return;
    }

    const res = await uploadFile({
      path: apiRoutes.uploadUrl,
      file,
    });

    setFrontDoc({
      file,
      preview: URL.createObjectURL(file),
      uploadedUrl: res?.data?.fileUrl,
    });
    setUploadingSide(null);
  };

  const handleBackUpload = async (file: File | null) => {
    setUploadingSide("back");
    if (!file) {
      setBackDoc({ file: null, preview: null });
      return;
    }

    const res = await uploadFile({
      path: apiRoutes.uploadUrl,
      file,
    });

    setBackDoc({
      file,
      preview: URL.createObjectURL(file),
      uploadedUrl: res?.data?.fileUrl,
    });
    setUploadingSide(null);
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
      {/* drivers license manual */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src="/../icons/id-badge-icon.svg" className="w-fit h-fit" />
            <h2 className="text-base font-semibold">Driver’s License</h2>
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
            return (
              <div key={item?.id} className="bg-[#FFFFFF] rounded-2xl p-4 ">
                <div className="flex items-start justify-between">
                  {/* Title + Start Date */}
                  <div className="font-mona">
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
                  </div>

                  {/* Menu Button */}
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

      {/* ducument section start */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src="/../icons/docu-icon.svg" className="w-fit h-fit" />
            <h2 className="text-base font-semibold">Document </h2>
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
              id="driving-license-document"
              className="w-12 h-6"
              checked={isDocVisible}
              disabled={isDocUpdating}
              onCheckedChange={toggleDocVisibility}
            />
          </div>
        </div>

        <div className=" w-full bg-white">
          <DocumentUpload
            label="Upload License Front"
            file={frontDoc.file}
            preview={frontDoc.preview}
            onChange={handleFrontUpload}
            onPreviewChange={() => {}}
            isUploading={uploadingSide === "front"}
          />
          <DocumentUpload
            label="Upload License Back"
            file={backDoc.file}
            preview={backDoc.preview}
            onChange={handleBackUpload}
            onPreviewChange={() => {}}
            isUploading={uploadingSide === "back"}
          />
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
    </div>
  );
};

export default DriversLicense;


