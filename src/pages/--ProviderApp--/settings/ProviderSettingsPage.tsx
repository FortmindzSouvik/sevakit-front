import { useState } from "react";
import ProviderChangePassword from "./component/ProviderChangePassword";
import EditProfileInfo from "./component/EditProfileInfo";
import { useAppSelector } from "@/redux/store";
import { useFetchData } from "@/hooks/useFetchData";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import ProviderSubscriptionSkeleton from "@/components/skeletonLoader/ProviderSubscriptionSkeleton";
import ProviderTrialSubscription from "./component/ProviderTrialSubscription";
import ProviderActiveSubscription from "./component/ProviderActiveSubscription";
import { formatAddress, formatPhoneNumber } from "@/lib/utils";
import ProviderInfoSkeleton from "@/components/skeletonLoader/ProviderInfoSkeleton";

type ProfileForm = {
  id?: string;
  providerName: string;
  contactName: string;
  npi: string;
  phoneNumber: string;
  email: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
};

const ProviderSettingsPage = () => {
  const [openProfileInfoModal, setOpenProfileInfoModal] = useState(false);
  const [providerInfo, setProviderInfo] = useState<any | null>(null);
  const { providerData } = useAppSelector((state) => state.provider);
  const providerId = providerData?.id || "";
  const { data, isFetching, refetch } = useFetchData(
    `${apiRoutes.getParticularUserList(providerId)}`,
    ["get-providerId-list"],
    !!providerId,
  );
  const subscriptionStatus = data?.data?.subscriptionStatus;
  const trialEnd = data?.data?.trialEnd;

  const handleEditProviderInfo = (data: ProfileForm) => {
    setOpenProfileInfoModal(true);
    setProviderInfo(data);
  };
  return (
    <>
      <div className="space-y-6 p-6 bg-gray-50">
        {/* ================= Provider Information ================= */}
        <div className="rounded-xl border bg-white p-4 sm:p-6">
          {isFetching ? (
            <ProviderInfoSkeleton />
          ) : (
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* LEFT SIDE */}
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <img
                  src="/../icons/doctor-avatar-icon.svg"
                  alt="Provider"
                  className="h-20 w-20 rounded-lg object-cover bg-gray-100"
                />

                {/* Info Section */}
                <div className="w-full">
                  <h3 className="text-lg font-medium text-[#4A4A4A]">
                    Provider Information
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-x-8 gap-y-4 text-sm">
                    <div className="w-full sm:w-[45%] lg:w-auto">
                      <p className="text-gray-500">Provider / Practice Name</p>
                      <p className="font-medium text-gray-900">
                        {data?.data?.providerName}
                      </p>
                    </div>

                    <div className="w-full sm:w-[45%] lg:w-auto">
                      <p className="text-gray-500">Point of Contact Name</p>
                      <p className="font-medium text-gray-900">
                        {data?.data?.contactName}
                      </p>
                    </div>

                    <div className="w-full sm:w-[45%] lg:w-auto">
                      <p className="text-gray-500">NPI Number</p>
                      <p className="font-medium text-gray-900">
                        {data?.data?.npi}
                      </p>
                    </div>

                    <div className="w-full sm:w-[45%] lg:w-auto">
                      <p className="text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">
                        {formatPhoneNumber(data?.data?.phoneNumber)}
                      </p>
                    </div>

                    <div className="w-full sm:w-[45%] lg:w-auto">
                      <p className="text-gray-500">Email Address</p>
                      <p className="font-medium text-gray-900">
                        {data?.data?.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-sm">
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">
                      {formatAddress(data?.data?.address) || "NA"}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT ACTION */}
              <button
                className="self-start lg:self-auto text-sm font-medium text-[#009FB6] flex items-center gap-1 cursor-pointer"
                onClick={() => handleEditProviderInfo(data?.data)}
              >
                ✎ Edit Provider Information
              </button>
            </div>
          )}
        </div>

        {/* ================= Subscription ================= */}
        <div className="rounded-xl border bg-white p-4 sm:p-6">
          <h3 className="text-lg font-medium text-[#4A4A4A] mb-4">
            Subscription
          </h3>
          {isFetching ? (
            <ProviderSubscriptionSkeleton />
          ) : (
            <>
              {subscriptionStatus === "trial" && (
                <ProviderTrialSubscription trialEnd={trialEnd} />
              )}

              {subscriptionStatus === "active" && (
                <ProviderActiveSubscription />
              )}

              {!subscriptionStatus && (
                <p className="text-sm text-gray-500">No subscription found</p>
              )}
            </>
          )}
        </div>

        {/* ================= Change Password ================= */}
        <ProviderChangePassword />
      </div>

      <EditProfileInfo
        isOpen={openProfileInfoModal}
        onClose={() => setOpenProfileInfoModal(false)}
        onSuccess={() => {
          refetch();
          setOpenProfileInfoModal(false);
        }}
        initialData={providerInfo}
        setProviderInfo={() => setProviderInfo(null)}
      />
    </>
  );
};

export default ProviderSettingsPage;
