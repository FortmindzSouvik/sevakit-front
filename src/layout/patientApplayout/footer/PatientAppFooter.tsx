import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PatientAppFooter = () => {
  const [active, setActive] = useState("home");
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "home",
      label: "Home",
      icon: "/../icons/home-icon.svg",
      path: "/patient/dashboard",
    },
    {
      key: "todo",
      label: "To-do",
      icon: "/../icons/todo-icon.svg",
      path: "/patient/todo-list",
    },
    {
      key: "share",
      label: "Share Profile",
      icon: "/../icons/share-icon.svg",
      path: "/patient/share-profile",
    },
    {
      key: "account",
      label: "Account",
      icon: "/../icons/user-icon.svg",
      path: "/patient/account-settings",
    },
  ];
  useEffect(() => {
    const found = menuItems.find((item) =>
      location.pathname.startsWith(item.path)
    );
    if (found) setActive(found.key);
  }, [location.pathname]);

  const handleNavigation = (item: any) => {
    setActive(item.key);

    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <nav className="bottom-0 left-0 w-full md:px-24 shadow-[0_-2px_8px_rgba(0,0,0,0.05)] py-2 bg-[#FFFFFF] border-b pb-1 sticky top-0 z-10">
      <div className="flex justify-center gap-12">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleNavigation(item)}
            className="flex flex-col items-center gap-1 cursor-pointer"
          >
            <img
              src={item.icon}
              alt={item.label}
              className={`w-5 h-5 transition-all ${
                active === item.key ? "opacity-100" : "opacity-60"
              }`}
              style={{
                filter:
                  active === item.key
                    ? "invert(46%) sepia(77%) saturate(1700%) hue-rotate(156deg) brightness(94%) contrast(101%)"
                    : "brightness(0%)",
              }}
            />

            <span
              className={`text-[12px] font-mona ${
                active === item.key ? "text-[#009FB6]" : "text-[#000000]"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default PatientAppFooter;
