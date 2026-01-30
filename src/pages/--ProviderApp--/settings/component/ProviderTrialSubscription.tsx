type TrialSubscriptionProps = {
  trialEnd?: string | Date | null;
};

const formatDate = (value?: string | Date | null) => {
  if (!value) return "N/A";

  const date = typeof value === "string" ? new Date(value) : value;

  return isNaN(date.getTime())
    ? "NA"
    : date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const ProviderTrialSubscription = ({ trialEnd }: TrialSubscriptionProps) => {
  return (
    <div className="rounded-xl bg-[#F7FDFF] p-4 sm:p-6">
      <div>
        <div className="flex flex-col lg:flex-row lg:justify-between pb-4 mb-4 gap-4">
          <div className="flex items-center gap-3 ">
            <p className="text-2xl font-bold">Free Trial</p>
            <span className="rounded-md bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-700">
              Active
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p>Trial period active</p>
            <p>Trial ends on: {formatDate(trialEnd)}</p>
            <p className="text-xs text-gray-500 mt-1">
              Upgrade anytime to continue uninterrupted access.{" "}
            </p>
          </div>
        </div>

        {/* <div className="flex justify-start lg:justify-end">
          <button className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100">
            Cancel Subscription
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProviderTrialSubscription;
