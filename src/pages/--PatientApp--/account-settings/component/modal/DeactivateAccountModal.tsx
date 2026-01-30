import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePostJson } from "@/hooks/usePostJson";
import { clearUserData } from "@/redux/slices/userSlice";
import { useAppDispatch } from "@/redux/store";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { ROUTES } from "@/utils/routeConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosError } from "axios";
import { Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import * as yup from "yup";

type PINForm = {
  pin: string;
};
/* ---------------- VALIDATION SCHEMA ---------------- */
const schema = yup.object().shape({
  pin: yup.string().required("pin is required"),
});

const DeactivateAccountModal = ({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPin, setShowPin] = useState(false);
  const { mutateAsync: deactivateAccount, isPending } = usePostJson([
    "deactivate-account",
  ]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = async (data: PINForm) => {
    try {
      await deactivateAccount({
        endpoint: apiRoutes.deactivateAccount,
        data: {
          pin: data.pin,
        },
      });
      onClose();
      reset();
      onSuccess();
      setTimeout(() => {
        dispatch(clearUserData());
        navigate(`/${ROUTES.auth.login}`);
      }, 3000);
    } catch (error) {
      let message = "Failed to deactivate account";

      if (error instanceof AxiosError) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      console.log("error in update password", error);
      toast.error(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md p-10 rounded-2xl">
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
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-fit h-fit rounded-full flex items-center justify-center">
            <img
              src="/../icons/!-sign-color-icon.svg"
              alt="!-sign"
              className="w-fit h-fit"
            />
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#000000] font-mona">
              Are you sure you want to deactivate your account?
            </DialogTitle>
          </DialogHeader>

          <p className="text-[#444444] text-[15px] leading-relaxed font-mona">
            This action is permanent until you contact support. All app access
            will be disabled immediately. To continue, enter your 6-digit PIN.
          </p>

          <DialogFooter className="w-full flex items-center justify-center gap-6">
            <form
              className="space-y-6 w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* pin */}
              <div>
                <div
                  className={`flex items-start gap-3 w-full border rounded-xl bg-white px-3 py-2.5 mb-6 ${
                    errors.pin ? "border-red-500" : "border-[#ECECEC]"
                  }`}
                >
                  <img
                    src="/../icons/lock-icon.svg"
                    alt="lock"
                    className="w-4 h-4 mt-2.5"
                  />

                  <div className="h-6 w-px bg-[#D9D9D9] mt-1.5" />

                  <div className="flex flex-col w-full relative">
                    <label className="text-[12px] text-[#616161] font-medium font-mona w-fit">
                      Pin
                    </label>

                    <Input
                      type={showPin ? "text" : "password"}
                      placeholder="Enter pin"
                      autoComplete="current-pin"
                      {...register("pin")}
                      className="border-0 shadow-none p-0 mt-0.5 h-5 pr-6 focus-visible:ring-0 text-[14px]"
                    />

                    {/* SHOW/HIDE BUTTON */}
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-0 top-3"
                    >
                      {showPin ? (
                        <Eye size={16} />
                      ) : (
                        <img
                          src="/../icons/eye-cross-icon.svg"
                          className="w-4 h-4"
                          alt="hide"
                        />
                      )}
                    </button>
                  </div>
                </div>
                {errors.pin && (
                  <p className="text-red-500 text-xs -mt-4 ml-1 w-fit">
                    {errors.pin.message}
                  </p>
                )}
              </div>
              <div className="flex gap-3 w-full ">
                <button
                  onClick={() => onClose()}
                  className="w-1/2 h-fit border border-[#00BCD4] text-[#00BCD4] rounded-xl font-medium cursor-pointer font-mona p-4"
                >
                  Cancel{" "}
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="flex justify-center items-center gap-1 w-1/2 h-fit bg-[#FF5A54] rounded-xl shadow-none text-[#212121] cursor-pointer font-mona p-4"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />{" "}
                      Deactivating...
                    </>
                  ) : (
                    "Deactivate Account"
                  )}
                </button>
              </div>
            </form>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeactivateAccountModal;
