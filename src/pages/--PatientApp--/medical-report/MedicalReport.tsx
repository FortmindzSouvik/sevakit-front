import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import MenuPopover from "@/components/menu-popover/MenuPopover";
import AddMedicalReport from "./component/AddMedicalReport";
import MedicalReportDeleteModal from "./component/MedicalReportDeleteModal";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useFetchData } from "@/hooks/useFetchData";
import SkeletonCard from "@/components/skeletonLoader/SkeletonCard";
import { formatDate } from "@/lib/utils";

const MedicalReport = () => {
  const navigate = useNavigate();
  const [openDeleteMedicalReportModal, setOpenDeleteMedicalReportModal] =
    useState(false);
  const [openAddMedicalReportModal, setOpenAddMedicalReportModal] =
    useState(false);

  const [page, setPage] = useState(1);
  const [medicalReport, setMedicalReport] = useState<any[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [medicalReportId, setMedicalReportId] = useState("");
  const [globalMedicalReportId, setGlobalMedicalReportId] = useState("");

  const { data, isFetching, refetch } = useFetchData(
    `${apiRoutes.getMedicalReportList}?page=${page}&limit=8&sortBy=createdAt:desc`,
    ["getMedicalReportList", page],
    true
  );
  const totalPages = data?.data?.totalPages ?? 1;

  useEffect(() => {
    if (!data?.data?.results?.length) return;

    const fetchedFiles = data?.data?.results.flatMap(
      (item: any) => item.files || []
    );

    setMedicalReport((prev) =>
      page === 1 ? fetchedFiles : [...prev, ...fetchedFiles]
    );

    if (!medicalReportId) {
      setGlobalMedicalReportId(data?.data?.results[0]?.id);
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
          Medical Reports
        </h1>
      </div>

      {/* btn */}
      <button
        type="submit"
        className="w-full bg-[#FFFFFF] text-[#009FB6] border border-[#00BCD4] py-3.5 rounded-xl font-semibold mt-2 cursor-pointer flex items-center justify-center gap-2"
        onClick={() => setOpenAddMedicalReportModal(true)}
      >
        <span>Upload Report</span>
        <img
          className="text-xl leading-none"
          src="/../icons/upload-colr-icon.svg"
        />
      </button>

      {/* report card */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold">Reports</h2>
          </div>
        </div>
        <div
          ref={listRef}
          onScroll={handleScroll}
          className="max-h-[420px] overflow-y-auto pr-1 scrollbar-hide"
        >
          {/* EMPTY */}
          {!isFetching && medicalReport.length === 0 && (
            <p className="text-center text-sm text-gray-500">
              No medical report added yet.
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
          {medicalReport?.map((item) => {
            const isPdf = (url?: string) => {
              if (!url) return false;
              return url.toLowerCase().endsWith(".pdf");
            };
            return (
              <div
                key={item?._id}
                className="bg-[#FFFFFF] rounded-2xl p-4 mb-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-18 h-24 shrink-0 overflow-hidden rounded-lg border bg-white mx-1 flex items-center justify-center">
                    {isPdf(item?.fileUrl) ? (
                      <iframe
                        src={`${item?.fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                        className="w-full h-full scale-[1.2] origin-top-left pointer-events-none"
                        style={{ border: "none" }}
                      />
                    ) : (
                      <img
                        src={item?.fileUrl}
                        alt={item?.title || "Medical Report"}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>

                  {/* Title + Start Date */}
                  <div className="font-mona">
                    <h3 className="text-base font-semibold text-[#000000]">
                      {item?.title || "NA"}
                    </h3>
                    <p className="text-sm font-normal text-[#000000] mt-1">
                      Posted: {formatDate(item?.recordDate) || "NA"}
                    </p>
                    <p className="text-sm font-normal text-[#000000] mt-1">
                      Uploaded by: {item?.uploadedBy || "NA"}
                    </p>
                  </div>

                  <button
                    className={`px-2 py-1.5 rounded font-mona font-medium text-xs  bg-[#B9F2F8] text-[#000000] `}
                  >
                    {item?.documentType || "NA"}
                  </button>

                  {/* Menu Button */}
                  <MenuPopover
                    triggerIcon="/../icons/menu-dots-vertical-icon.svg"
                    onDownload={() => console.log("Download")}
                    onDelete={() => {
                      setMedicalReportId(item?._id);
                      setOpenDeleteMedicalReportModal(true);
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
      <AddMedicalReport
        isOpen={openAddMedicalReportModal}
        onClose={() => setOpenAddMedicalReportModal(false)}
        onSuccess={() => {
          setPage(1);
          refetch();
          setMedicalReport([]);
          setOpenAddMedicalReportModal(false);
          setIsSuccessOpen(true);
        }}
        hasReports={medicalReport.length > 0}
        globalMedicalReportId={globalMedicalReportId}
      />

      <MedicalReportDeleteModal
        isOpen={openDeleteMedicalReportModal}
        onClose={() => setOpenDeleteMedicalReportModal(false)}
        onSuccess={() => {
          refetch(), setPage(1), setMedicalReportId("");
        }}
        medicalReportId={medicalReportId}
        globalMedicalReportId={globalMedicalReportId}
      />
      <CommonSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        desc={"Your Medical Report information has been saved successfully."}
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
    </div>
  );
};

export default MedicalReport;
