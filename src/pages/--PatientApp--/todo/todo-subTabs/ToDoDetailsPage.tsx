import { useNavigate, useSearchParams } from "react-router";
import { ROUTES } from "@/utils/routeConstants";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { useState } from "react";
import { useFetchData } from "@/hooks/useFetchData";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import useUpdateData from "@/hooks/useUpdateData";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { SectionSkeleton } from "@/components/skeletonLoader/TaskSkeleton";

type DocType = {
  fileName: string;
  fileUrl: string;
};

const TODO_CATEGORIES = [
  { key: "Labs", label: "Labs" },
  { key: "X-Ray/CT", label: "X-Ray/CT Scan" },
  { key: "Admin Docs", label: "Administrative Paperwork" },
  { key: "Discharge Records", label: "Hospital Discharge Summaries" },
  { key: "Medicines & Pharmacy", label: "Medicines & Pharmacy" },
  { key: "Referrals", label: "Referrals" },
  { key: "Insurance & Billing", label: "Insurance & Billing" },
  { key: "Other", label: "Other" },
];

const ToDoDetailsPage = () => {
  const navigate = useNavigate();
  const [successModal, setSuccessModal] = useState(false);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  console.log("type", type);
  const {
    data: activeData,
    isFetching: isActiveFetching,
    refetch: activeRefetch,
  } = useFetchData(
    `${apiRoutes.getToDoDetailsList}?todoType=${type}&status=completed`,
    ["getToDoDetailsList-active"],
    !!type,
  );
  console.log("activeData", activeData);
  const {
    data: pendingData,
    isFetching: isPendingFetching,
    refetch: pendingRefetch,
  } = useFetchData(
    `${apiRoutes.getToDoDetailsList}?todoType=${type}&status=pending`,
    ["getToDoDetailsList-pending"],
    true,
  );
  console.log("pendingData", pendingData);

  const getCategoryLabel = (type: string | null) =>
    TODO_CATEGORIES.find((c) => c.key === type)?.label || "To-do List";

  const formatDates = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();

    return `${month} ${day}`;
  };
  const { mutateAsync: updateToDoCompletedStatus, isPending: isUpdatePending } =
    useUpdateData(["update-to-do-statuss"]);

  const handleCompletedClick = async (todoId: string) => {
    try {
      await updateToDoCompletedStatus({
        endpoint: apiRoutes.updateToDoCompletedStatus(todoId),
        data: { isCompleted: true },
      });
      setSuccessModal(true);
      pendingRefetch();
      activeRefetch();
    } catch (error) {
      let message = "Failed! Please try again.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
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

  const isPendingEmpty = !pendingData?.data?.results?.length;
  const isCompletedEmpty = !activeData?.data?.results?.length;

  const showEmptyState =
    !isPendingFetching &&
    !isActiveFetching &&
    isPendingEmpty &&
    isCompletedEmpty;

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5 font-mona">
      {/* Header */}
      <div className="flex items-center justify-center relative mb-8">
        <button className="absolute left-0">
          <img
            src="/../icons/back-arrow-icon.svg"
            alt="back arrow"
            className="w-fit h-fit cursor-pointer"
            onClick={() =>
              navigate(`/${ROUTES.role.patient}/${ROUTES.patient.todoList}`)
            }
          />
        </button>
        <h1 className="text-base font-medium font-mona text-[#000000] ">
          {getCategoryLabel(type)}
        </h1>
      </div>

      {/* Empty State */}
      {showEmptyState && (
        <div className="rounded-2xl bg-[#F7FDFF] p-6 text-center">
          <p className="text-sm text-[#4A4A4A] font-medium">
            No tasks available for this category.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {isPendingFetching ? (
          <SectionSkeleton />
        ) : (
          pendingData?.data?.results?.length > 0 && (
            <div className="rounded-2xl bg-[#F7FDFF] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-medium">Active Task</h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#B9F2F8] text-[#000000] border border-[#009FB6] font-semibold">
                    {pendingData?.data ? pendingData?.data?.results?.length : 0}
                  </span>
                </div>
              </div>

              {/* Inner Task Card */}
              {pendingData?.data?.results?.map((item: any) => {
                return (
                  <div className="rounded-2xl border border-[#00BCD4] bg-white ">
                    <div className="space-y-3 p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-medium">
                            {item?.title}
                          </h3>
                          <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-[#00BCD4] text-[#000000]">
                            New
                          </span>
                        </div>
                        <div>
                          <img
                            src="/../icons/top-arrow-icon.svg"
                            alt="top-arrow"
                            className="w-fit h-fit cursor-pointer"
                          />
                        </div>
                      </div>

                      <p className="text-sm font-medium text-[#4A4A4A] font-mona ">
                        Assigned by{" "}
                        <span className="text-[#009FB6] text-sm font-medium capitalize">
                          {item?.providerId?.providerName}
                        </span>{" "}
                        •{" "}
                        <span className="text-[#009FB6] text-sm font-medium">
                          {formatDates(item?.createdAt)}
                        </span>
                      </p>
                      {item?.notes && (
                        <div className="bg-[#E8F9FF] rounded-sm px-3 py-2 text-sm text-[#000000]">
                          {item?.notes}
                        </div>
                      )}
                    </div>
                    {item?.attachments?.length > 0 && (
                      <div>
                        <div className="w-full border-t border-[#ECECEC]"></div>
                        {/* Attachments */}
                        <div className="space-y-2 text-sm p-4">
                          <p className="text-[#4A4A4A] font-medium text-sm">
                            Attachment(s)
                          </p>
                          {item?.attachments?.map((doc: DocType) => {
                            return (
                              <div className="flex items-center justify-between gap-3 font-mona">
                                <span
                                  className="text-[#000000] text-sm font-medium truncate max-w-[65%]"
                                  title={doc?.fileName}
                                >
                                  {doc?.fileName || "NA"}
                                </span>

                                <div className="flex shrink-0 gap-2">
                                  <button
                                    className="cursor-pointer text-[#00BCD4] whitespace-nowrap"
                                    onClick={() => handleView(doc.fileUrl)}
                                  >
                                    View
                                  </button>
                                  <span className="text-[#AFAFAF]">|</span>
                                  <button
                                    className="cursor-pointer text-[#009FB6] whitespace-nowrap"
                                    onClick={() =>
                                      handleDownload(doc.fileUrl, doc.fileName)
                                    }
                                  >
                                    Download
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Action */}
                    <button
                      className={`w-full border-t border-[#00BCD4] py-4 text-sm font-semibold text-[#009FB6] ${isUpdatePending ? "cursor-not-allowed opacity-60" : "cursor-pointer"} `}
                      onClick={() => handleCompletedClick(item?.id)}
                    >
                      Mark as Completed
                    </button>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      <div className="space-y-4">
        {isActiveFetching ? (
          <SectionSkeleton count={1} />
        ) : (
          activeData?.data?.results?.length > 0 && (
            <div className="rounded-2xl bg-[#F7FDFF] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-medium">Completed Tasks</h2>
                </div>
              </div>

              {activeData?.data?.results?.map((item: any) => {
                return (
                  <div className="rounded-2xl  bg-white ">
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-medium">
                            {item?.title}
                          </h3>
                        </div>
                        <div>
                          <img
                            src="/../icons/top-arrow-icon.svg"
                            alt="top-arrow"
                            className="w-fit h-fit cursor-pointer"
                          />
                        </div>
                      </div>

                      <p className="text-sm font-medium text-[#4A4A4A] font-mona ">
                        Assigned by{" "}
                        <span className="text-sm font-medium capitalize">
                          {item?.providerId?.providerName}
                        </span>{" "}
                        •{" "}
                        <span className="text-sm font-medium">
                          {formatDates(item?.createdAt)}
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      <CommonSuccessModal
        isOpen={successModal}
        onClose={() => setSuccessModal(false)}
        desc={"Task Completed"}
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
    </div>
  );
};

export default ToDoDetailsPage;
