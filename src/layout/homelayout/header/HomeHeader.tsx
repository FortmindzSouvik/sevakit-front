import { Link } from "react-router";

const HomeHeader = () => {
  return (
    <div className="w-full bg-[#FFFFFF]  flex justify-between items-center p-3 md:px-24 shadow-sm border-b pb-4 sticky top-0 z-10">
      <div className="flex w-full justify-between">
        {/* Left Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <img
            src="/../icons/kit-logo-icon.svg"
            alt="logo"
            className="w-fit h-fit object-contain"
          />
        </Link>

        <button className="px-6 py-3 bg-[#00BCD4] text-[#212121] font-mona font-medium rounded-xl transition cursor-pointer">
          Providers
        </button>
      </div>
    </div>
  );
};

export default HomeHeader;
