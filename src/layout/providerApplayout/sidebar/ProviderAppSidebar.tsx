import { X } from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import type { SidebarTab } from "@/interfaces/dashboard.interface";

const ProviderAppSidebar = ({
  sidebarOpen,
  sidebarCollapsed,
  onCollapse,
  onClose,
  activeTab,
}: {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  onCollapse: () => void;
  onClose: () => void;
  activeTab: SidebarTab;
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/40 z-40 md:hidden
          transition-opacity duration-300
          ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
      />

      <aside
        className={`
          h-screen bg-white border-r flex flex-col z-50
          transition-transform duration-300
          
          /* MOBILE */
          fixed top-0 left-0 w-64 md:static
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0

          /* DESKTOP WIDTH LOGIC (UNCHANGED) */
          ${sidebarCollapsed ? "md:w-20" : "md:w-64"}
        `}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          {sidebarCollapsed ? (
            <img
              src="/../icons/kit-logo-icon.svg"
              className="w-fit h-fit mx-auto cursor-pointer"
              title="KIT"
            />
          ) : (
            <img
              src="/../icons/kit-logo-icon.svg"
              className="w-fit h-fit cursor-pointer"
            />
          )}

          {/* Desktop collapse (UNCHANGED) */}
          <img
            src="/../icons/angle-double-small-right-icon.svg"
            className={`cursor-pointer hidden md:block transition-transform ${
              sidebarCollapsed ? "rotate-180" : ""
            }`}
            onClick={onCollapse}
          />

          {/* Mobile close */}
          <button className="md:hidden" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-2">
          <SidebarItem
            icon="/../icons/dashboard-icon.svg"
            label="Dashboard"
            collapsed={sidebarCollapsed}
            active={activeTab === "dashboard"}
            to="/dashboard"
            onClick={() => {
              onClose(); // mobile auto close
            }}
          />
          <SidebarItem
            icon="/../icons/providers-icon.svg"
            label="Patients"
            collapsed={sidebarCollapsed}
            active={activeTab === "patients"}
            to="patients"
            onClick={() => {
              onClose(); // mobile auto close
            }}
          />
          <SidebarItem
            icon="/../icons/analytics-icon.svg"
            label="Analytics"
            collapsed={sidebarCollapsed}
            active={activeTab === "analytics"}
            to="/analytics"
            onClick={() => {
              onClose(); // mobile auto close
            }}
          />
        </nav>

        {/* Bottom */}
        <div className="mt-auto px-4 pb-6 space-y-2">
          <SidebarItem
            icon="/../icons/help-icon.svg"
            label="Help"
            collapsed={sidebarCollapsed}
            active={activeTab === "help"}
            to="/help"
            onClick={() => {
              onClose(); // mobile auto close
            }}
          />
          <SidebarItem
            icon="/../icons/settings-icon.svg"
            label="Settings"
            collapsed={sidebarCollapsed}
            active={activeTab === "settings"}
            to="/settings"
            onClick={() => {
              onClose(); // mobile auto close
            }}
          />
        </div>
      </aside>
    </>
  );
};

export default ProviderAppSidebar;
