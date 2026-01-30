import { ROUTES } from "@/utils/routeConstants";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <main className="bg-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-10 text-center font-mona">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full bg-[#E8F9FF] px-5 py-2 text-[14px] font-medium text-[#000000]">
            Built for patients &amp; providers
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight text-[#000000] md:text-5xl">
            Your health records. Secure, organized, and always accessible.
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-4 max-w-5xl text-base text-[#000000] md:text-lg">
            Store, manage, and share your health information securely with the
            people who matter—when it matters most.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              className="rounded-md bg-[#00BCD4] px-6 py-3 text-sm font-medium text-[#000000] cursor-pointer"
              onClick={() => navigate(`/${ROUTES.auth.login}`)}
            >
              Sign in
            </button>

            <button
              className="rounded-md border border-[#00BCD4] px-6 py-3 text-sm font-medium text-cyan-600 transition cursor-pointer"
              onClick={() => navigate(`/${ROUTES.auth.createAccount}`)}
            >
              Sign up
            </button>

            <span className="hidden sm:block text-gray-400">|</span>

            <button className="rounded-md border border-[#00BCD4] px-6 py-3 text-sm font-medium text-cyan-600  transition cursor-pointer">
              Learn more
            </button>
          </div>
        </div>

        {/* APP PREVIEW */}
        <div className="relative mx-auto max-w-5xl px-4 pb-14">
          {/* App Header */}
          <div className="flex items-center justify-between  px-6 py-4">
            <div className="flex items-center gap-2">
              <img
                src="/../icons/home-screen-1-icon.svg"
                alt="screen-1"
                className="w-fit h-fit"
              />
            </div>
          </div>
        </div>
      </section>

      {/* why kit helps to do section */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 font-mona">
          {/* Heading */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-[#000000]">
              What KIT Helps You Do
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[#000000] font-medium text-[16px]">
              A single place to organize your health—and
              <br className="hidden sm:block" />
              share it safely when it matters most.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 font-mona">
            {/* Card 1 */}
            {/* <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="rounded-xl border bg-cyan-50 p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  {[
                    "Personal Info",
                    "Allergies",
                    "Insurance",
                    "Emergency Contact",
                    "Advanced Care Plan",
                    "Living Will",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex flex-col items-center justify-center gap-2 rounded-lg bg-white p-4 shadow-sm"
                    >
                      <div className="h-10 w-10 rounded-full bg-cyan-100" />
                      <span className="text-xs font-medium text-gray-700">
                        {item}
                      </span>
                      <img src="/../icons/home-screen-all-tabs-icon.svg" />
                    </div>
                  ))}
                </div>
              </div>

              <h3 className="mt-6 text-lg font-semibold text-[#000000]">
                Keep everything in one place
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Stop juggling apps, papers, emails, and portals. KIT brings your
                medications, medical reports, insurance details, emergency
                contacts, and personal health information into one secure,
                organized record—always up to date and easy to access.
              </p>
              <p className="mt-3 text-sm font-medium text-gray-800">
                No more searching. Everything lives where it belongs.
              </p>
            </div> */}
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="rounded-xl border p-5 flex justify-center">
                <img
                  src="/../icons/rectanle-icon.svg"
                  alt="Health profile sections"
                  className="max-w-full object-contain w-fit h-fit"
                />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-[#000000]">
                Keep everything in one place
              </h3>

              <p className="mt-3 text-sm font-normal text-[#000000]">
                Stop juggling apps, papers, emails, and portals. KIT brings your
                medications, medical reports, insurance details, emergency
                contacts, and personal health information into one secure,
                organized record—always up to date and easy to access.
              </p>

              <p className="mt-3 text-sm font-medium text-[#000000]">
                No more searching. Everything lives where it belongs.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="rounded-xl border p-5 flex justify-center">
                <img
                  src="/../icons/health-profile.svg"
                  alt="Health profile sections"
                  className="max-w-full object-contain w-fit h-fit"
                />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-[#000000]">
                Share safely when needed
              </h3>
              <p className="mt-3 text-sm font-normal text-[#000000]">
                When a doctor, caregiver, or emergency responder needs your
                information, sharing is instant and secure. Use a protected link
                or QR code to share your health profile—only with people you
                trust, and only when you choose.
              </p>
              <p className="mt-3 text-sm font-medium text-[#000000]">
                Fast access in emergencies. No guessing. No delays.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="rounded-xl border p-5 flex justify-center">
                <img
                  src="/../icons/make-my-profile-icon.svg"
                  alt="Health profile sections"
                  className="max-w-full object-contain w-fit h-fit"
                />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-[#000000]">
                Stay in control
              </h3>
              <p className="mt-3 text-sm font-normal text-[#000000]">
                Your health data is yours. Decide exactly what information is
                visible, what stays private, and who can see it. Change
                permissions anytime—nothing is shared without your consent.
              </p>
              <p className="mt-3 text-sm font-medium text-[#000000]">
                Privacy first. Always.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="rounded-xl border p-5 flex justify-center">
                <img
                  src="/../icons/emergency-contact-icon.svg"
                  alt="Health profile sections"
                  className="max-w-full object-contain w-fit h-fit"
                />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-[#000000]">
                Designed for real life
              </h3>
              <p className="mt-3 text-sm font-normal text-[#000000]">
                Health doesn’t follow a schedule. KIT is built for everyday
                care, unexpected emergencies, follow-ups, prescriptions, and
                long-term planning—so you’re prepared whether things are calm or
                chaotic.
              </p>
              <p className="mt-3 text-sm font-medium text-[#000000]">
                Because real health journeys aren’t linear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* build for every one */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 font-mona">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-[#000000]">
              Built for everyone involved in your care
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[#000000]">
              Whether you’re managing your own health or caring for others, KIT
              adapts to your role—securely and simply.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* For Patients */}
            <div className="rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
              {/* Header */}
              <div className="mb-8 flex items-center">
                <img src="/../icons/one-icon.svg" className="w-fit h-fit" />
                <img
                  src="/../icons/patient-icon.svg"
                  alt="Patients"
                  className="h-fit w-fit -ml-3"
                />
              </div>

              <h3 className="text-lg font-semibold text-[#000000]">
                For Patients
              </h3>

              <p className="mt-2 text-[16px] text-[#000000]">
                KIT gives you a secure, always-available home for your health
                information—so you’re prepared for everyday care and unexpected
                moments.
              </p>

              {/* Features */}
              <div className="mt-4">
                <p className="mb-2 text-sm font-semibold text-[#000000]">
                  Features:
                </p>
                <ul className="space-y-3 text-sm text-[#000000] font-medium">
                  {[
                    "Manage your personal health record in one place",
                    "Store medications, medical reports, insurance, and emergency details",
                    "Share your health profile securely via QR code or private link",
                    "Control exactly what information is visible and to whom",
                    "Access your records anytime, from any device",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <img
                        src="/../icons/correct-sign-icon.svg"
                        className="w-fit h-fit"
                      />

                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <button className="mt-10 w-full rounded-md border border-cyan-400 py-3 text-sm font-medium text-[#009FB6]  transition cursor-pointer">
                Get started
              </button>
            </div>

            {/* For Providers */}
            <div className="rounded-2xl border border-gray-100 bg-white p-10 shadow-sm">
              {/* Header */}
              <div className="mb-8 flex items-center gap-6">
                <img src="/../icons/two-icon.svg" className="w-fit h-fit" />
                <img
                  src="/../icons/provider-icon.svg"
                  alt="Providers"
                  className="h-fit w-fit -ml-11"
                />
              </div>

              <h3 className="text-lg font-semibold text-[#000000]">
                For Providers
              </h3>

              <p className="mt-2 text-[16px] text-[#000000]">
                KIT helps healthcare providers connect patients to a secure
                health record, upload critical documents, and support care
                coordination—without compromising privacy.
              </p>

              {/* Features */}
              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-[#000000]">
                  Features:
                </p>
                <ul className="space-y-3 text-sm text-[#000000] font-medium">
                  {[
                    "Register patients and invite them to complete their account",
                    "Upload and manage medical documents securely",
                    "View patient records only with explicit consent",
                    "Support care coordination with up-to-date information",
                    "Built with compliance and auditability in mind",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <img
                        src="/../icons/correct-sign-icon.svg"
                        className="w-fit h-fit"
                      />

                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <button className="mt-10 w-full rounded-md border border-cyan-400 py-3 text-sm font-medium text-[#009FB6] transition cursor-pointer">
                Get started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* security */}
      <section className="bg-white pb-20">
        <div className="mx-auto max-w-7xl px-4 font-mona">
          {/* Heading */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-[#000000]">
              Built with security at its core
            </h2>
            <p className="mx-auto mt-3  text-[#000000]">
              Your health information is protected using modern security
              standards—designed to keep your data private, accurate, and under
              your control.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-2xl bg-linear-to-b from-white to-[#E8F9FF] p-5 text-center shadow-sm">
              <img
                src="/../icons/encrypted-design-icon.svg"
                alt="Encrypted by Design"
                className="mx-auto mb-6 h-fit w-fit"
              />

              <h3 className="text-lg font-semibold text-[#000000]">
                Encrypted by Design
              </h3>

              <p className="mt-3 text-[16px] text-[#000000]">
                All data is encrypted in transit and at rest, ensuring your
                information stays protected while it is being transmitted and
                stored. This means your records are unreadable to unauthorized
                parties—always.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl bg-linear-to-b from-white to-[#E8F9FF] p-5 text-center shadow-sm">
              <img
                src="/../icons/hipa-icon.svg"
                alt="HIPAA Aligned"
                className="mx-auto mb-6 h-fit w-fit"
              />

              <h3 className="text-lg font-semibold text-[#000000]">
                HIPAA-Aligned Infrastructure
              </h3>

              <p className="mt-3 text-[16px] text-[#000000]">
                KIT is built on infrastructure designed to meet HIPAA security
                and privacy requirements. From access controls to audit trails,
                security is embedded into every layer of the platform—not added
                later.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl bg-linear-to-b from-white to-[#E8F9FF] p-5 text-center shadow-sm">
              <img
                src="/../icons/secure-icon.svg"
                alt="Secure Access"
                className="mx-auto mb-6 h-fit w-fit"
              />

              <h3 className="text-lg font-semibold text-[#000000]">
                Secure Access &amp; Identity Protection
              </h3>

              <p className="mt-3 text-[16px] text-[#000000]">
                Access to your account is protected using strong passwords and
                multi-factor authentication (MFA). This ensures only you—and
                those you explicitly authorize—can access your health
                information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* get started CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 font-mona">
          <div className="rounded-3xl bg-linear-to-b from-white to-[#E8F9FF] px-6 py-20 text-center md:px-16">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Start managing your health records today
            </h2>

            <p className="mx-auto mt-4 text-[16px] text-[#000000]">
              Create your secure KIT account and keep your health information
              organized, private, and ready when you need it.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                type="button"
                className="rounded-md bg-[#00BCD4] px-8 py-3 text-sm font-medium text-[#000000] transition cursor-pointer"
                onClick={() => navigate(`/${ROUTES.auth.createAccount}`)}
              >
                Sign up
              </button>

              <button
                type="button"
                className="rounded-md border border-[#00BCD4] px-8 py-3 text-sm font-medium text-[#00BCD4] transition cursor-pointer"
                onClick={() => navigate(`/${ROUTES.auth.login}`)}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
