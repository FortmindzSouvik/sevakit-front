import {
  formatDate,
  formatDurationSince,
  formatPhoneNumber,
  isImage,
  isPdf,
} from "@/lib/utils";
import { ROUTES } from "@/utils/routeConstants";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const PublicHealthProfile = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  // console.log("data", data);
  const getSecureSessionData = () => {
    const raw = sessionStorage.getItem("publicProfile");
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);

      if (!parsed.expiresAt || Date.now() > parsed.expiresAt) {
        sessionStorage.removeItem("publicProfile");
        return null;
      }

      return parsed.data;
    } catch {
      sessionStorage.removeItem("publicProfile");
      return null;
    }
  };

  useEffect(() => {
    // Immediate check on load
    const sessionData = getSecureSessionData();
    if (!sessionData) {
      navigate(`/${ROUTES.role.patient}/${ROUTES.patient.dashboard}`, {
        replace: true,
      });
      return;
    }

    setData(sessionData);

    // Re-check expiry every 2 minutes
    const interval = setInterval(() => {
      const sessionData = getSecureSessionData();
      if (!sessionData) {
        navigate(`/${ROUTES.role.patient}/${ROUTES.patient.dashboard}`, {
          replace: true,
        });
      }
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  if (!data) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Severe":
        return "text-[#FF0000]";
      case "Moderate":
        return "text-[#E5B122]";
      case "Mild":
        return "text-[#00A86B]";
      default:
        return "text-[#212121]";
    }
  };
  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasAdvancedCarePlan =
    !!data?.advancedCarePlan &&
    !!data?.advancedCarePlan?.resuscitationPreference;

  const hasAdvancedCarePlanDocument =
    !!data?.advancedCarePlan?.codeStatusDocument?.fileUrl;

  const hasLivingWill = !!data?.livingWill && !!data?.livingWill?.summary;
  const hasLivinWillDocuments = data?.livingWill?.documents?.length;
  const poa = data?.powerOfAttorney;
  const hasPOA = !!poa && poa?.hasPowerOfAttorney === "Yes";
  const caregiver = data?.caregiver;
  const hasCaregiver = !!caregiver && caregiver?.manageOwnHealth === "Yes";

  const DocumentPreview = ({ url, label }: { url?: string; label: string }) => {
    if (!url) return null;

    const image = isImage(url);
    const pdf = isPdf(url);

    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="w-28 h-20 border rounded-lg flex items-center justify-center bg-[#F9FAFB] overflow-hidden"
      >
        {image ? (
          <img src={url} alt={label} className="w-full h-full object-cover" />
        ) : pdf ? (
          <iframe
            src={`${url}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full"
            title={label}
          />
        ) : (
          <span className="text-xs text-gray-500">Unsupported</span>
        )}
      </a>
    );
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-5 font-mona">
      <div className="flex items-center justify-center relative mb-8">
        <button className="absolute left-0">
          <img
            src="/../icons/back-arrow-icon.svg"
            alt="back arrow"
            className="w-fit h-fit cursor-pointer"
            onClick={() => {
              navigate(`/${ROUTES.role.patient}/${ROUTES.patient.dashboard}`);
              sessionStorage.removeItem("publicProfile");
            }}
          />
        </button>
        <h1 className="text-base font-medium font-mona text-[#000000] ">
          Public Health Profile
        </h1>
      </div>

      <div className="w-full max-w-3xl mx-auto">
        {/* profile photo */}
        {!!data?.profilePicture?.fileUrl &&
          data?.profilePicture?.fileUrl !== null && (
            <div className="bg-[#F7FDFF] rounded-3xl  border-2 border-[#E6F3FA] p-6">
              <div className="flex items-center gap-3 mb-3 border-b border-[#E8F9FF]">
                <img
                  src="/../icons/profile-photo-icon.png"
                  alt="profile"
                  className="w-fit h-fit"
                />
                <h2 className="text-base font-medium text-[#000000]">
                  Profile Photo{" "}
                </h2>
              </div>

              <div className="bg-[#FFFFFF] p-6 w-fit h-fit ">
                <img
                  src={
                    data?.profilePicture?.fileUrl || "/../icons/men-icon.png"
                  }
                  alt="men icon"
                  className="w-25 h-25"
                />
              </div>
            </div>
          )}

        {/* personal identity */}
        <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E8F9FF]">
            <img
              src="/../icons/personal-identity-icon.svg"
              alt="identity"
              className="w-fit h-fit"
            />
            <h2 className="text-base font-medium text-[#000000]">
              Personal Identity
            </h2>
          </div>

          <div className="bg-[#FFFFFF] p-6 font-mona">
            <p className="text-base text-[#000000] mb-4 font-medium capitalize ">
              <span className="font-medium">Full Name: </span>
              {data?.firstName ?? ""} {data?.lastName ?? ""}
            </p>

            <p className="text-base text-[#000000] mb-4 font-medium capitalize">
              <span className="font-medium ">Gender: </span>
              {data?.gender || "NA"}
            </p>

            <p className="text-base text-[#000000] font-medium">
              <span className="font-medium">DOB: </span>
              {formatDate(data?.dateOfBirth) || "NA"}
            </p>
          </div>
        </div>

        {/* personal contact */}
        <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E8F9FF]">
            <img
              src="/../icons/personal-contact-icon.svg"
              alt="contact"
              className="w-fit h-fit"
            />
            <h2 className="text-base font-medium text-[#000000]">
              Personal Contact
            </h2>
          </div>

          <div className="bg-[#FFFFFF] p-6 font-mona">
            <p className="text-base text-[#000000] mb-4 font-medium ">
              <span className="font-medium">Phone Number: </span>
              {formatPhoneNumber(data?.phoneNumber) || "NA"}
            </p>

            <p className="text-base text-[#000000] mb-4 font-medium">
              <span className="font-medium">Email: </span>
              {data?.email || "NA"}
            </p>
          </div>
        </div>

        {/* personal address */}
        {!!data?.address?.street && data?.address?.street !== null && (
          <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
            <div className="flex items-center gap-3  pb-4 border-b border-[#E8F9FF]">
              <img
                src="/../icons/personal-address-icon.svg"
                alt="address"
                className="w-fit h-fit"
              />
              <h2 className="text-base font-medium text-[#000000]">
                Personal Address
              </h2>
            </div>

            <div className="bg-[#FFFFFF] p-6 font-mona">
              <p className="text-base text-[#000000] mb-4 font-medium ">
                <span className="font-medium">Address: </span>
                {data?.address?.street || "NA"}
              </p>
            </div>
          </div>
        )}

        {/* allergies */}
        {data?.allergies?.length > 0 && (
          <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
            <div className="flex items-center gap-3  pb-4 border-b border-[#E8F9FF]">
              <img
                src="/../icons/allergie-icon.svg"
                alt="allergies"
                className="w-fit h-fit"
              />
              <h2 className="text-base font-medium text-[#000000]">
                Allergies{" "}
              </h2>
            </div>
            {/* Allergy Card 1 */}
            <div className="max-h-[400px] overflow-y-auto space-y-4 scrollbar-hide">
              {data?.allergies?.map((item: any) => {
                return (
                  <div
                    key={item?.id}
                    className="bg-[#FFFFFF] p-6 rounded-3xl mb-6"
                  >
                    <h3 className="text-lg font-semibold text-[#009FB6]">
                      {item?.allergenName || "NA"}
                    </h3>

                    <p className="text-[#212121] mt-2">
                      <span className="font-semibold">Reaction:</span>{" "}
                      {item?.reactionType || "NA"}
                    </p>

                    <p className="text-[#212121] mt-1">
                      <span className="font-semibold">Severity:</span>{" "}
                      <span
                        className={`font-semibold ${getSeverityColor(
                          item.severity
                        )}`}
                      >
                        {item.severity}
                      </span>
                    </p>
                    {item.notes && (
                      <div className="mt-4 bg-[#B9F2F8] text-[#000000] px-4 py-2 rounded-xl w-fit">
                        <p className="text-sm">Notes: {item?.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* pharmacy */}
        {data?.pharmacy?.length > 0 && (
          <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E8F9FF]">
              <img
                src="/../icons/pharmacys-icon.svg"
                alt="pharmacy"
                className="w-fit h-fit"
              />
              <h2 className="text-base font-medium text-[#000000]">
                Pharmacy{" "}
              </h2>
            </div>
            {/* pharmacy Card 1 */}
            <div className="max-h-[400px] overflow-y-auto space-y-4 scrollbar-hide">
              {data?.pharmacy?.map((item: any) => {
                return (
                  <div
                    key={item?.id}
                    className="bg-[#FFFFFF] p-6 rounded-3xl mb-6"
                  >
                    <h3 className="text-lg font-semibold text-[#009FB6]">
                      {item?.pharmacyName || "NA"}
                    </h3>
                    <p className="text-[#212121] mt-2">
                      <span className="font-semibold">Address:</span>{" "}
                      {item?.pharmacyAddress || "NA"}
                    </p>
                    <p className="text-[#212121]">
                      <span className="font-semibold">Phone:</span>{" "}
                      {formatPhoneNumber(item?.pharmacyPhone) || "NA"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* medication */}
        {data?.medications?.length > 0 && (
          <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E8F9FF]">
              <img
                src="/../icons/medication-icon.svg"
                alt="medication"
                className="w-fit h-fit"
              />
              <h2 className="text-base font-medium text-[#000000]">
                Medications
              </h2>
            </div>
            {/* medication Card 1 */}
            <div className="max-h-[400px] overflow-y-auto space-y-4 scrollbar-hide">
              {data?.medications?.map((item: any) => {
                return (
                  <div
                    key={item?.id}
                    className="bg-[#FFFFFF] p-6 rounded-3xl mb-6"
                  >
                    <h3 className="text-lg font-semibold text-[#009FB6]">
                      {item?.medicationName} {item?.dosageNotes}
                    </h3>
                    <p className="text-[#212121] mt-2">
                      <span className="font-semibold">Form:</span>{" "}
                      {item?.form || "NA"}
                    </p>
                    <p className="text-[#212121]">
                      <span className="font-semibold">Frequency:</span>{" "}
                      {item?.dosageFrequency || "NA"}
                    </p>
                    <p className="text-[#212121]">
                      <span className="font-semibold">Active:</span>{" "}
                      {item?.isActive ? "Yes" : "No"}
                    </p>
                    <p className="text-[#212121]">
                      <span className="font-semibold">Refill Reminder:</span>{" "}
                      {item?.isRecurring ? "Yes" : "None"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* symptoms */}
        {data?.symptoms?.length > 0 && (
          <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E8F9FF]">
              <img
                src="/../icons/head-side-cough-icon.svg"
                alt="symptom"
                className="w-fit h-fit"
              />
              <h2 className="text-base font-medium text-[#000000]">
                Symptoms{" "}
              </h2>
            </div>
            {/* Symptoms Card 1 */}
            <div className="max-h-[400px] overflow-y-auto space-y-4 scrollbar-hide">
              {" "}
              {data?.symptoms?.map((item: any) => {
                return (
                  <div
                    key={item?.id}
                    className="bg-[#FFFFFF] p-6 rounded-3xl mb-3"
                  >
                    <h3 className="text-lg font-semibold text-[#009FB6]">
                      {item?.symptomName || "NA"}
                    </h3>

                    <p className="text-[#212121] mt-2">
                      <span className="font-semibold">Severity:</span>{" "}
                      {item?.severity || "NA"}
                    </p>
                    <p className="text-[#212121]">
                      <span className="font-semibold">Duration:</span>
                      {formatDurationSince(item?.duration)}
                    </p>
                    {item?.additionalNotes && (
                      <div className="mt-4 bg-[#B9F2F8] text-[#000000] px-4 py-2 rounded-xl w-fit">
                        <p className="text-sm">
                          Notes: {item?.additionalNotes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Insurance */}
        {data?.insurance?.length > 0 && (
          <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E8F9FF]">
              <img
                src="/../icons/compliance-document-icon.svg"
                alt="insurance"
                className="w-fit h-fit"
              />
              <h2 className="text-base font-medium text-[#000000]">
                Insurance
              </h2>
            </div>

            <div className="space-y-4 mt-4">
              {data.insurance.map((item: any) => {
                const hasDocuments =
                  item?.frontImage?.fileUrl || item?.backImage?.fileUrl;

                return (
                  <div key={item.id} className="bg-[#FFFFFF] p-6 rounded-3xl">
                    {/* CASE 1: IMAGE / PDF AVAILABLE */}
                    {hasDocuments ? (
                      <>
                        <h3 className="text-sm font-semibold text-[#009FB6] mb-3">
                          {item.providerName || "Insurance Document"}
                        </h3>

                        <div className="flex gap-3">
                          <DocumentPreview
                            url={item?.frontImage?.fileUrl}
                            label="Front"
                          />
                          <DocumentPreview
                            url={item?.backImage?.fileUrl}
                            label="Back"
                          />
                        </div>
                      </>
                    ) : (
                      /* CASE 2: MANUAL ENTRY */
                      <>
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-[#009FB6]">
                            {item.providerName || "Insurance"}
                          </h3>

                          <div className="bg-[#B9F2F8] text-[#000000] px-3 py-1 rounded-xl">
                            <p className="text-sm">
                              {item.isSecondary ? "Secondary" : "Primary"}{" "}
                              Insurance
                            </p>
                          </div>
                        </div>

                        <p className="text-[#212121] mt-2">
                          <span className="font-semibold">Member ID:</span>{" "}
                          {item.memberId || "NA"}
                        </p>

                        <p className="text-[#212121]">
                          <span className="font-semibold">Group ID:</span>{" "}
                          {item.groupId || "NA"}
                        </p>

                        <p className="text-[#212121]">
                          <span className="font-semibold">Policy Type:</span>{" "}
                          {item.policyType || "NA"}
                        </p>

                        <p className="text-[#212121]">
                          <span className="font-semibold">Expires:</span>{" "}
                          {formatDate(item.expirationDate) || "NA"}
                        </p>

                        {item.customerServiceContact && (
                          <p className="text-[#212121]">
                            <span className="font-semibold">
                              Customer Service:
                            </span>{" "}
                            {formatPhoneNumber(item.customerServiceContact)}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* emergency contact */}
        {data?.emergencyContacts?.length > 0 && (
          <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E8F9FF]">
              <img
                src="/../icons/light-emergency-on-icon.svg"
                alt="emergency"
                className="w-fit h-fit"
              />
              <h2 className="text-base font-medium text-[#000000]">
                Emergency Contact{" "}
              </h2>
            </div>
            {/* Insurance Card 1 */}
            <div className="max-h-[400px] overflow-y-auto space-y-4 scrollbar-hide">
              {data?.emergencyContacts?.map((item: any) => {
                return (
                  <div
                    key={item?.id}
                    className="bg-[#FFFFFF] p-6 rounded-3xl mb-6"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-[#009FB6]">
                        {item?.contactName || "NA"}
                      </h3>
                    </div>

                    <p className="text-[#212121] mt-2">
                      <span className="font-semibold">Relationship:</span>{" "}
                      {item?.relationship || "NA"}
                    </p>
                    <p className="text-[#212121]">
                      <span className="font-semibold">Phone:</span>{" "}
                      {formatPhoneNumber(item?.phoneNumber) || "NA"}
                    </p>
                    <p className="text-[#212121]">
                      <span className="font-semibold">Email:</span>{" "}
                      {item?.email || "NA"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* advance care contact */}
        {hasAdvancedCarePlan && (
          <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E8F9FF]">
              <img
                src="/../icons/hand-holding-heart-icon.svg"
                alt="care"
                className="w-fit h-fit"
              />
              <h2 className="text-base font-medium text-[#000000]">
                Advanced Care Plan
              </h2>
            </div>
            {/* advance care Card 1 */}
            <div className="bg-[#FFFFFF] p-6 rounded-3xl mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-[#009FB6]">
                  Code Status:{" "}
                  {data?.advancedCarePlan?.resuscitationPreference || "NA"}
                </h3>
              </div>

              <p className="text-[#212121] mt-2">
                <span className="font-semibold">Last Updated:</span>{" "}
                {formatDate(data?.advancedCarePlan?.updatedAt) || "NA"}
              </p>
              <div className="flex justify-between items-center">
                <p className="text-[#212121]">
                  <span className="font-semibold">Document:</span>{" "}
                  <span className="font-semibold">
                    {hasAdvancedCarePlanDocument ? "On file" : "Not available"}
                  </span>
                </p>
                {hasAdvancedCarePlanDocument && (
                  <button
                    className="flex items-center gap-2 text-sm text-[#009FB6] font-semibold"
                    onClick={() =>
                      handleDownload(
                        data?.advancedCarePlan?.codeStatusDocument?.fileUrl,
                        data?.advancedCarePlan?.codeStatusDocument?.fileName
                      )
                    }
                  >
                    Download
                    <img
                      src="/../icons/dwnld-icon.svg"
                      alt="download"
                      className="w-fit h-fit"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* living will  */}
        {hasLivingWill && (
          <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E8F9FF]">
              <img
                src="/../icons/living-wills-icon.svg"
                alt="livingWill"
                className="w-fit h-fit"
              />
              <h2 className="text-base font-medium text-[#000000]">
                Living Will
              </h2>
            </div>
            {/* living will Card 1 */}
            <div className="bg-[#FFFFFF] p-6 rounded-3xl mb-6">
              <h3 className="text-base font-semibold text-[#009FB6] mb-2">
                Living Will Summary
              </h3>

              {/* Description */}
              <p className="text-base  text-[#000000] mb-6">
                {data?.livingWill?.summary || "NA"}
              </p>

              {hasLivinWillDocuments > 0 && (
                <>
                  {/* Divider */}
                  <div className="h-px bg-gray-200 my-4"></div>
                  {/* Documents Heading */}
                  <p className="text-[18px] font-semibold text-[#0A0A0A] mb-3">
                    Documents
                  </p>
                  {data?.livingWill?.documents.map((doc: any) => {
                    return (
                      <div
                        key={doc?._id}
                        className="flex justify-between items-center py-2"
                      >
                        <p className="text-sm font-semibold text-[#0A0A0A]">
                          {doc?.fileName}
                        </p>
                        <button
                          className="text-sm text-[#009FB6] font-medium hover:underline flex items-center gap-1"
                          onClick={() =>
                            handleDownload(doc?.fileUrl, doc.fileName)
                          }
                        >
                          Download
                        </button>
                      </div>
                    );
                  })}
                  {/* Bottom Spacing */}
                  <div className="mt-4 h-px bg-gray-200"></div>
                </>
              )}
            </div>
          </div>
        )}

        {/* power of attorney  */}
        {hasPOA && (
          <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E8F9FF]">
              <img
                src="/../icons/lawyer-man-icon.svg"
                alt="lawyer"
                className="w-fit h-fit"
              />
              <h2 className="text-base font-medium text-[#000000]">
                Power of Attorney
              </h2>
            </div>
            {/* power of attorny */}
            <div className="bg-[#FFFFFF] p-6 rounded-3xl mb-6">
              <p className="text-base  text-[#009FB6] ">
                Name: {data?.powerOfAttorney?.representativeName || "NA"}
              </p>
              <p className="text-base  text-[#000000] capitalize ">
                Relationship: {data?.powerOfAttorney?.relationship || "NA"}
              </p>
              <p className="text-base  text-[#000000] ">
                Phone:
                {formatPhoneNumber(data?.powerOfAttorney?.phoneNumber) || "NA"}
              </p>
              <p className="text-base  text-[#000000] ">
                Email: {data?.powerOfAttorney?.email || "NA"}
              </p>
              {data?.powerOfAttorney?.documents?.length > 0 && (
                <>
                  {/* Divider */}
                  <div className="h-px bg-gray-200 my-4"></div>
                  {/* Documents Heading */}
                  <p className="text-sm font-semibold text-[#0A0A0A] mb-3">
                    Documents
                  </p>
                  <div className="flex justify-between items-center py-2">
                    <p className="text-sm font-semibold text-[#0A0A0A]">
                      POA_Form_2025.pdf
                    </p>
                    <button className="text-sm text-[#009FB6] font-medium hover:underline flex items-center gap-1">
                      Download
                    </button>
                  </div>
                  {/* Document Row 2 */}
                  <div className="flex justify-between items-center py-2">
                    <p className="text-sm font-semibold text-[#0A0A0A]">
                      POA_Form_2023.pdf
                    </p>
                    <button className="text-sm text-[#009FB6] font-medium hover:underline flex items-center gap-1">
                      Download
                    </button>
                  </div>
                  {/* Bottom Spacing */}
                  <div className="mt-4 h-px bg-gray-200"></div>
                </>
              )}
            </div>
          </div>
        )}

        {/* primary care */}
        {data?.primaryCare?.length > 0 && (
          <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
            <div className="flex items-center gap-3  pb-4 border-b border-[#E8F9FF]">
              <img
                src="/../icons/primary-care-icon.svg"
                alt="primary"
                className="w-fit h-fit"
              />
              <h2 className="text-base font-medium text-[#000000]">
                Care Providers{" "}
              </h2>
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-4 scrollbar-hide">
              {data?.primaryCare?.map((item: any) => {
                return (
                  <div
                    key={item?.id}
                    className="bg-[#FFFFFF] p-6 rounded-3xl mb-6"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-[#009FB6]">
                        {item?.doctorName || "NA"}
                      </h3>
                      <div className="bg-[#B9F2F8] text-[#000000] px-3 py-1 rounded-xl w-fit">
                        <p className="text-sm">Care Providers</p>
                      </div>
                    </div>

                    <p className="text-[#212121] mt-2">
                      <span className="font-semibold">Clinic:</span>{" "}
                      {item?.medicalFacility || "NA"}
                    </p>
                    <p className="text-[#212121]">
                      <span className="font-semibold">Phone:</span>{" "}
                      {formatPhoneNumber(item?.doctorPhone) || "NA"}
                    </p>
                    <p className="text-[#212121]">
                      <span className="font-semibold">Email:</span>{" "}
                      {item?.doctorEmail || "NA"}
                    </p>
                    <p className="text-[#212121]">
                      <span className="font-semibold">Address:</span>{" "}
                      {item?.doctorAddress || "NA"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* caregiver */}
        {hasCaregiver && (
          <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
            <div className="flex items-center gap-3  pb-4 border-b border-[#E8F9FF]">
              <img
                src="/../icons/user-nurse-icon.svg"
                alt="user-nurse"
                className="w-fit h-fit"
              />
              <h2 className="text-base font-medium text-[#000000]">
                Caregivers
              </h2>
            </div>
            {/* caregiver Card 1 */}
            <div className="bg-[#FFFFFF] p-6 rounded-3xl mb-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-[#009FB6]">
                  {data?.caregiver?.caregiverName || "NA"}
                </h3>
              </div>

              <p className="text-[#212121] mt-2 capitalize">
                <span className="font-semibold">Relationship:</span>
                {data?.caregiver?.relationship || "NA"}
              </p>
              <p className="text-[#212121]">
                <span className="font-semibold">Phone:</span>{" "}
                {formatPhoneNumber(data?.caregiver?.caregiverPhone) || "NA"}
              </p>
            </div>
          </div>
        )}

        {/* driver */}
        {data?.driversLicense?.length > 0 && (
          <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
            <div className="flex items-center gap-3 pb-4 border-b border-[#E8F9FF]">
              <img
                src="/../icons/driver-icon.svg"
                alt="driver"
                className="w-fit h-fit"
              />
              <h2 className="text-base font-medium text-[#000000]">
                Driver’s License
              </h2>
            </div>

            <div className="space-y-4 mt-4">
              {data.driversLicense.map((item: any) => {
                const hasDocuments =
                  item?.frontImage?.fileUrl || item?.backImage?.fileUrl;

                return (
                  <div key={item.id} className="bg-[#FFFFFF] p-6 rounded-3xl">
                    {/* CASE 1: IMAGE / PDF AVAILABLE */}
                    {hasDocuments ? (
                      <>
                        <h3 className="text-sm font-semibold text-[#009FB6] mb-3">
                          {item.fullName || "Driver's License Document"}
                        </h3>

                        <div className="flex gap-3">
                          <DocumentPreview
                            url={item?.frontImage?.fileUrl}
                            label="Front"
                          />
                          <DocumentPreview
                            url={item?.backImage?.fileUrl}
                            label="Back"
                          />
                        </div>
                      </>
                    ) : (
                      /* CASE 2: MANUAL ENTRY */
                      <>
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-semibold text-[#009FB6]">
                            {item.fullName || "Driver's License"}
                          </h3>
                        </div>

                        <p className="text-[#212121] mt-2">
                          <span className="font-semibold">License Number:</span>{" "}
                          {item.licenseNumber || "NA"}
                        </p>

                        <p className="text-[#212121]">
                          <span className="font-semibold">State:</span>{" "}
                          {item?.issuingState || "NA"}
                        </p>

                        <p className="text-[#212121]">
                          <span className="font-semibold">Expires:</span>{" "}
                          {formatDate(item.expirationDate) || "NA"}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
          <div className="flex items-center gap-3  pb-4 border-b border-[#E8F9FF]">
            <img
              src="/../icons/driver-icon.svg"
              alt="driver"
              className="w-fit h-fit"
            />
            <h2 className="text-base font-medium text-[#000000]">
              Driver’s License
            </h2>
          </div>
          
          <div className="bg-[#FFFFFF] p-6 rounded-3xl mb-6">
            <p className="text-base  text-[#009FB6] "> Johnathan Doe</p>
            <p className="text-base  text-[#000000] ">
              License Number: TX-9218832
            </p>
            <p className="text-base  text-[#000000] ">State: Texas</p>
            <p className="text-base  text-[#000000] ">
              Expiration Date: 12/14/2029
            </p>

            
            <div className="h-px bg-gray-200 my-4"></div>

          
            <p className="text-sm font-semibold text-[#0A0A0A] mb-3">
              Documents
            </p>

            <div className="flex justify-between items-center py-2">
              <p className="text-sm font-semibold text-[#0A0A0A]">Front Side</p>
              <button className="text-sm text-[#009FB6] font-medium hover:underline flex items-center gap-1">
                Download
              </button>
            </div>

           
            <div className="flex justify-between items-center py-2">
              <p className="text-sm font-semibold text-[#0A0A0A]">Back Side</p>
              <button className="text-sm text-[#009FB6] font-medium hover:underline flex items-center gap-1">
                Download
              </button>
            </div>

         
            <div className="mt-4 h-px bg-gray-200"></div>
          </div>
        </div> */}

        {/* Medicle Report */}
        {/* <div className="bg-[#F7FDFF] rounded-3xl border border-[#E6F3FA] p-6 mt-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#E8F9FF]">
            <img
              src="/../icons/file-medical-alt-icon.svg"
              alt="medicle"
              className="w-fit h-fit"
            />
            <h2 className="text-base font-medium text-[#000000]">
              Medicle Reports
            </h2>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-3xl mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-[#009FB6]">
                Lab Report
              </h3>
            </div>

            <p className="text-[#212121] mt-2">
              <span className="font-semibold">Source:</span> Austin Labs
            </p>
            <p className="text-[#212121]">
              <span className="font-semibold">Date:</span> Oct 10, 2025
            </p>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PublicHealthProfile;
