import { Button } from "../ui/button";

export default function PaymentFaildPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-5xl rounded-3xl flex flex-col items-center justify-center py-24 px-6 text-center">
        {/* Success Icon */}
        <div className="mb-10">
          <img
            src="/../icons/cross-color-icon.svg"
            alt="success"
            className="w-32 h-32"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-semibold text-black font-mona">
          Payment Failed!
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-[#424242] mt-4 font-mona">
          Your subscription is failed. Please try after some time.
        </p>

        {/* Go Home Button */}
        <Button
          className="mt-4 px-9 py-7 bg-[#00BCD4] text-[#212121] rounded-xl text-lg font-mona hover:bg-[#00B0C7] "
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}
