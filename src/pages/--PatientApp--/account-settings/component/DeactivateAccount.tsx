import { useState } from "react";
import DeactivateAccountModal from "./modal/DeactivateAccountModal";
import CommonSuccessModal from "@/components/modal/CommonSuccessModal";

const DeactivateAccount = () => {
  const [openDeactiveAccntModal, setOpenDeactivateAccntModal] = useState(false);
  const [isDeactivateSuccessOpen, setIsDeactivateSuccessOpen] = useState(false);

  return (
    <>
      <div className="bg-[#F5FCFF] p-5 rounded-2xl font-mona">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold">Deactivate Account</h2>
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-2xl p-4 ">
          <div className="flex items-start justify-between">
            {/* Title + Start Date */}
            <div className="font-mona">
              <p className="text-xs font-medium text-[#4A4A4A] mt-1">
                Deactivating your account will immediately prevent access to all
                KIT services. You will lose access to your subscription, app
                features, and medical tools.
              </p>
            </div>
          </div>
          <div className="w-full border-t border-[#ECECEC] mt-3"></div>
          <div className="flex justify-between items-center gap-2 mt-3">
            <button
              onClick={() => setOpenDeactivateAccntModal(true)}
              className="border rounded-lg bg-[#FCEBED] font-medium text-sm text-[#DC3545] p-3 cursor-pointer w-full capitalize"
            >
              Deactivate my acount
            </button>
          </div>
        </div>
      </div>
      <DeactivateAccountModal
        isOpen={openDeactiveAccntModal}
        onClose={() => setOpenDeactivateAccntModal(false)}
        onSuccess={() => {
          setIsDeactivateSuccessOpen(true);
        }}
      />
      <CommonSuccessModal
        isOpen={isDeactivateSuccessOpen}
        onClose={() => setIsDeactivateSuccessOpen(false)}
        desc={"Your account has been deactivated."}
        icon={"/../icons/correct-color-icon.svg"}
        autoCloseAfter={3000}
      />
    </>
  );
};

export default DeactivateAccount;
