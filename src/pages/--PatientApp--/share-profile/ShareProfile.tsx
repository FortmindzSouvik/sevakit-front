import ShareQRProfileSkeleton from "@/components/skeletonLoader/ShareQRProfileSkeleton";
import { useFetchData } from "@/hooks/useFetchData";
import { useAppSelector } from "@/redux/store";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { ROUTES } from "@/utils/routeConstants";
import { useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import SendSmsOrEmailModal from "./component/SendSmsOrEmailModal";

const ShareProfile = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [openSmsOrEmailModal, setOpenSmsOrEmailModal] = useState(false);
  const [modalMode, setModalMode] = useState<"sms" | "email">("sms");
  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";
  const { data: userDetails, isFetching } = useFetchData(
    apiRoutes.getParticularUserList(userId),
    ["get-user-list1ss"],
    !!userId,
  );
  const sevaId = userDetails?.data?.sevaId;
  // Dynamic base URL based on environment
  const getBaseUrl = () => {
    // Check hostname
    const hostname = window.location.hostname;

    if (hostname.includes("localhost")) {
      return "http://localhost:5173";
    }

    if (hostname.includes("development") || hostname.includes("staging")) {
      return (
        import.meta.env.VITE_API_FRONTEND_BASE_URL_DEV ||
        "https://development.d3jtrhwl43jxtc.amplifyapp.com"
      );
    }

    if (hostname.includes("www.mykitbuddy.com")) {
      return "https://www.mykitbuddy.com";
    }

    // Default to production
    return (
      import.meta.env.VITE_API_FRONTEND_BASE_URL_PROD ||
      "https://www.mykitbuddy.com"
    );
  };

  const profileLink = `${getBaseUrl()}/public/profile/${sevaId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const qrWrapperRef = useRef<HTMLDivElement | null>(null);

  const downloadQRCode = () => {
    const svg = qrWrapperRef.current?.querySelector("svg");

    if (!svg) {
      toast.error("QR code not ready");
      return;
    }

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();
    const blob = new Blob([svgStr], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const pngUrl = canvas.toDataURL("image/png");

      const a = document.createElement("a");
      a.href = pngUrl;
      a.download = "QR_Code.png";
      a.click();

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  if (isFetching || !userDetails?.data?.sevaId) {
    return <ShareQRProfileSkeleton />;
  }
  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5 font-mona">
      <div className="flex items-center justify-center relative mb-8">
        <button className="absolute left-0">
          <img
            src="/../icons/back-arrow-icon.svg"
            alt="back arrow"
            className="w-fit h-fit cursor-pointer"
            onClick={() =>
              navigate(`/${ROUTES.role.patient}/${ROUTES.patient.dashboard}`)
            }
          />
        </button>
        <h1 className="text-base font-medium font-mona text-[#000000] ">
          Share Profile
        </h1>
      </div>
      {/* QR Card */}
      <div className="bg-[#009FB6] rounded-3xl">
        <div ref={qrWrapperRef} className="bg-[#E8F9FF] p-6 rounded-3xl">
          <QRCode
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={profileLink}
            viewBox={`0 0 256 256`}
          />
        </div>
        <div
          className="flex justify-center gap-3 py-4 items-center w-full h-full "
          onClick={downloadQRCode}
        >
          <button className="w-fit text-[#FFFFFF] font-semibold rounded-b-2xl cursor-pointer">
            Download QR Code
          </button>
          <img src="/../icons/download-icon.svg" className="w-fit h-fit" />
        </div>
      </div>

      {/* URL + Copy Box */}
      <div className="w-full max-w-md">
        <div className="grid grid-cols-[1fr_auto_auto] items-center bg-white border rounded-xl px-4 py-3 shadow-sm gap-3">
          <span className="text-[#9E9E9E] truncate">{profileLink}</span>

          <div className="h-5 w-px bg-[#D9D9D9]" />

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 text-[#212121] font-medium text-sm cursor-pointer whitespace-nowrap"
          >
            <img
              src="/../icons/attach-icon.svg"
              className="w-4 h-4"
              alt="Copy"
            />
            {copied ? "Copied!" : "Click to Copy"}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full max-w-md flex items-center my-4">
        <div className="flex-1 h-0.5 bg-[#ECECEC]"></div>
        <span className="px-3 text-[#000000] text-sm">or</span>
        <div className="flex-1 h-0.5 bg-[#ECECEC]"></div>
      </div>

      <div className="flex items-center justify-center gap-8 mt-6 font-mona ">
        {/* SMS Button */}
        <button
          className="flex items-center gap-2 px-14 py-3 border border-[#009FB6] rounded-xl text-[#009FB6] font-semibold text-base cursor-pointer "
          onClick={() => {
            (setOpenSmsOrEmailModal(true), setModalMode)("sms");
          }}
        >
          <img
            src="/../icons/smss-icon.svg"
            alt="sms"
            className="w-fit h-fit"
          />
          SMS
        </button>

        {/* Email Button */}
        <button
          className="flex items-center gap-2 px-14 py-3 border border-[#009FB6] rounded-xl text-[#009FB6] font-semibold text-base cursor-pointer"
          onClick={() => {
            (setOpenSmsOrEmailModal(true), setModalMode)("email");
          }}
        >
          <img
            src="/../icons/emails-icon.svg"
            alt="email"
            className="w-fit h-fit"
          />
          Email
        </button>
      </div>
      <SendSmsOrEmailModal
        isOpen={openSmsOrEmailModal}
        onClose={() => setOpenSmsOrEmailModal(false)}
        // onSuccess={() => {
        //   setOpenSmsOrEmailModal(false);
        // }}
        mode={modalMode}
      />
    </div>
  );
};

export default ShareProfile;
