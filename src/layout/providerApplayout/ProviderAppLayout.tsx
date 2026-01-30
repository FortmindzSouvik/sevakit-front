import ProviderAppHeader from "./header/ProviderAppHeader";
import ScrollToTop from "@/components/scrollToTop/ScrollToTop";
import { Outlet, useNavigate, useLocation } from "react-router";
import { useAppSelector } from "@/redux/store";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useState } from "react";
import ProviderAppSidebar from "./sidebar/ProviderAppSidebar";

const ProviderAppLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { providerData } = useAppSelector((state) => state.provider);

  const token = providerData?.accessToken;
  const redirectToPayNow = providerData?.redirectToPayNow;
  const subscriptionStatus = providerData?.subscriptionStatus;

  type SidebarTab =
    | "dashboard"
    | "patients"
    | "analytics"
    | "help"
    | "settings";

  const getActiveTabFromPath = (pathname: string): SidebarTab => {
    if (pathname.startsWith("/provider/patients")) return "patients";
    if (pathname.startsWith("/provider/analytics")) return "analytics";
    if (pathname.startsWith("/provider/help")) return "help";
    if (pathname.startsWith("/provider/settings")) return "settings";
    return "dashboard";
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  useEffect(() => {
    if (!token) {
      navigate(`/${ROUTES.auth.login}`, { replace: true });
      return;
    }

    if (
      redirectToPayNow &&
      ["none", "expired", "cancelled"].includes(subscriptionStatus || "")
    ) {
      if (location.pathname !== `/${ROUTES.provider.subscription}`) {
        navigate(`/${ROUTES.role.provider}/${ROUTES.provider.subscription}`, {
          replace: true,
        });
      }
      return;
    }

    // DO NOT redirect if already inside provider routes
    if (location.pathname.startsWith(`/${ROUTES.role.provider}`)) {
      return;
    }

    // Only redirect to dashboard when user is on root
    navigate(`/${ROUTES.role.provider}/${ROUTES.provider.dashboard}`, {
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
    <div className="flex h-screen bg-white font-mona overflow-hidden">
      <ProviderAppSidebar
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onClose={() => setSidebarOpen(false)}
        activeTab={activeTab}
      />
      <div className="flex-1 flex flex-col transition-all duration-300 min-h-0">
        <ProviderAppHeader
          onMenuClick={() => setSidebarOpen(true)}
          title={activeTab}
        />
        <main className="p-6 space-y-6 max-w-8xl w-full mx-auto flex-1 overflow-y-auto ">
          <ScrollToTop />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProviderAppLayout;
