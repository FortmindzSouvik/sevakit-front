import { useEffect, useState } from "react";
import { useFetchData } from "@/hooks/useFetchData";
import useUpdateData from "@/hooks/useUpdateData";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { toast } from "sonner";

type VisibilityKey =
  | "isEmergencyContactVisible"
  | "isSymptomsVisible"
  | "isAllergiesVisible"
  | "isAdvancedCarePlanVisible"
  | "isWillVisible"
  | "isPowerOfAttorneyVisible"
  | "isPharmacyVisible"
  | "isPrimaryCareDoctorVisible"
  | "isCaregiversVisible"
  | "isMedicationsVisible"
  | "isInsuranceVisible"
  | "isDrivingLicenseVisible"
  | "isDrivingLicenseDocumentsVisible";

export const useSectionVisibility = (
  userId: string,
  visibilityKey: VisibilityKey
) => {
  const [isVisible, setIsVisible] = useState(false);

  // Fetch user details
  const { data: userDetails } = useFetchData(
    apiRoutes.getParticularUserList(userId),
    ["get-user-particular-list"],
    !!userId
  );

  const { mutateAsync: updateUserDetails, isPending } = useUpdateData([
    "update-user-visibility",
  ]);

  // Sync local state from API
  useEffect(() => {
    const value = userDetails?.data?.[visibilityKey];
    if (typeof value === "boolean") {
      setIsVisible(value);
    }
  }, [userDetails, visibilityKey]);

  // Toggle with optimistic update
  const toggleVisibility = async (value: boolean) => {
    setIsVisible(value);

    try {
      await updateUserDetails({
        endpoint: apiRoutes.updateUserDetails(userId),
        data: {
          [visibilityKey]: value,
        },
      });
    } catch (error) {
      setIsVisible(!value); // rollback
      toast.error("Failed to update visibility");
    }
  };

  return {
    isVisible,
    toggleVisibility,
    isUpdating: isPending,
  };
};
