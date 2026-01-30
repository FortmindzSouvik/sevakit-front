import { Outlet, useNavigate } from "react-router";
import AuthHeader from "./header/AuthHeader";
import AuthFooter from "./footer/AuthFooter";
import ScrollToTop from "@/components/scrollToTop/ScrollToTop";
import { useAppSelector } from "@/redux/store";
import { useEffect } from "react";
import { ROUTES } from "@/utils/routeConstants";

const AuthLayout = () => {
  const navigate = useNavigate();
  const { userData } = useAppSelector((state) => state?.user);
  const { providerData } = useAppSelector((state) => state?.provider);
  const isProvider = providerData?.role === "provider";

  // Get current user data
  const currentUser = isProvider ? providerData : userData;
  const token = currentUser?.accessToken;
  const role = currentUser?.role;
  const redirectToPayNow = currentUser?.redirectToPayNow;
  const subscriptionStatus = currentUser?.subscriptionStatus;

  useEffect(() => {
    if (token) {
      if (role === "user") {
        if (
          redirectToPayNow &&
          (subscriptionStatus === "none" ||
            subscriptionStatus === "expired" ||
            subscriptionStatus === "cancelled")
        ) {
          navigate(`/${ROUTES.role.patient}/${ROUTES.patient.subscription}`, {
            replace: true,
          });
        } else {
          navigate(`/${ROUTES.role.patient}/${ROUTES.patient.dashboard}`, {
            replace: true,
          });
        }
      } else if (role === "provider") {
        if (
          redirectToPayNow &&
          (subscriptionStatus === "none" ||
            subscriptionStatus === "expired" ||
            subscriptionStatus === "cancelled")
        ) {
          navigate(`/${ROUTES.role.provider}/${ROUTES.provider.subscription}`, {
            replace: true,
          });
        } else {
          navigate(`/${ROUTES.role.provider}/${ROUTES.provider.dashboard}`, {
            replace: true,
          });
        }
      }
    }
  }, [userData, token, navigate]);

  return (
    <>
      <AuthHeader />
      <main className="min-h-screen bg-[#FAFEFF] ">
        <ScrollToTop />
        <Outlet />
      </main>
      <AuthFooter />
    </>
  );
};

export default AuthLayout;
