import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
export default function QRCodeModal({
  isOpen,
  onClose,
  userDetails,
}: {
  isOpen: boolean;
  onClose: () => void;
  userDetails: any;
}) {
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

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md p-9 rounded-2xl ">
        <DialogTitle>{""}</DialogTitle>
        {/* Custom Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <img
            src="/../icons/cross-small-icon.svg"
            className="w-fit h-fit"
            alt="close"
          />
        </button>
        <div className="flex flex-col items-center text-center ">
          <div className="w-fit h-fit rounded-full flex items-center justify-center">
            <QRCode
              size={350}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={profileLink}
              viewBox={`0 0 256 256`}
            />
          </div>

          <DialogFooter className="w-full flex items-center justify-center gap-6 pt-4 ">
            <button
              className="w-full h-full px-8 py-4 bg-[#00BCD4] text-[#212121] rounded-xl 
                  shadow-none hover:bg-[#00BCD4] active:bg-[#00BCD4] cursor-pointer font-mona font-semibold "
              onClick={onClose}
            >
              Close
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
