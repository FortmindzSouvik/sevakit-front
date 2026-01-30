import { ROUTES } from "@/utils/routeConstants";
import { NavLink } from "react-router";

type SidebarItemProps = {
  icon: string;
  label: string;
  collapsed: boolean;
  active?: boolean;
  to:string
  onClick?: () => void;
};

export const SidebarItem = ({
  icon,
  label,
  collapsed,
  active = false,
  to,
  onClick,
}: SidebarItemProps) => {
  return (
    <NavLink
      to={`/${ROUTES.role.provider}/${to}`}
      className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer
        ${active ? "bg-[#E6FAFD] text-[#009FB6]" : "hover:bg-gray-100"}
      `}
      onClick={onClick}
    >
      {/* Icon */}
      <img src={icon} className="w-5 h-5 shrink-0" />

      {/* Label (expanded) */}
      {!collapsed && (
        <span className="font-medium text-sm whitespace-nowrap">{label}</span>
      )}

      {/* Tooltip (collapsed → TOP) */}
      {collapsed && (
        <div
          className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            opacity-0 group-hover:opacity-100
            pointer-events-none transition
            bg-black text-white text-xs px-3 py-1.5 rounded-md
            whitespace-nowrap z-50
          "
        >
          {label}

          <span
            className="
              absolute top-full left-1/2 -translate-x-1/2
              w-2 h-2 bg-black rotate-45
            "
          />
        </div>
      )}
    </NavLink>
  );
};
