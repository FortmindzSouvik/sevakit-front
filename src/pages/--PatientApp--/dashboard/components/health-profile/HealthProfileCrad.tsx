import { useRef, useState } from "react";
import SharePinModal from "../../modal/SharePinModal";
import QRCodeModal from "../../modal/QRCodeModal";
import ShareProfileModal from "../../modal/ShareProfileModal";
import { useAppSelector } from "@/redux/store";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useFetchData } from "@/hooks/useFetchData";
import { toast } from "sonner";
import QRCode from "react-qr-code";
import ReportGenerateSection from "@/pages/--PatientApp--/report/ReportGenerateSection";
import HealthProfileSkeleton from "@/components/skeletonLoader/HealthProfileSkeleton";

const HealthProfileCrad = () => {
  const [viewProfileModal, setViewProfileModal] = useState(false);
  const [shareProfileModal, setShareProfileModal] = useState(false);
  const [qrModal, setQRModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userPublicToken, setUserPublicToken] = useState("");
  const { userData } = useAppSelector((state) => state.user);
  const userId = userData?.id || "";
  const qrWrapperRef = useRef<HTMLDivElement | null>(null);
  const fullName =
    userData?.firstName || userData?.lastName
      ? `${userData?.firstName ?? ""} ${userData?.lastName ?? ""}`.trim()
      : "NA";

  const { data: userDetails, isFetching } = useFetchData(
    apiRoutes.getParticularUserList(userId),
    ["get-user-listss"],
    !!userId,
  );

  const isPublicProfileEnabled = userDetails?.data?.isPublicProfileEnabled;
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

  const handleShareProfileClick = () => {
    if (!isPublicProfileEnabled) {
      toast.error("Please enable Public Profile view to share your profile.");
      return;
    }
    setShareProfileModal(true);
  };
  const downloadQRCode = () => {
    if (!isPublicProfileEnabled) {
      toast.error("Please enable Public Profile view to share your profile.");
      return;
    }
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

  const handleCopy = async (sevaId?: string) => {
    if (!sevaId) return;

    try {
      await navigator.clipboard.writeText(profileLink);
      setCopied(true);
      // toast.success("Seva ID copied");

      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error("Failed to copy", err);
      toast.error("Failed to copy");
    }
  };
  const [dwnldUserReportModal, setDwnldUserReportModal] = useState(false);
  const handleDownloadReportClick = () => {
    if (!isPublicProfileEnabled) {
      toast.error("Please enable Public Profile view to share your profile.");
      return;
    }
    setDwnldUserReportModal(true);
    setUserPublicToken(sevaId);
  };

  const handleViewProfileClick = () => {
    if (!isPublicProfileEnabled) {
      toast.error("Please enable Public Profile view to share your profile.");
      return;
    }
    setViewProfileModal(true);
  };

  // Skeleton Loader
  if (isFetching || !userDetails) {
    return <HealthProfileSkeleton />;
  }

  return (
    <div className="bg-[#E8F9FF] rounded-3xl shadow-md overflow-hidden font-mona">
      {/* Top Section */}
      <div className="p-5 flex items-start justify-between">
        <div>
          <p className="font-semibold text-[#000000]">Health Profile</p>
        </div>

        <button className="flex items-center space-x-2 text-xs font-semibold text-[#009FB6] ">
          <span>Share Profile</span>
          <img
            src="/../icons/share-blue-icon.svg"
            alt="share"
            className={`w-fit h-fit ${
              !isPublicProfileEnabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={handleShareProfileClick}
          />
        </button>
      </div>

      {/* Profile Info */}
      <div className="px-4 flex items-center space-x-4 font-mona cursor-pointer">
        <div className="relative w-[115px] h-[120px] bg-white rounded-2xl flex items-center justify-center shadow-sm">
          {/* QR Code */}
          <div className="absolute inset-0 flex items-center justify-center">
            <QRCode
              size={90}
              value={profileLink}
              onClick={() => setQRModal(true)}
            />
          </div>
        </div>

        <div>
          <p className="text-2xl font-semibold text-[#000000] capitalize">
            {fullName}
          </p>
          <div className="flex gap-1">
            <p className=" text-[#000000] ">{userData?.sevaId || "NA"}</p>

            <img
              src={
                copied
                  ? "/../icons/correct-color-icon.svg"
                  : "/../icons/copy-alt-color-icon.svg"
              }
              alt="copy"
              className="w-4 h-4 mt-1 cursor-pointer transition-all"
              onClick={() => handleCopy(userData?.sevaId)}
            />
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="grid grid-cols-3 text-center bg-[#009FB6] mt-4 py-4.5 px-10 gap-12">
        <div className="flex flex-col items-center cursor-pointer">
          <img
            src="/../icons/white-pdf-icon.svg"
            alt="pdf"
            className={`w-fit h-fit mb-1 ${
              !isPublicProfileEnabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={handleDownloadReportClick}
          />
          <span className="text-xs text-[#FFFFFF] font-mona">PDF Report</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer">
          <div ref={qrWrapperRef} style={{ display: "none" }}>
            <QRCode value={profileLink} size={300} />
          </div>
          <img
            src="/../icons/dwnld-white-icon.svg"
            alt="dwnld"
            className={`w-fit h-fit mb-1 ${
              !isPublicProfileEnabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={downloadQRCode}
          />
          <span className="text-xs text-[#FFFFFF] font-mona">Download QR</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer">
          <img
            src="/../icons/view-profile-icon.svg"
            alt="profile"
            className={`w-fit h-fit mb-1 ${
              !isPublicProfileEnabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onClick={handleViewProfileClick}
          />
          <span className="text-xs text-[#FFFFFF] font-mona">View Profile</span>
        </div>
      </div>

      <SharePinModal
        isOpen={viewProfileModal}
        onClose={() => setViewProfileModal(false)}
        onSuccess={() => {
          setViewProfileModal(false);
        }}
      />

      <QRCodeModal
        isOpen={qrModal}
        onClose={() => setQRModal(false)}
        userDetails={userDetails}
      />

      <ShareProfileModal
        isOpen={shareProfileModal}
        onClose={() => setShareProfileModal(false)}
        userDetails={userDetails}
      />

      <ReportGenerateSection
        isOpen={dwnldUserReportModal}
        onClose={() => {
          (setDwnldUserReportModal(false), setUserPublicToken(""));
        }}
        userPublicToken={userPublicToken}
      />
    </div>
  );
};

export default HealthProfileCrad;
