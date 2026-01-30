import { useState } from "react";
import CancelSubscriptionModal from "./modal/CancelSubscriptionModal";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import RequestFullRefundModal from "./modal/RequestFullRefundModal";
import { useAppSelector } from "@/redux/store";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useFetchData } from "@/hooks/useFetchData";
import { formatDate } from "@/lib/utils";

const ActiveSubscription = () => {
  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";
  const { data: userDetails } = useFetchData(
    apiRoutes.getParticularUserList(userId),
    ["get-user-lists"],
    !!userId
  );
  const [openCancelSubscriptionModal, setOpenCancelSubscriptionModal] =
    useState(false);
  const [isCancelSubscSuccessOpen, setIsCancelSubscSuccessOpen] =
    useState(false);
  const [openRequestRefundModal, setOpenRequestRefundModal] = useState(false);
  const [isRequestRefundSuccessOpen, setIsRequestRefundSuccessOpen] =
    useState(false);
  return (
    <div className="bg-[#FFFFFF] rounded-2xl p-4">
      <div className="flex items-start justify-between">
        <div className="font-mona">
          <h3 className="text-3xl font-semibold text-[#000000]">$2.99/year</h3>
          <p className="text-sm mt-1 text-[#000000]">Billing: Yearly</p>
          <p className="text-sm mt-1 text-[#000000]">
            Next billing date: {formatDate(userDetails?.data?.subscriptionEnd)}
          </p>
          <p className="text-xs mt-1 text-[#4A4A4A]">
            Your access continues until the next billing cycle.
          </p>
        </div>

        <span className="px-2 py-1 rounded text-xs font-medium bg-[#B9F2F8] text-[#000000]">
          Active
        </span>
      </div>

      <div className="w-full border-t border-[#ECECEC] mt-3"></div>

      <div className="flex justify-between items-center gap-2 mt-2">
        <button
          className="border rounded-lg bg-[#FCEBED] text-[#DC3545] p-3 text-sm cursor-pointer"
          onClick={() => setOpenCancelSubscriptionModal(true)}
        >
          Cancel Subscription
        </button>

        <button
          type="button"
          className="text-sm font-medium text-[#009FB6] cursor-pointer"
          onClick={() => setOpenRequestRefundModal(true)}
        >
          Request Full Refund
        </button>
      </div>
      <CancelSubscriptionModal
        isOpen={openCancelSubscriptionModal}
        onClose={() => setOpenCancelSubscriptionModal(false)}
        onSuccess={() => {
          setIsCancelSubscSuccessOpen(true);
        }}
      />
      <RequestFullRefundModal
        isOpen={openRequestRefundModal}
        onClose={() => setOpenRequestRefundModal(false)}
        onSuccess={() => {
          setIsRequestRefundSuccessOpen(true);
        }}
        subscriptionAmount={"$2.99"}
      />
      <CommonSuccessModal
        isOpen={isCancelSubscSuccessOpen}
        onClose={() => setIsCancelSubscSuccessOpen(false)}
        desc={"Subscription cancelled successfully."}
        icon={"/../icons/correct-color-icon.svg"}
      />
      <CommonSuccessModal
        isOpen={isRequestRefundSuccessOpen}
        onClose={() => setIsRequestRefundSuccessOpen(false)}
        desc={"Refund request submitted. Confirmation sent to your email."}
        icon={"/../icons/correct-color-icon.svg"}
      />
    </div>
  );
};

export default ActiveSubscription;
