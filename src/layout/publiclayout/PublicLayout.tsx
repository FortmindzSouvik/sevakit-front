import { Outlet } from "react-router";
import ScrollToTop from "@/components/scrollToTop/ScrollToTop";

import PublicHeader from "./header/PublicHeader";
import PublicFooter from "./footer/PublicFooter";

const PublicLayout = () => {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen bg-[#FAFEFF] ">
        <ScrollToTop />
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
};

export default PublicLayout;
