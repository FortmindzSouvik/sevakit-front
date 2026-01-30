import { Link } from "react-router";

const AuthHeader = () => {
  return (
    <div className="flex flex-col items-center border-b bg-[#FFFFFF] pb-4 sticky top-0 z-10 cursor-pointer">
      <Link to="/" className="flex items-center gap-2 cursor-pointer">
        <img
          src="/../icons/kit-logo-icon.svg"
          alt="logo"
          className="w-18 h-12 mt-2"
        />
      </Link>
    </div>
  );
};

export default AuthHeader;
