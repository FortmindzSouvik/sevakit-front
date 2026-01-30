import { Link } from "react-router";
import ScrollToTop from "../scrollToTop/ScrollToTop";
import PersonalInformationComponent from "./privacy-policy-components/PersonalInformationComponent";
import SourcesOfPersonalInformationComponent from "./privacy-policy-components/SourcesOfPersonalInformationComponent";
import HowWeUseInformationComponent from "./privacy-policy-components/HowWeUseInformationComponent";
import SharingInformationComponent from "./privacy-policy-components/SharingInformationComponent";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: (
      <>
        This Privacy Notice describes how we use and disclose Personal
        Information (defined below) that we collect, receive, and store about
        you in connection with the use of our website,{" "}
        <a target="_blank" href="https://www.MyKitBuddy.com" rel="noreferrer">
          https://www.MyKitBuddy.com
        </a>
        , well a sand any other website(s) that we may operate (collectively and
        together with any subdomains and the content and services therein,
        called the <b>“Site”</b>), as well as through or in connection with your
        use of our mobile application(s) (individually and collectively, called
        the <b>“App”</b>). Our Site and our App, in conjunction with ancillary
        services that we offer, is collectively referred to in this Policy as
        the <b>“Services” </b> . <br /> <br />
        “Personal Information” means any information relating to a natural
        person who can be identified by reference to an identifier that can be
        used alone or in combination with other information, such as a name, an
        identification/account number, location data, an online identifier, or
        to one or more factors specific to the physical, physiological, genetic,
        mental, economic, cultural, or social identity of that person. In some
        cases, IP addresses may also be considered Personal Information.
        <br />
        <br /> This Policy should be read in conjunction with our Terms of Use (
        <b>“Terms”</b>), as it is incorporated into and made a part of those
        Terms. If you have any questions about this Policy or how we use your
        Personal Information or other data, please feel free to contact us at {" "}
        <a
          style={{ textDecoration: "underline", color: "#111" }}
          href="mailto:conatct@mykitbuddy.com"
        >
          contact@mykitbuddy.com
        </a>
        .
      </>
    ),
  },
  {
    id: "personal-information",
    title: "What Personal Information We Collect About You May Include",
    content: (
      <>
        <PersonalInformationComponent />
      </>
    ),
  },
  {
    id: "sources-personal-information",
    title: "Sources of Personal Information",
    content: (
      <>
        <SourcesOfPersonalInformationComponent />
      </>
    ),
  },
  {
    id: "third-party-websites",
    title: "Third Party Websites",
    content: (
      <p>
        Our Services may contain links to, or otherwise allow you to interact
        with, certain third-party websites, mobile applications, and services
        that are not owned or controlled by Seva Healthcare IT LLC (each a
        "Third Party Service"). We are not responsible for the privacy practices
        or the content of these Third-Party Services, and we encourage you to
        read the terms and conditions and privacy policy of any such Third-Party
        Service that you choose to use.
      </p>
    ),
  },
  {
    id: "how-use-information",
    title: "How We Use Your Information",
    content: (
      <>
        <HowWeUseInformationComponent />
      </>
    ),
  },
  {
    id: "consent-modification",
    title: "Your Consent and Modification",
    content: (
      <>
        <p>
          Please read this Policy with diligence and review it periodically, as
          your use of our Services constitutes consent to this Policy. We will
          periodically update this Policy, and any changes will be reflected
          here. If the changes are significant, we may provide a more prominent
          notice, and at our discretion, may contact you directly with
          information on the same. If you do not agree with the practices
          described in this Policy, you should not use our Services or otherwise
          interact with Seva Healthcare IT LLC.{" "}
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: (
      <>
        <p>
          We will store your personal information for no longer than is
          necessary for the performance of our obligations or to achieve the
          purposes for which the information was collected, or as may be
          required or permitted under applicable law. To determine the
          appropriate retention period, we will consider the amount, nature, and
          sensitivity of the data; the potential risk of harm from unauthorized
          use or disclosure of the data; the purposes for which we process the
          data and whether we can achieve those purposes through other means;
          and the applicable legal requirements. Unless otherwise required by
          applicable law, at the end of the retention period we will remove
          personal information from our systems and records or take appropriate
          steps to properly anonymize, de-identify, or aggregate it, where
          legally applicable.
          <br />
          We may aggregate or otherwise anonymize the data we collect for
          purposes of analytics, research, marketing, and other legitimate
          business interests. Personal Information or information that can
          identify you as an individual or reasonably be used to identify you
          will not be disclosed in any such aggregated or anonymized data
          set.{" "}
        </p>
      </>
    ),
  },
  {
    id: "sharing-information",
    title: "Sharing Information",
    content: (
      <>
        <SharingInformationComponent />
      </>
    ),
  },
  {
    id: "protecting-personal-information",
    title: "Protecting Personal Information  ",
    content: (
      <>
        <p>
          Seva Healthcare IT LLC is concerned with protecting your privacy and
          data and we use secure server. This secure server software, Secure
          Sockets Layer (SSL), encrypts all information you input before it is
          sent to us. Furthermore, all customer transactional data we collect is
          protected against unauthorized access with the use of digital
          certificates. Digital certificates for Seva Healthcare IT LLC are
          issued by Amazon RSA 2048 M02 Organization, one of the most
          established signers of digital certificates. We provide reasonable
          technical, administrative, and physical controls to secure
          confidentiality, integrity, and availability of personal information.
          If you have any questions about security on the Seva Healthcare IT LLC
          Websites, you may contact us at{" "}
          <a
            href="mailto:contact@mykitbuddy.com"
            style={{ textDecoration: "underline", color: "#111" }}
          >
            contact@mykitbuddy.com
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "choices-accuracy-personal-information",
    title: "Your Choices & Accuracy of Personal Information",
    content: (
      <>
        <p>
          Providing the Personal Information is your discretion but Services by
          or through Site or App requires you to register by providing your
          Personal Information.
          <br /> If you do provide us with Personal Information, we want to make
          sure it remains accurate and up to date. You can use the features
          available through your user account to modify or remove certain
          information related to your user account. If you need to correct or
          update any other part(s) of your Personal Information, you can also
          submit a change request directly by emailing us at{" "}
          <a
            href="mailto:contact@mykitbuddy.com"
            style={{ textDecoration: "underline", color: "#111" }}
          >
            contact@mykitbuddy.com
          </a>{" "}
          ensuring that adequate information is provided helps us to identify
          your user account.
          <br /> If you are a resident of California please see our California
          Privacy section below for more details.{" "}
        </p>
      </>
    ),
  },
  {
    id: "childrens-information",
    title: "Children’s Personal Information",
    content: (
      <>
        <p>
          The Services are not for children under the age of 18 and we do not
          knowingly collect any Personal Information from children under the age
          of 18 without parental consent. If we come to know that a child under
          the age of 18 has provided us with Personal Information, or that such
          Personal Information has otherwise been inadvertently collected, we
          will delete it in accordance with applicable law.{" "}
        </p>
      </>
    ),
  },
  {
    id: "california-privacy",
    title: "California Privacy under CCPA",
    content: (
      <>
        <p>
          California residents have additional rights under California Consumer
          Privacy Act of 2018 (“CCPA”) regarding the privacy and disclosure of
          Personal Information, including, but not limited to a right to request
          that Seva Healthcare IT LLC not sell their Personal Information. Seva
          Healthcare IT LLC does not sell your Personal Information, and we use
          and disclose Personal Information solely in accordance with this
          Policy. The CCPA defines a "sale" as the disclosure of Personal Data
          for monetary or other valuable consideration.
          <br />
          California residents are also specifically entitled to exercise the
          following rights with respect to Personal Information:
          <br />
          Request to Know. You have the right to request what Personal
          Information we collect, use, disclose, and/or sell, as applicable.‍
          <br />
          Request to Delete. Delete Personal Data we collected from you. (For
          avoidance of doubt, we can delete the data that we store – not data
          stored by third parties. You’ll need to reach out to those third
          parties (listed above) for assistance removing your records from their
          services).
          <br />
          Request to Correct. Request to correct inaccurate personal information
          that we maintain about you
          <br />
          Request to Opt-out of the Sale of Personal Information. You have the
          right to request to be opted-out from the sale of your Personal
          Information; however, we do not sell Personal Information.‍
          <br />
          In addition, you have the right to be free from discrimination by a
          business for exercising your CCPA privacy rights, including the right
          as an employee, applicant, or independent contractor not to be
          retaliated against for exercising your CCPA privacy rights.
          <br />
          You may also authorize someone to exercise the above rights on your
          behalf. If you have provided us information on your minor child, you
          may exercise the above rights on behalf of your minor child.
          <br />
          The above rights are subject to our being able to reasonably verify
          your identity (or the identity of someone exercising these rights on
          your behalf) and authority to make these requests by providing
          verifiable information such as the following:
          <br />
          Please describe your request with sufficient detail that allows us to
          sufficiently evaluate and respond to it. We cannot respond to your
          request if we cannot verify your identity or authority to make the
          request and confirm the Personal Information requested relates to you.
          <br />
          To exercise your rights, submit your request to us via email at{" "}
          <a
            style={{ textDecoration: "underline", color: "#111" }}
            href="mailto:contact@mykitbuddy.com"
          >
            contact@mykitbuddy.com
          </a>
          .
          <br />
          We will respond to authorized and verified requests as soon as
          practicable and as within the time line required by law. Subject to
          legally allowed exclusions and exceptions we will advise you of any
          reason for denying or restricting a request.
        </p>
      </>
    ),
  },
  {
    id: "other-states-privacy",
    title: "Other States’ Privacy Laws Applicability",
    content: (
      <p>
        To the best of our knowledge and information other state privacy laws do
        not apply to us. But, if you reside in a state which in your views such
        state privacy law is applicable to Seva Healthcare IT LLC and would like
        to invoke any right you have under such law, please submit your request
        to us via email at{" "}
        <a
          style={{ textDecoration: "underline", color: "#111" }}
          href="mailto:contact@mykitbuddy.com"
        >
          contact@mykitbuddy.com
        </a>
        .{" "}
      </p>
    ),
  },
  {
    id: "consent-transfer",
    title: "Consent to Transfer",
    content: (
      <>
        <p>
          We operate in the United States and even if you are in a country other
          than United States any information we collect will be transferred to
          and processed in the United States.
          <br />
          By using our Services, or otherwise providing us with Personal
          Information, you understand and consent to this transfer, processing,
          and storage of your information in the United States, a jurisdiction
          in which the privacy laws may not be as comprehensive as, or conflict
          with, those in the country where you reside and/or are a citizen.
        </p>
      </>
    ),
  },
  {
    id: "questions-comments",
    title: "Questions or Comments",
    content: (
      <>
        <p>
          If you have any questions or comments about this Privacy Policy and
          our practices, or use of the Site or App, please feel free to contact
          us by email at{" "}
          <a
            style={{ textDecoration: "underline", color: "#111" }}
            href="mailto:contact@mykitbuddy.com"
          >
            contact@mykitbuddy.com
          </a>{" "}
          for your User Content and for the consequences of submitting or
          authorizing its use or disclosure through the Services. You hereby
          irrevocably waive all claims and have no recourse against us for any
          alleged or actual infringement or misappropriation of any proprietary
          rights in any communication, content, or material submitted to us.
          Please note that all the following licenses are subject to our Privacy
          Policy to the extent they relate to any User Content that contains any
          personally identifiable information.
        </p>
      </>
    ),
  },
];

const PrivacyPolicyPage = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <>
      <div className="flex flex-col items-center border-b bg-[#FFFFFF] pb-4 sticky top-0 z-10">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <img
            src="/../icons/kit-logo-icon.svg"
            alt="logo"
            className="w-18 h-12 mt-2"
          />
        </Link>
      </div>
      <main className="min-h-screen bg-[#FAFEFF] ">
        <ScrollToTop />

        <div className="privacy-policy-page font-mona">
          <div className="container">
            <h1 className="text-xl sm:text-2xl font-bold  text-center  leading-snug  wrap-break-word  px-4">
              SEVA Healthcare IT LLC (DBA KIT – Keeping It Together)
            </h1>

            <h2 className="text-lg sm:text-xl font-semibold text-center">
              PRIVACY POLICY
            </h2>
            <div className="row" style={{ padding: "0 1.5rem" }}>
              <div className="col-lg-12">
                <p>
                  Your privacy is IMPORTANT to us. To protect your privacy and
                  earn your trust, we strive hard to make our systems highly
                  secure. We provide this notice explaining our information
                  system, and the choices you can make about the way your
                  information is collected and used.
                </p>

                <div className="mx-auto max-w-3xl">
                  <h2 className="mb-4 text-lg font-semibold text-black">
                    WHAT THESE TERMS CONTAIN
                  </h2>
                  <div className="mt-4 overflow-hidden rounded-lg border border-[#E5E7EB] bg-white ">
                    <table className="w-full border-collapse text-sm">
                      <thead className="bg-[#00BCD4] text-white">
                        <tr>
                          <th className="w-[60px] px-2 py-2 text-left font-medium">
                            Sl No
                          </th>
                          <th className=" px-3 py-2 text-left font-medium">
                            Heading
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {sections.map((section, index) => (
                          <tr
                            key={section.id}
                            className="border-b last:border-b-0 hover:bg-[#F7FAFF]"
                          >
                            <td className="px-3 py-2 text-gray-700">
                              {index + 1}
                            </td>

                            <td className="px-3 py-2">
                              <button
                                onClick={() => scrollToSection(section.id)}
                                className="text-left text-[#1F2937] underline underline-offset-2 "
                              >
                                {section.title}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* Sections for each term */}
                <div>
                  {sections.map((section, idx) => (
                    <section
                      id={section.id}
                      key={section.id}
                      className="mt-12 scroll-mt-[90px]"
                    >
                      <h4 style={{ fontWeight: "700" }}>
                        {idx + 1}. <span>{section?.title}</span>
                      </h4>
                      <p>{section?.content}</p>
                    </section>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full py-6 text-center bg-[#FFFFFF] border-t font-mona font-normal text-sm text-[#000000]">
        © 2025 KIT — Keeping It Together™
      </footer>
    </>
  );
};

export default PrivacyPolicyPage;
