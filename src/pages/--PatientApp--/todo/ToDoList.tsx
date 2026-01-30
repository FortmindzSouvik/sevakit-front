import TodoCategory from "./component/TodoCategory";
import { useNavigate } from "react-router";
import { ROUTES } from "@/utils/routeConstants";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { useState } from "react";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useFetchData } from "@/hooks/useFetchData";
import { AxiosError } from "axios";
import { toast } from "sonner";
import useUpdateData from "@/hooks/useUpdateData";
import TodoSkeleton from "@/components/skeletonLoader/ToDoSkeleton";

type DocType = {
  fileName: string;
  fileUrl: string;
};

const TODO_CATEGORIES = [
  {
    key: "Labs",
    label: "Labs",
  },
  {
    key: "X-Ray/CT",
    label: "X-Ray/CT Scan",
  },
  {
    key: "Admin Docs",
    label: "Administrative Paperwork",
  },
  {
    key: "Discharge Records",
    label: "Hospital Discharge Summaries",
  },
  {
    key: "Medicines & Pharmacy",
    label: "Medicines & Pharmacy",
  },
  {
    key: "Referrals",
    label: "Referrals",
  },
  {
    key: "Insurance & Billing",
    label: "Insurance & Billing",
  },
  {
    key: "Other",
    label: "Other",
  },
];

const TodoList = () => {
  const navigate = useNavigate();
  const [successModal, setSuccessModal] = useState(false);

  const { data, isFetching, refetch } = useFetchData(
    `${apiRoutes.getPendingToDoList}`,
    ["getToDoList"],
    true,
  );

  const formatDates = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();

    return `${month} ${day}`;
  };

  const { mutateAsync: updateToDoCompletedStatus, isPending: isUpdatePending } =
    useUpdateData(["update-to-do-status"]);

  const handleCompletedClick = async (todoId: string) => {
    try {
      await updateToDoCompletedStatus({
        endpoint: apiRoutes.updateToDoCompletedStatus(todoId),
        data: { isCompleted: true },
      });
      setSuccessModal(true);
      refetch();
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
              navigate(`/${ROUTES.role.patient}/${ROUTES.patient.dashboard}`)
            }
          />
        </button>
        <h1 className="text-base font-medium font-mona text-[#000000] ">
          To-do List
        </h1>
      </div>
      {isFetching ? (
        <TodoSkeleton />
      ) : (
        <div className="space-y-4">
          {TODO_CATEGORIES.map(({ key, label }) => {
            const todos = data?.data?.[key] || [];

            if (!todos.length) {
              return <TodoCategory key={key} title={label} type={key} />;
            }

            return (
              <div key={key} className="rounded-2xl bg-[#F7FDFF] p-4 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-medium">{label}</h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#B9F2F8] border border-[#009FB6] font-semibold">
                      {todos.length} Active
                    </span>
                  </div>
                  <img
                    src="/../icons/right-arrow-icon.svg"
                    alt="right arrow"
                    className="w-fit h-fit cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/${ROUTES.role.patient}/${ROUTES.patient.todoList}/${ROUTES.patient.toDodetails}?type=${key}`,
                      )
                    }
                  />
                </div>

                {/* Tasks */}
                {todos?.slice(0, 1)?.map((todo: any) => (
                  <div
                    key={todo?.id}
                    className="rounded-2xl border border-[#00BCD4] bg-white"
                  >
                    <div className="space-y-3 p-4">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-medium">{todo?.title}</h3>
                        <span className="text-xs font-medium px-2 py-0.5 rounded-sm bg-[#00BCD4] text-[#000000]">
                          New
                        </span>
                      </div>

                      <p className="text-sm font-medium text-[#4A4A4A] font-mona ">
                        Assigned by {"  "}
                        <span className="text-[#009FB6] text-sm font-medium capitalize">
                          {todo?.providerId?.providerName}
                        </span>{" "}
                        •{" "}
                        <span className="text-[#009FB6] text-sm font-medium">
                          {formatDates(todo?.createdAt)}
                        </span>
                      </p>
                      {todo?.notes && (
                        <div className="bg-[#E8F9FF] rounded-sm px-3 py-2 text-sm text-[#000000]">
                          {todo?.notes}
                        </div>
                      )}
                    </div>
                    {/* attachments */}
                    {todo?.attachments?.length > 0 && (
                      <div>
                        <div className="w-full border-t border-[#ECECEC]"></div>
                        <div className="space-y-2 text-sm p-4">
                          <p className="text-[#4A4A4A] font-medium text-sm">
                            Attachment(s)
                          </p>
                          {todo?.attachments?.map((doc: DocType) => {
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

                    <button
                      className={`w-full border-t border-[#00BCD4] py-4 text-sm font-semibold text-[#009FB6] ${isUpdatePending ? "cursor-not-allowed opacity-60" : "cursor-pointer"} `}
                      onClick={() => handleCompletedClick(todo?.id)}
                    >
                      Mark as Completed
                    </button>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

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

export default TodoList;
