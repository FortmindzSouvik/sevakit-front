import { updateHasUsedTrial } from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { useFetchData } from "@/hooks/useFetchData";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useNavigate } from "react-router";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect } from "react";
import { updateProviderHasUsedTrial } from "@/redux/slices/providerSlice";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { userData } = useAppSelector((state) => state.user);
  const { providerData } = useAppSelector((state) => state.provider);

  const isProvider = providerData?.role === "provider";

  // Get current user data
  const currentUser = isProvider ? providerData : userData;
  const userId = currentUser?.id || "";

  const { data: userDetails } = useFetchData(
    apiRoutes.getParticularUserList(userId),
    ["get-user-list"],
    !!userId,
  );
  const user = userDetails?.data;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      if (isProvider) {
        dispatch(
          updateProviderHasUsedTrial({
            hasUsedTrial: user?.hasUsedTrial,
            subscriptionStatus: user?.subscriptionStatus,
          }),
        );
        console.log("Provider subscription updated:", user);
      } else {
        dispatch(
          updateHasUsedTrial({
            hasUsedTrial: user?.hasUsedTrial,
            subscriptionStatus: user?.subscriptionStatus,
          }),
        );
        console.log("Patient subscription updated:", user);
      }
    }
  }, [user, dispatch, isProvider]);

  const handleGoToDashboard = () => {
    if (isProvider) {
      navigate(`/${ROUTES.role.provider}/${ROUTES.provider.dashboard}`, {
        replace: true,
      });
    } else {
      navigate(`/${ROUTES.role.patient}/${ROUTES.patient.dashboard}`, {
        replace: true,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-5xl rounded-3xl flex flex-col items-center justify-center py-24 px-6 text-center">
        {/* Success Icon */}
        <div className="mb-10">
          <img
            src="/../icons/correct-color-icon.svg"
            alt="success"
            className="w-32 h-32"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-semibold text-black font-mona">
          Payment successful!
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-[#424242] mt-4 font-mona">
          Your subscription is now active.
        </p>

        {/* Go Home Button */}
        <button
          className="mt-4 px-8 py-4 bg-[#00BCD4] text-[#212121] rounded-xl text-lg font-mona hover:bg-[#00B0C7] cursor-pointer "
          onClick={handleGoToDashboard}
        >
          Go to {isProvider ? "Provider" : "Patient"} Dashboard
        </button>
      </div>
    </div>
  );
}
