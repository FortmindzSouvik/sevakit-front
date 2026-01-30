import CheckPhoneEmailModal from "@/components/modal/CheckPhoneEmailModal";
import { useUserRequestNewPasswordLink } from "@/hooks/useUserAuth";
import { ROUTES } from "@/utils/routeConstants";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

export interface PhoneVerifyPayload {
  // firstName: string;
  // lastName: string;
  phoneNumber: string;
}

const ResetPasswordMsg = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || null;
  // const firstName = location.state?.firstName || null;
  // const lastName = location.state?.lastName || null;
  const [existsModal, setExistsModal] = useState(false);

  const { mutateAsync: requestnewPasswordLink } =
    useUserRequestNewPasswordLink();

  // const phoneWithoutPlus = phoneNumber ? phoneNumber.replace("+", "") : "";

  const handleContinueClick = async () => {
    const payload = {
      // firstName: firstName.toLowerCase(),
      // lastName: lastName.toLowerCase(),
      phoneNumber: phoneNumber,
    };
    try {
      const resp = await requestnewPasswordLink(payload);

      const exists = resp?.isSuccess === true;

      if (exists) {
        setExistsModal(true);
      }
    } catch (error) {
      console.error("reset link send failed:", error);
      console.log("reset link send failed", error);
    }
  };
  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8 font-mona">
        <h1 className="font-mona text-3xl font-display font-bold text-[#000000] mb-2">
          Set Up Your KIT Password
        </h1>
        <p className="font-mona text-[#000000]">
          We found an existing KIT account matching your details.
        </p>

        <p className="font-mona text-[#000000] mt-10">
          To claim this account, we’ve sent a secure verification link to your
          phone number:{" "}
          <span className="font-bold px-2">
            {phoneNumber || "+1 (555) 337-5522"}
          </span>
        </p>

        <p className="font-mona text-[#000000] mt-10">
          Tap the link in the text message to continue. You’ll be able to set a
          new password on the next screen.
        </p>
      </div>

      <div className="flex items-center gap-4 mt-6 font-mona ">
        {/* Back Button */}
        <button
          type="button"
          className="w-full h-[55px] border border-[#00BCD4] text-[#00BCD4] rounded-xl font-medium cursor-pointer "
          onClick={() => navigate(`/${ROUTES.auth.createAccount}`)}
        >
          Not My Number
        </button>

        {/* Continue Button */}
        <button
          type="submit"
          className="w-full h-[55px] bg-[#00BCD4] text-[#000000] rounded-xl font-medium cursor-pointer"
          onClick={() => handleContinueClick()}
        >
          Continue
        </button>
      </div>
      <CheckPhoneEmailModal
        isOpen={existsModal}
        onClose={() => setExistsModal(false)}
        payload={{
          // firstName: firstName?.toLowerCase(),
          // lastName: lastName?.toLowerCase(),
          phoneNumber: phoneNumber,
        }}
      />
    </div>
  );
};

export default ResetPasswordMsg;
