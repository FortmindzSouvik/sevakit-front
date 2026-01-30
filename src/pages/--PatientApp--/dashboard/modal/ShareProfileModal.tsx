import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  FacebookShareButton,
  // FacebookMessengerShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  XIcon,
  EmailShareButton,
  EmailIcon,
  // FacebookMessengerIcon,
} from "react-share";
import { toast } from "sonner";
export default function ShareProfileModal({
  isOpen,
  onClose,
  userDetails,
}: {
  isOpen: boolean;
  onClose: () => void;
  userDetails?: any;
}) {
  const [copied, setCopied] = useState(false);

  const sevaId = userDetails?.data?.sevaId;

  // Dynamic base URL based on environment
  const getBaseUrl = () => {
    // Check hostname
    const hostname = window.location.hostname;
    console.log("hostname", hostname);

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
      "https://mykitbuddy.com"
    );
  };

  const profileLink = `${getBaseUrl()}/public/profile/${sevaId}`;

  const handleCopy = async () => {
    if (!profileLink) return;

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
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md p-8 rounded-3xl bg-[#FFFFFF]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
        >
          <img
            src="/../icons/cross-small-icon.svg"
            className="w-5 h-5"
            alt="close"
          />
        </button>

        <div className="flex flex-col space-y-6 font-mona">
          {/* Header */}
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-bold text-[#212121]">
              Share
            </DialogTitle>
            <p className="text-[#212121] text-base font-medium">
              Images May be subject to copyright
            </p>
          </DialogHeader>

          {/* Share Options */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 cursor-pointer">
              <FacebookShareButton
                url={profileLink}
                className="flex justify-center gap-4"
              >
                <FacebookIcon size={32} round />
                <p className="text-lg font-semibold text-[#212121]">Facebook</p>
              </FacebookShareButton>{" "}
            </div>

            <div className="flex items-center gap-4 cursor-pointer">
              <WhatsappShareButton
                url={profileLink}
                className="flex justify-center gap-4"
              >
                <WhatsappIcon size={32} round />
                <p className="text-lg font-semibold text-[#212121]">WhatsApp</p>
              </WhatsappShareButton>
            </div>

            <div className="flex items-center gap-4 cursor-pointer">
              {/* <img src="/../icons/twiter-icon.svg" alt="x" /> */}
              <TwitterShareButton
                url={profileLink}
                className="flex justify-center gap-4"
              >
                <XIcon size={32} round />
                <p className="text-lg font-semibold text-[#212121]">X</p>
              </TwitterShareButton>
            </div>

            <div className="flex items-center gap-4 cursor-pointer">
              {/* <img src="/../icons/share-email-icon.svg" alt="email" /> */}
              <EmailShareButton
                url={profileLink}
                body="body"
                className="flex justify-center gap-4"
              >
                <EmailIcon size={32} round />
                <p className="text-lg font-semibold text-[#212121]">Email</p>
              </EmailShareButton>
            </div>
          </div>

          {/* Copy Link */}
          <div onClick={handleCopy} className="cursor-pointer mt-4 select-none">
            <div className="flex gap-1.5">
              <p className="text-base text-[#212121]">
                {copied ? "Copied" : "Click to copy link"}
              </p>
              <img
                src={
                  copied
                    ? "/../icons/clipboard-check.svg"
                    : "/../icons/copy.svg"
                }
                alt="copy"
                className="w-4 h-4 mt-1.5 transition-all duration-200"
              />
            </div>
            <p
              className="text-sm font-semibold text-[#212121] underline mt-2 
              break-all whitespace-normal max-w-full"
              title={profileLink}
            >
              {profileLink}
            </p>

            {/* {copied && <p className="text-sm text-green-600 mt-1">Copied!</p>} */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
