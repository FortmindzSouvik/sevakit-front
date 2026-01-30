import { ROUTES } from "@/utils/routeConstants";
import { useState } from "react";
import { useNavigate } from "react-router";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useAppSelector } from "@/redux/store";
import { useFetchData } from "@/hooks/useFetchData";
import TrialSubscription from "./component/TrialSubscription";
import ActiveSubscription from "./component/ActiveSubscription";
import SubscriptionSkeleton from "@/components/skeletonLoader/SubscriptionSkeleton";
import DeactivateAccount from "./component/DeactivateAccount";
import ChangePassword from "./component/ChangePassword";
import ChangePin from "./component/ChangePin";
import { toast } from "sonner";

const AccountSettings = () => {
  const navigate = useNavigate();

  const [isCancelSubSuccessOpen, setIsCancelSubSuccessOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";
  const { data, isFetching } = useFetchData(
    `${apiRoutes.getParticularUserList(userId)}`,
    ["get-user-particular-list"],
    !!userId
  );

  const subscriptionStatus = data?.data?.subscriptionStatus;
  const trialEnd = data?.data?.trialEnd;
  const sevaId = data?.data?.sevaId;
  // Dynamic base URL based on environment
  const getBaseUrl = () => {
    // Check hostname
    const hostname = window.location.hostname;

    if (hostname.includes("localhost")) {
      return "http://localhost:5173";
    }

    if (hostname.includes("development") || hostname.includes("staging")) {
      return (
        import.meta.env.VITE_API_FRONTEND_BASE_URL_DEV ||
        "https://development.d3jtrhwl43jxtc.amplifyapp.com"
      );
    }

     if (hostname.includes("www.mykitbuddy.com")) {
       return "https://www.mykitbuddy.com";
     }

    // Default to production
    return (
      import.meta.env.VITE_API_FRONTEND_BASE_URL_PROD ||
      "https://www.mykitbuddy.com"
    );
  };

  const profileLink = `${getBaseUrl()}/public/profile/${sevaId}`;

  const handleCopy = async (sevaId?: string) => {
    if (!sevaId) return;

    try {
      await navigator.clipboard.writeText(profileLink);
      setCopied(true);
      // toast.success("Seva ID copied");

      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy", err);
      toast.error("Failed to copy");
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
          Account Settings
        </h1>
      </div>

      {/* subscription section */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold">Subscription</h2>
          </div>
        </div>

        {isFetching ? (
          <SubscriptionSkeleton />
        ) : (
          <>
            {subscriptionStatus === "trial" && (
              <TrialSubscription trialEnd={trialEnd} />
            )}

            {subscriptionStatus === "active" && <ActiveSubscription />}

            {!subscriptionStatus && (
              <p className="text-sm text-gray-500">No subscription found</p>
            )}
          </>
        )}
      </div>

      {/* sevaId section */}
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold">Seva ID</h2>
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl p-4 ">
          <div className="flex items-start justify-between">
            {/* Title + Start Date */}
            <div className="font-mona">
              <div className="flex gap-1">
                <h3 className="text-xl font-medium text-[#000000]">
                  {userData?.sevaId || "NA"}
                </h3>

                <img
                  src={
                    copied
                      ? "/../icons/correct-color-icon.svg"
                      : "/../icons/copy-alt-color-icon.svg"
                  }
                  alt="copy"
                  className="w-4 h-4 mt-1 cursor-pointer transition-all"
                  onClick={() => handleCopy(userData?.sevaId)}
                />
              </div>

              <p className="text-sm font-normal text-[#4A4A4A] mt-1">
                Your Seva ID cannot be changed. It is used internally for secure
                account operations, subscription management, and record lookup.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* change pin section */}
      <ChangePin />

      {/* change password */}
      <ChangePassword />

      {/* deactivate account */}
      <DeactivateAccount />

      <CommonSuccessModal
        isOpen={isCancelSubSuccessOpen}
        onClose={() => setIsCancelSubSuccessOpen(false)}
        desc={"Subscription cancelled successfully."}
        icon={"/../icons/correct-color-icon.svg"}
      />
    </div>
  );
};

export default AccountSettings;
