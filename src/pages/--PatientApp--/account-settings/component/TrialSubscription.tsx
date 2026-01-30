
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


const TrialSubscription = ({ trialEnd }: TrialSubscriptionProps) => (
  <div className="bg-[#FFFFFF] rounded-2xl p-4">
    <div className="flex items-start justify-between">
      <div className="font-mona">
        <h3 className="text-3xl font-semibold text-[#000000]">Free Trial</h3>
        <p className="text-sm mt-1 text-[#000000]">Trial period active</p>
        <p className="text-sm mt-1 text-[#000000]">Trial ends on: {formatDate(trialEnd)}</p>
        <p className="text-xs mt-1 text-[#4A4A4A]">
          Upgrade anytime to continue uninterrupted access.
        </p>
      </div>

      <span className="px-2 py-1 rounded text-xs font-medium bg-[#B9F2F8] text-[#000000]">
        Active
      </span>
    </div>

    {/* <div className="w-full border-t border-[#ECECEC] mt-3"></div> */}

    {/* <div className="flex justify-end mt-3">
      <button className="text-sm font-medium text-[#009FB6]">
        Upgrade Plan
      </button>
    </div> */}
  </div>
);
export default TrialSubscription