import { usePostJson } from "@/hooks/usePostJson";
import useUpdateData from "@/hooks/useUpdateData";
import { updateProviderHasUsedTrial } from "@/redux/slices/providerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { ROUTES } from "@/utils/routeConstants";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const ProviderSubscriptionPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { providerData } = useAppSelector((state) => state.provider);
  const userId = providerData?.id || "";
  const userEmail = providerData?.email || "";
  const { mutateAsync: updateFreeTrial, isPending: updatePending } =
    useUpdateData(["update-free-trials"]);

  const { mutateAsync: donePayment, isPending: paymentPending } = usePostJson([
    "done-payments",
  ]);

  const isTrialDisabled = providerData?.hasUsedTrial;
  const isSubscriptionDisabled = providerData?.subscriptionStatus;

  const handleFreeTrialClick = async () => {
    if (updatePending) return;
    const payload = {
      activateTrial: true,
    };
    try {
      const resp = await updateFreeTrial({
        endpoint: apiRoutes.updateFreeTrial(userId),
        data: { ...payload },
      });
      dispatch(
        updateProviderHasUsedTrial({
          hasUsedTrial: resp.data.hasUsedTrial,
          subscriptionStatus: resp.data.subscriptionStatus,
        }),
      );
      navigate(`/${ROUTES.role.provider}/${ROUTES.provider.dashboard}`, {
        replace: true,
      });
    } catch (error) {
      let message = "Free trail failed. Please try again.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    }
  };

  const handlePaymentBtnClick = async () => {
    if (paymentPending) return;

    const payload = {
      email: userEmail,
    };

    try {
      const resp = await donePayment({
        endpoint: apiRoutes.donePayment,
        data: payload,
      });

      const checkoutUrl = resp?.data?.url;

      if (!checkoutUrl) {
        toast.error("Unable to start payment. Please try again.");
        return;
      }

      window.location.href = checkoutUrl;
      //  window.open(checkoutUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      let message = "Proccess failed. Please try again.";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5 font-mona">
      <div className="mt-6">
        <h1 className="text-2xl font-semibold font-mona text-[#000000] ">
          Choose How You Want to Start
        </h1>
        <p className="text-base font-normal text-[#000000] mt-1">
          Select the option that works best for you to continue using KIT.{" "}
        </p>
      </div>

      <div
        className={`p-7 rounded-2xl font-mona ${
          isTrialDisabled ? "bg-[#b9c5c9]  cursor-not-allowed" : "bg-[#E8F9FF]"
        }`}
      >
        <h2 className="text-xl font-semibold">30-Day Free Trial</h2>
        <p className="text-base font-normal text-[#000000] mt-1">
          Try all features at no cost for 30 days.
        </p>
        <button
          className={`w-full capitalize font-semibold rounded-lg mt-6 p-4 flex items-center justify-center gap-2 transition ${
            isTrialDisabled || updatePending
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#00BCD4] text-[#212121] hover:opacity-90 cursor-pointer"
          }`}
          onClick={handleFreeTrialClick}
          disabled={isTrialDisabled || updatePending}
        >
          {updatePending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Activating...
            </>
          ) : (
            "Activate free trial"
          )}
        </button>
        <p className="text-base font-normal text-[#000000] text-center mt-2">
          No credit card required.
        </p>
      </div>

      <div
        className={`p-7 rounded-2xl font-mona ${
          isSubscriptionDisabled === "active"
            ? "bg-[#b9c5c9]  cursor-not-allowed"
            : "bg-[#E8F9FF]"
        }`}
      >
        <h2 className="text-xl font-semibold">Pay Now & Subscribe</h2>
        <p className="text-base font-normal text-[#000000] mt-1">
          Get immediate access with a paid plan.
        </p>
        <h2 className="text-3xl font-semibold mt-3">$49/month</h2>
        <button
          className={`flex justify-center items-center w-full capitalize text-[#212121] font-semibold bg-[#00BCD4]  rounded-lg mt-6 p-4 cursor-pointer ${
            isSubscriptionDisabled === "active" || paymentPending
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#00BCD4] text-[#212121] hover:opacity-90 cursor-pointer"
          }`}
          onClick={handlePaymentBtnClick}
          disabled={isTrialDisabled || paymentPending}
        >
          {paymentPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Processing...
            </>
          ) : (
            " Continue to Payment"
          )}
        </button>
      </div>
    </div>
  );
};

export default ProviderSubscriptionPage;
