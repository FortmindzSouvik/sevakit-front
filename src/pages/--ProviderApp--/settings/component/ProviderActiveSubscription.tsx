import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { useFetchData } from "@/hooks/useFetchData";
import { formatDate } from "@/lib/utils";
import { useAppSelector } from "@/redux/store";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useState } from "react";
import CancelProviderSubscriptionModal from "./modal/CancelProviderSubscriptionModal";

const ProviderActiveSubscription = () => {
  const [openCancelSubscriptionModal, setOpenCancelSubscriptionModal] =
    useState(false);
  const [isCancelSubscSuccessOpen, setIsCancelSubscSuccessOpen] =
    useState(false);
  const { providerData } = useAppSelector((state) => state.provider);
  const providerId = providerData?.id || "";
  const { data: providerDetails } = useFetchData(
    apiRoutes.getParticularUserList(providerId),
    ["get-provider-lists"],
    !!providerId,
  );
  return (
    <div className="rounded-xl bg-[#F7FDFF] p-4 sm:p-6">
      <div>
        <div className="flex flex-col lg:flex-row lg:justify-between border-b pb-4 mb-4 gap-4">
          <div className="flex items-center gap-3 ">
            <p className="text-2xl font-bold">$49/year</p>
            <span className="rounded-md bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-700">
              Active
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p>Billing: Yearly</p>
            <p>
              Next billing date:{" "}
              {formatDate(providerDetails?.data?.subscriptionEnd)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {`Your access continues until ${formatDate(providerDetails?.data?.subscriptionEnd)} if you cancel today.`}
            </p>
          </div>
        </div>

        <div className="flex justify-start lg:justify-end">
          <button
            className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 cursor-pointer"
            onClick={() => setOpenCancelSubscriptionModal(true)}
          >
            Cancel Subscription
          </button>
        </div>
      </div>
      <CancelProviderSubscriptionModal
        isOpen={openCancelSubscriptionModal}
        onClose={() => setOpenCancelSubscriptionModal(false)}
        onSuccess={() => {
          setIsCancelSubscSuccessOpen(true);
        }}
      />
      <CommonSuccessModal
        isOpen={isCancelSubscSuccessOpen}
        onClose={() => setIsCancelSubscSuccessOpen(false)}
        desc={"Subscription cancelled successfully."}
        icon={"/../icons/correct-color-icon.svg"}
      />
    </div>
  );
};

export default ProviderActiveSubscription;
