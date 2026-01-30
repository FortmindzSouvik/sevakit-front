

import { Outlet } from "react-router";
import ScrollToTop from "@/components/scrollToTop/ScrollToTop";
import HomeHeader from "./header/HomeHeader";
import HomeFooter from "./footer/HomeFooter";



const HomeLayout = () => {
  return (
    <>
      <HomeHeader />
      <main className="min-h-screen bg-[#FAFEFF] ">
        <ScrollToTop />
        <Outlet />
      </main>
      <HomeFooter />
    </>
  );
};

export default HomeLayout;