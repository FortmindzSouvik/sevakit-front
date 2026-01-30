import HealthProfileCrad from "./components/health-profile/HealthProfileCrad";
import MedicalAccountPrivacyComponent from "./components/med-accnt-privacy/MedicalAccountPrivacyComponent";
import MedicationCard from "./components/medication/MedicationCard";
import ProfileInfoGrid from "./components/profileInfo/ProfileInfoGrid";
import SymptomsCard from "./components/symptoms/SymptomsCard";
import ToDoCard from "./components/to-do/ToDoCard";

const PatientDashboard = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5 font-mona">
      {/*----HEALTH PROFILE CARD----*/}
      <HealthProfileCrad />

      {/*----TO-DO CARD----*/}
      <ToDoCard />

      {/*----MEDICATIONS CARD----*/}
      <MedicationCard />

      {/*----SYPTONS CARD----*/}
      <SymptomsCard />

      {/*----Profile Info CARD----*/}
      <ProfileInfoGrid />

      {/*----Medical Account Privacy section CARD----*/}

      <MedicalAccountPrivacyComponent
        title="Medical Reports"
        des="View and upload your medical documents."
        icon="/../icons/med-report-icon.svg"
        navigateTo="/patient/medical-report"
      />

      <MedicalAccountPrivacyComponent
        title="Account Settings"
        des="Manage your subscription, password, PIN."
        icon="/../icons/setting-icon.svg"
        navigateTo="/patient/account-settings"
      />

      <MedicalAccountPrivacyComponent
        title="Privacy Settings"
        des="Manage what’s visible on your share profile."
        icon="/../icons/privacy-icon.svg"
        navigateTo="/patient/privacy-settings"
      />
    </div>
  );
};

export default PatientDashboard;
