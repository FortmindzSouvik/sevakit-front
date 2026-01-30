import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { ROUTES } from "./utils/routeConstants";

/* -------------------- Layouts -------------------- */
const AuthLayout = lazy(() => import("./layout/authlayout/AuthLayout"));
const PatientAppLayout = lazy(
  () => import("./layout/patientApplayout/PatientAppLayout"),
);
const PublicLayout = lazy(() => import("./layout/publiclayout/PublicLayout"));
const HomeLayout = lazy(() => import("./layout/homelayout/HomeLayout"));
const ProviderAppLayout = lazy(
  () => import("./layout/providerApplayout/ProviderAppLayout"),
);

/* -------------------- Home Page -------------------- */
const HomePage = lazy(() => import("./pages/--PatientApp--/home/HomePage"));

/* -------------------- Auth Pages -------------------- */
const Login = lazy(() => import("./pages/--Auth--/login/Login"));
const CreateAccount = lazy(
  () => import("./pages/--Auth--/createAccount/CreateAccount"),
);
const ParentDetails = lazy(
  () => import("./pages/--Auth--/parentDetails/ParentDetails"),
);
const SharePIN = lazy(() => import("./pages/--Auth--/sharePin/SharePIN"));
const ResetPasswordMsg = lazy(
  () => import("./pages/--Auth--/resetPasswordMsg/ResetPasswordMsg"),
);
const ResetPasswordMsgForProvider = lazy(
  () =>
    import("./pages/--Auth--/providerResetPasswordMsg/ProviderResetPasswordMsg"),
);
const NewPassword = lazy(
  () => import("./pages/--Auth--/newPassword/NewPassword"),
);
const ForgotPassword = lazy(
  () => import("./pages/--Auth--/forgotPassword/ForgotPassword"),
);
const AccountVerification = lazy(
  () => import("./components/common-pages/AccountVerification"),
);

const CreateProviderAccount = lazy(
  () => import("./pages/--Auth--/createProviderAccount/CreateProviderAccount"),
);

/* -------------------- Patients Pages -------------------- */

const PatientDashboard = lazy(
  () => import("./pages/--PatientApp--/dashboard/PatientDashboard"),
);
const PublicHealthProfile = lazy(
  () =>
    import("./pages/--PatientApp--/public-health-profile/PublicHealthProfile"),
);
const ShareProfile = lazy(
  () => import("./pages/--PatientApp--/share-profile/ShareProfile"),
);
const Symptoms = lazy(() => import("./pages/--PatientApp--/symptoms/Symptoms"));
const Medications = lazy(
  () => import("./pages/--PatientApp--/medications/Medications"),
);
const TodoList = lazy(() => import("./pages/--PatientApp--/todo/ToDoList"));

const ToDoDetailsPage = lazy(
  () => import("./pages/--PatientApp--/todo/todo-subTabs/ToDoDetailsPage"),
);
const PersonalInformation = lazy(
  () =>
    import("./pages/--PatientApp--/manage-health-profile/personalInformation/PersonalInformation"),
);
const AllergiesPage = lazy(
  () =>
    import("./pages/--PatientApp--/manage-health-profile/allergies/AllergiesPage"),
);
const Insurance = lazy(
  () =>
    import("./pages/--PatientApp--/manage-health-profile/insurance/Insurance"),
);
const EmergencyContact = lazy(
  () =>
    import("./pages/--PatientApp--/manage-health-profile/emergencyContact/EmergencyContact"),
);
const AdvancePlan = lazy(
  () =>
    import("./pages/--PatientApp--/manage-health-profile/advancePlan/AdvancePlan"),
);
const LivingWill = lazy(
  () => import("./pages/--PatientApp--/livingwill/LivingWill"),
);
const PowerOfAttorney = lazy(
  () =>
    import("./pages/--PatientApp--/manage-health-profile/power-of-attorney/PowerOfAttorney"),
);
const Pharmacy = lazy(
  () =>
    import("./pages/--PatientApp--/manage-health-profile/pharmacy/Pharmacy"),
);
const PrimaryCare = lazy(
  () =>
    import("./pages/--PatientApp--/manage-health-profile/primary-care/PrimaryCare"),
);
const CareGiver = lazy(
  () =>
    import("./pages/--PatientApp--/manage-health-profile/caregivers/CareGiver"),
);
const DriversLicense = lazy(
  () =>
    import("./pages/--PatientApp--/manage-health-profile/drivers-license/DriversLicense"),
);
const MedicalReport = lazy(
  () => import("./pages/--PatientApp--/medical-report/MedicalReport"),
);
const PrivacySettings = lazy(
  () => import("./pages/--PatientApp--/privacy-settings/PrivacySettings"),
);
const AccountSettings = lazy(
  () => import("./pages/--PatientApp--/account-settings/AccountSettings"),
);
const SubscriptionPage = lazy(
  () => import("./pages/--PatientApp--/subscription/SubscriptionPage"),
);

