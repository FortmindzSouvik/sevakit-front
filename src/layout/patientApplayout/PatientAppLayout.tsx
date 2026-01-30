import PatientAppHeader from "./header/PatientAppHeader";
import PatientAppFooter from "./footer/PatientAppFooter";
import ScrollToTop from "@/components/scrollToTop/ScrollToTop";
import { Outlet, useNavigate, useLocation } from "react-router";
import { useAppSelector } from "@/redux/store";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect } from "react";

const PatientAppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { userData } = useAppSelector((state) => state.user);

  const token = userData?.accessToken;
  const redirectToPayNow = userData?.redirectToPayNow;
  const subscriptionStatus = userData?.subscriptionStatus;

  useEffect(() => {

    if (!token) {
      navigate(`/${ROUTES.auth.login}`, { replace: true });
      return;
    }

    //  Subscription checking
    if (
      redirectToPayNow &&
      ["none", "expired", "cancelled"].includes(subscriptionStatus || "")
    ) {
      if (location.pathname !== `/${ROUTES.patient.subscription}`) {
        navigate(`/${ROUTES.role.patient}/${ROUTES.patient.subscription}`, { replace: true });
      }
      return;
    }

    // DO NOT redirect if already inside patient routes
    if (location.pathname.startsWith(`/${ROUTES.role.patient}`)) {
      return;
    }

    // Only redirect to dashboard when user is on root
    navigate(`/${ROUTES.role.patient}/${ROUTES.patient.dashboard}`, {
      replace: true,
    });
  }, [
    token,
    redirectToPayNow,
    subscriptionStatus,
    location.pathname,
    navigate,
  ]);

  return (
    <>
      <PatientAppHeader />
      <main className="min-h-screen bg-[#FFFFFF]">
        <ScrollToTop />
        <Outlet />
      </main>
      <PatientAppFooter />
    </>
  );
};

export default PatientAppLayout;
