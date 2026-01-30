import { useEffect, useRef, useState } from "react";
import { Loader2, XCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { ROUTES } from "@/utils/routeConstants";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useUserVerifyAccount } from "@/hooks/useUserAuth";
import { clearUserData, setUserData } from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import type { IProviderData, IUserData } from "@/interfaces/auth.interfaces";
import { clearProviderData, setProviderData } from "@/redux/slices/providerSlice";

const AccountVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");

  const { mutateAsync: verifyAccount } = useUserVerifyAccount();

  const [status, setStatus] = useState<"processing" | "success" | "error">(
    "processing",
  );
  const hasVerifiedRef = useRef(false);
  const dispatch = useAppDispatch();

  const { userData } = useAppSelector((state) => state.user);
  const { providerData } = useAppSelector((state) => state.provider);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      toast.error("Invalid or missing verification token");
      return;
    }

    if (hasVerifiedRef.current) return;
    hasVerifiedRef.current = true;

    const verify = async () => {
      try {
        const resp = await verifyAccount(token);
        // console.log("resp for account verify===>", resp);
        if (resp?.isSuccess) {
          if (resp?.data?.user?.role === "user") {
            dispatch(clearUserData());
            const userData: IUserData = {
              id: resp?.data?.user?.id,
              firstName: resp?.data?.user?.firstName,
              lastName: resp?.data?.user?.lastName,
              email: resp?.data?.user?.email,
              role: resp?.data?.user?.role,
              hasUsedTrial: resp?.data?.user?.hasUsedTrial,
              redirectToPayNow: resp?.data?.user?.redirectToPayNow,
              sevaId: resp?.data?.user?.sevaId,
              subscriptionStatus: resp?.data?.user?.subscriptionStatus,
              accessToken: resp?.accessToken,
              refreshToken: resp?.refreshToken,
            };

            dispatch(setUserData(userData));
          } else if (resp?.data?.user?.role === "provider") {
            dispatch(clearProviderData());
            const providerData: IProviderData = {
              id: resp?.data?.user?.id,
              firstName: resp?.data?.user?.firstName,
              lastName: resp?.data?.user?.lastName,
              email: resp?.data?.user?.email,
              role: resp?.data?.user?.role,
              hasUsedTrial: resp?.data?.user?.hasUsedTrial,
              redirectToPayNow: resp?.data?.user?.redirectToPayNow,
              sevaId: resp?.data?.user?.sevaId,
              subscriptionStatus: resp?.data?.user?.subscriptionStatus,
              accessToken: resp?.accessToken,
              refreshToken: resp?.refreshToken,
            };

            dispatch(setProviderData(providerData));
          }
          setStatus("success");
        } else {
          throw new Error(resp?.message || "Verification failed");
        }
      } catch (error) {
        let message = "Verification failed. Please try again.";

        if (error instanceof AxiosError) {
          message = error.response?.data?.message || message;
        } else if (error instanceof Error) {
          message = error.message;
        }

        console.log(message);
        // toast.error(message);
        setStatus("error");
      }
    };

    verify();
  }, [token, navigate, verifyAccount]);

  const handleContinueClick = () => {
    if (userData?.role === "user") {
      if (userData?.redirectToPayNow === true) {
        navigate(`/${ROUTES.role.patient}/${ROUTES.patient.subscription}`, {
          replace: true,
        });
      } else if (userData?.redirectToPayNow === false) {
        navigate(`/${ROUTES.role.patient}/${ROUTES.patient.dashboard}`, {
          replace: true,
        });
      } else {
        navigate(`/${ROUTES.auth.login}`, { replace: true });
      }
    } else if (providerData?.role === "provider") {
      if (providerData?.redirectToPayNow === true) {
        navigate(`/${ROUTES.role.provider}/${ROUTES.provider.subscription}`, {
          replace: true,
        });
      } else if (providerData?.redirectToPayNow === false) {
        navigate(`/${ROUTES.role.provider}/${ROUTES.provider.dashboard}`, {
          replace: true,
        });
      } else {
        navigate(`/${ROUTES.auth.login}`, { replace: true });
      }
    }
  };

  return (
    <div className="max-w-md mx-auto flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg text-center font-mona py-18 px-6">
        {/* ICON */}
        <div className="flex justify-center mb-6">
          {status === "processing" && (
            <Loader2 className="h-12 w-12 text-[#00BCD4] animate-spin" />
          )}
          {status === "success" && (
            <img
              src="/../icons/correct-color-icon.svg"
              alt="success"
              className="h-fit w-fit text-green-500"
            />
          )}
          {status === "error" && <XCircle className="h-12 w-12 text-red-500" />}
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-[#000000] mb-2">
          {status === "processing" && "Processing Your Request"}
          {status === "success" && "Account Verified"}
          {status === "error" && "Verification Failed"}
        </h1>

        {/* DESCRIPTION */}
        <p className="text-[#444444] text-sm leading-relaxed mb-6">
          {status === "processing" &&
            "Please wait while we verify your account. This may take a few seconds."}

          {status === "success" &&
            // "Your account has been successfully verified. Redirecting you to login..."}
            "Your KIT account has been created. Use your phone number and password to sign in next time."}

          {status === "error" &&
            "We couldn’t verify your account. The link may be expired or invalid."}
        </p>

        {/* ACTIONS */}
        {status === "success" && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleContinueClick()}
              className="w-full h-[50px] bg-[#00BCD4] text-[#000000] rounded-xl font-medium cursor-pointer"
            >
              Continue
            </button>

            {/* <button
              onClick={() => window.location.reload()}
              className="w-full h-[50px] border border-[#00BCD4] text-[#00BCD4] rounded-xl font-medium cursor-pointer"
            >
              Retry Verification
            </button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountVerification;