/* -------------------- Provider Pages -------------------- */
const ProviderDashboard = lazy(
  () => import("./pages/--ProviderApp--/dashboard/ProviderDashboard"),
);

const ProviderSubscriptionPage = lazy(
  () => import("./pages/--ProviderApp--/subscription/ProviderSubscriptionPage"),
);

const ProviderPatientsPage = lazy(
  () => import("./pages/--ProviderApp--/patients/ProviderPatientsPage"),
);

const ProviderAnalyticsPage = lazy(
  () => import("./pages/--ProviderApp--/analytics/ProviderAnalyticsPage"),
);

const ProviderHelpPage = lazy(
  () => import("./pages/--ProviderApp--/help/ProviderHelpPage"),
);

const ProviderSettingsPage = lazy(
  () => import("./pages/--ProviderApp--/settings/ProviderSettingsPage"),
);

const AddNewPatient = lazy(
  () => import("./pages/--ProviderApp--/patients/component/AddNewPatient"),
);

const ProviderPatientDetailsPage = lazy(
  () =>
    import("./pages/--ProviderApp--/patients/component/ProviderPatientDetailsPage"),
);

const AddToDoPage = lazy(
  () => import("./pages/--ProviderApp--/patients/component/AddToDoPage"),
);

const CompletedTodo = lazy(
  () => import("./pages/--ProviderApp--/patients/component/CompletedTodo"),
);


/* -------------------- Public Pages -------------------- */
const ShareHealthProfile = lazy(
  () =>
    import("./pages/--PatientApp--/public-health-profile/ShareHealthProfile"),
);

/* -------------------- Common Pages -------------------- */
const PaymentSuccessPage = lazy(
  () => import("./components/common-pages/PaymentSuccessPage"),
);
const PaymentFaildPage = lazy(
  () => import("./components/common-pages/PaymentFaildPage"),
);

const TermsNConditionPage = lazy(
  () => import("./components/common-pages/TermsNConditionPage"),
);

const PrivacyPolicyPage = lazy(
  () => import("./components/common-pages/PrivacyPolicyPage"),
);


const NotFound = lazy(() => import("./pages/--NotFound--/NotFound"));

/* -------------------- Loader -------------------- */
const PageLoader = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00BCD4] border-t-transparent" />
  </div>
);

