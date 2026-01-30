import PrivacySettingsSkeleton from "@/components/skeletonLoader/PrivacySettingSkeleton";
import { useFetchData } from "@/hooks/useFetchData";
import useUpdateData from "@/hooks/useUpdateData";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import VisibilityRow from "./component/VisibilityRow";
import { Switch } from "@/components/ui/switch";
import { usePostJson } from "@/hooks/usePostJson";

type PrivacyState = Record<string, boolean>;

const PrivacySettings = () => {
  const navigate = useNavigate();
  const [privacy, setPrivacy] = useState<PrivacyState>({});

  const { data, isFetching } = useFetchData(
    apiRoutes.getPrivacySettings,
    ["privacy-settings"],
    true
  );

  const { mutateAsync: updateSetting } = useUpdateData([
    "update-privacy-setting",
  ]);

  const { mutateAsync: updatePublicProfileEnable } = usePostJson([
    "update-public-profile",
  ]);

  useEffect(() => {
    if (data?.data) {
      setPrivacy(data.data);
    }
  }, [data]);

  const handleToggle = async (key: string, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));

    try {
      await updateSetting({
        endpoint: apiRoutes.updatePrivacySetting,
        data: { [key]: value },
      });
    } catch (error) {
      setPrivacy((prev) => ({ ...prev, [key]: !value }));
      toast.error("Failed to update privacy setting");
    }
  };

  const handlePublicProfileToggle = async (key: string, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));

    try {
      await updatePublicProfileEnable({
        endpoint: apiRoutes.updatePublicProfileEnable,
        data: { enable: value },
      });
    } catch (error) {
      setPrivacy((prev) => ({ ...prev, [key]: !value }));
      toast.error("Failed to update public profile enabling");
    }
  };

  return (
    <div className="main max-w-md mx-auto px-4 py-6 space-y-5 font-mona">
      {/* HEADER (always visible) */}
      <div className="flex items-center justify-center relative mb-8">
        <button className="absolute left-0">
          <img
            src="/../icons/back-arrow-icon.svg"
            alt="back arrow"
            className="cursor-pointer"
            onClick={() =>
              navigate(`/${ROUTES.role.patient}/${ROUTES.patient.dashboard}`)
            }
          />
        </button>
        <h1 className="text-base font-medium">Privacy Settings</h1>
      </div>

      {isFetching ? (
        <PrivacySettingsSkeleton />
      ) : (
        <div className="bg-[#F5FCFF] p-5 rounded-2xl">
          {/* PROFILE PUBLIC */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Make My Profile Public</h2>
              <p className="text-[#00AFC1] text-sm">
                Your profile is visible to anyone with your profile link.
              </p>
            </div>
            <Switch
              className="w-12 h-6 data-[state=checked]:bg-[#00C5D7] data-[state=unchecked]:bg-gray-300"
              checked={privacy.isPublicProfileEnabled}
              onCheckedChange={(v) =>
                handlePublicProfileToggle("isPublicProfileEnabled", v)
              }
            />
          </div>

          {/* SETTINGS LIST */}
          {[
            {
              key: "isProfilePictureVisible",
              title: "Profile Photo",
              desc: "Your profile picture for identification purposes.",
            },
            {
              key: "isIdentityVisible",
              title: "Personal Identity",
              desc: "Basic personal information including name, gender, and date of birth.",
            },
            {
              key: "isContactVisible",
              title: "Personal Contact",
              desc: "Contact information including phone number and email address.",
            },
            {
              key: "isAddressVisible",
              title: "Personal Address",
              desc: "Your home address and location information.",
            },
            {
              key: "isAllergiesVisible",
              title: "Allergies",
              desc: "Important allergy information for emergency medical care.",
            },
            {
              key: "isPharmacyVisible",
              title: "Pharmacy",
              desc: "Your preferred pharmacy information for prescriptions.",
            },
            {
              key: "isMedicationsVisible",
              title: "Medications",
              desc: "Current medications, dosages, and prescription information.",
            },
            {
              key: "isSymptomsVisible",
              title: "Symptoms",
              desc: "Current symptoms and health concerns you are experiencing.",
            },
            {
              key: "isInsuranceVisible",
              title: "Insurance",
              desc: "Health insurance provider, member ID, and coverage information.",
            },
            {
              key: "isEmergencyContactVisible",
              title: "Emergency Contact",
              desc: "Contact information for your emergency contact person.",
            },
            {
              key: "isAdvancedCarePlanVisible",
              title: "Advance Care Plan",
              desc: "Your resuscitation preferences and code status documents.",
            },
            {
              key: "isWillVisible",
              title: "Living Will",
              desc: "Living will and advance directive information",
            },
            {
              key: "isPowerOfAttorneyVisible",
              title: "Power of Attorney",
              desc: "Power of attorney designation and digital copies.",
            },
            {
              key: "isPrimaryCareDoctorVisible",
              title: "Care Providers",
              desc: "Your primary care physician and medical facility information.",
            },
            {
              key: "isCaregiversVisible",
              title: "Caregivers",
              desc: "Information about people who help you manage your health care.",
            },
            {
              key: "isDrivingLicenseVisible",
              title: "Driver’s License",
              desc: "Digital copies of your driver’s license for identification",
            },
          ].map((item) => (
            <div key={item.key} className="bg-white rounded-2xl p-4 mt-3">
              <VisibilityRow
                title={item.title}
                desc={item.desc}
                value={privacy[item.key]}
                onChange={(v) => handleToggle(item.key, v)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PrivacySettings;