/* -------------------- Router -------------------- */
export const router = createBrowserRouter([
  // @@ app role patient routing @@
  {
    path: `/${ROUTES.role.patient}`,
    element: (
      <Suspense fallback={<PageLoader />}>
        <PatientAppLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Navigate
            to={`/${ROUTES.role.patient}/${ROUTES.patient.dashboard}`}
          />
        ),
      },
      { path: ROUTES.patient.dashboard, element: <PatientDashboard /> },
      {
        path: ROUTES.patient.publicHealthProfile,
        element: <PublicHealthProfile />,
      },
      { path: ROUTES.patient.shareProfile, element: <ShareProfile /> },
      { path: ROUTES.patient.symptoms, element: <Symptoms /> },
      { path: ROUTES.patient.medications, element: <Medications /> },
      { path: ROUTES.patient.todoList, element: <TodoList /> },
      {
        path: `${ROUTES.patient.todoList}/${ROUTES.patient.toDodetails}`,
        element: <ToDoDetailsPage />,
      },
      {
        path: ROUTES.patient.personalInformation,
        element: <PersonalInformation />,
      },
      { path: ROUTES.patient.allergies, element: <AllergiesPage /> },
      { path: ROUTES.patient.insurance, element: <Insurance /> },
      {
        path: ROUTES.patient.emergencyContact,
        element: <EmergencyContact />,
      },
      { path: ROUTES.patient.advancePlan, element: <AdvancePlan /> },
      { path: ROUTES.patient.livingWill, element: <LivingWill /> },
      {
        path: ROUTES.patient.powerofAttorney,
        element: <PowerOfAttorney />,
      },
      { path: ROUTES.patient.pharmacy, element: <Pharmacy /> },
      {
        path: ROUTES.patient.primaryCareProvider,
        element: <PrimaryCare />,
      },
      { path: ROUTES.patient.caregiver, element: <CareGiver /> },
      {
        path: ROUTES.patient.driverLicense,
        element: <DriversLicense />,
      },
      {
        path: ROUTES.patient.medicalReport,
        element: <MedicalReport />,
      },
      {
        path: ROUTES.patient.privacySettings,
        element: <PrivacySettings />,
      },
      {
        path: ROUTES.patient.accountSettings,
        element: <AccountSettings />,
      },
      {
        path: ROUTES.patient.subscription,
        element: <SubscriptionPage />,
      },
    ],
  },

  // @@ app role provider routing @@
  {
    path: `/${ROUTES.role.provider}`,
    element: (
      <Suspense fallback={<PageLoader />}>
        <ProviderAppLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Navigate
            to={`/${ROUTES.role.provider}/${ROUTES.provider.dashboard}`}
          />
        ),
      },
      { path: ROUTES.provider.dashboard, element: <ProviderDashboard /> },
      {
        path: ROUTES.provider.analytics,
        element: <ProviderAnalyticsPage />,
      },
      {
        path: ROUTES.provider.patients,
        element: <ProviderPatientsPage />,
      },
      {
        path: ROUTES.provider.help,
        element: <ProviderHelpPage />,
      },
      {
        path: ROUTES.provider.settings,
        element: <ProviderSettingsPage />,
      },
      {
        path: ROUTES.provider.subscription,
        element: <ProviderSubscriptionPage />,
      },
      {
        path: `${ROUTES.provider.patients}/${ROUTES.provider.addPatient}`,
        element: <AddNewPatient />,
      },
      {
        path: `${ROUTES.provider.patients}/${ROUTES.provider.patientsDetails}`,
        element: <ProviderPatientDetailsPage />,
      },
      {
        path: `${ROUTES.provider.patients}/${ROUTES.provider.createToDo}`,
        element: <AddToDoPage />,
      },
      {
        path: `${ROUTES.provider.patients}/${ROUTES.provider.completeToDo}`,
        element: <CompletedTodo />,
      },
    ],
  },

  // @@ home routing @@
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <HomeLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="home" /> },
      {
        path: `/home`,
        element: <HomePage />,
      },
    ],
  },
  // @@ auth routing @@
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AuthLayout />
      </Suspense>
    ),
    children: [
      // { index: true, element: <Navigate to="login" /> },
      { path: ROUTES.auth.login, element: <Login /> },
      { path: ROUTES.auth.createAccount, element: <CreateAccount /> },
      { path: ROUTES.auth.parentDetails, element: <ParentDetails /> },
      { path: ROUTES.auth.sharePin, element: <SharePIN /> },
      {
        path: ROUTES.auth.resetPasswordMsg,
        element: <ResetPasswordMsg />,
      },
      { path: ROUTES.auth.newPassword, element: <NewPassword /> },
      {
        path: ROUTES.auth.accountVerification,
        element: <AccountVerification />,
      },
      { path: ROUTES.auth.forgotPassword, element: <ForgotPassword /> },
      {
        path: ROUTES.auth.createProviderAccount,
        element: <CreateProviderAccount />,
      },
      {
        path: ROUTES.auth.resetPasswordMsgForProvider,
        element: <ResetPasswordMsgForProvider />,
      },
    ],
  },
  // @@ public routing @@
  {
    path: "/public",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicLayout />
      </Suspense>
    ),
    children: [
      {
        path: `${ROUTES.public.profile}/:token`,
        element: <ShareHealthProfile />,
      },
    ],
  },
  { path: "/terms-condition", element: <TermsNConditionPage /> },
  { path: "/privacy-policy", element: <PrivacyPolicyPage /> },
  { path: "/payment-success", element: <PaymentSuccessPage /> },
  { path: "/payment-failed", element: <PaymentFaildPage /> },

  { path: "*", element: <NotFound /> },
]);
