import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRoutes } from "@/utils/apiRoute/apiRoutes";
import { useCallback, useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import axios from "axios";
import { toast } from "sonner";
import { useAppSelector } from "@/redux/store";
import html2canvas from "html2canvas-pro";
import { format } from "date-fns";
import {
  AllergyItem,
  Divider,
  DLItem,
  EmergencyContactsItem,
  InfoRow,
  InsuranceItem,
  MedicationItem,
  PharmacyItem,
  PrimaryCaresItem,
  SectionHeader,
  SymptomItem,
} from "./component/Section";
import { formatDate, formatPhoneNumber } from "@/lib/utils";

const ReportGenerateSection = ({
  isOpen,
  onClose,
  userPublicToken,
}: {
  isOpen: boolean;
  onClose: () => void;
  userPublicToken: string;
}) => {
  const { userData } = useAppSelector((state) => state.user);
  const token = userData?.accessToken || "";
  const [reportData, setReportData] = useState<any>(null);
  const pdfRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  console.log("reportData", reportData);
  const currentDate = new Date();

  const generatePdf = useCallback(async () => {
    try {
      if (!pdfRef.current) throw new Error("PDF reference not found");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = 595.28; // A4 width in points
      const pdfHeight = 841.89; // A4 height in points

      // Get header separately
      const headerElement = document.getElementById("pdf-header");
      const headerCanvas = headerElement
        ? await html2canvas(headerElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#E8F9FF",
            allowTaint: true,
          })
        : null;
      const headerImg = headerCanvas
        ? headerCanvas.toDataURL("image/jpeg", 0.9)
        : null;

      // Calculate header height
      const headerHeight = 120;

      // Capture the ENTIRE content as ONE image (not separate sections)
      const contentElement = pdfRef.current;

      // Wait for rendering
      await new Promise((r) => setTimeout(r, 500));

      const canvas = await html2canvas(contentElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: contentElement.scrollWidth,
        windowHeight: contentElement.scrollHeight,
        logging: false,
        allowTaint: true,
      });

      // const imgData = canvas.toDataURL("image/jpeg", 0.9);

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Calculate available height per page (excluding header and footer)
      const footerHeight = 30;
      const availableHeightPerPage =
        pdfHeight - headerHeight - footerHeight - 20;

      let currentY = headerHeight + 10; // Start position for content
      let currentPage = 1;
      let remainingHeight = imgHeight;
      let contentStartY = 0; // Where to start clipping from the full image

      while (remainingHeight > 0) {
        // Add new page if not the first
        if (currentPage > 1) {
          pdf.addPage();
          currentY = headerHeight + 10;
        }

        // Add header to each page
        if (headerImg) {
          pdf.addImage(headerImg, "JPEG", 0, 0, pdfWidth, headerHeight);
        }

        // Calculate how much of the content fits on this page
        const clipHeight = Math.min(availableHeightPerPage, remainingHeight);

        // Create a temporary canvas for clipping
        const tempCanvas = document.createElement("canvas");
        const scaleFactor = canvas.width / imgWidth;
        tempCanvas.width = canvas.width;
        tempCanvas.height = clipHeight * scaleFactor;
        const ctx = tempCanvas.getContext("2d");

        if (ctx) {
          // Draw only the portion we need for this page
          ctx.drawImage(
            canvas,
            0, // source x
            contentStartY * scaleFactor, // source y (where to start clipping)
            canvas.width, // source width
            clipHeight * scaleFactor, // source height (how much to clip)
            0, // destination x
            0, // destination y
            canvas.width, // destination width
            clipHeight * scaleFactor, // destination height
          );

          const clippedImg = tempCanvas.toDataURL("image/jpeg", 0.9);
          pdf.addImage(clippedImg, "JPEG", 0, currentY, imgWidth, clipHeight);
        }

        // Update positions for next iteration
        contentStartY += clipHeight;
        remainingHeight -= clipHeight;

        // Add footer to this page
        const footerY = pdfHeight - footerHeight;
        pdf.setFillColor("#E8F9FF");
        pdf.rect(0, footerY, pdfWidth, footerHeight, "F");
        pdf.setFontSize(10);
        pdf.setTextColor("#000000");
        pdf.text(`Page ${currentPage}`, pdfWidth - 45, pdfHeight - 12);

        currentPage++;
      }

      return pdf;
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    }
  }, []);

  const VITE_REPORT_ENDPOINT = import.meta.env.VITE_API_BASE_URL;

  const sendPdfToApi = useCallback(
    async (pdf: jsPDF) => {
      try {
        const pdfBlob = pdf.output("blob");
        const formData = new FormData();
        formData.append("file", pdfBlob, "document.pdf");

        const { data } = await axios.post(
          `${VITE_REPORT_ENDPOINT}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
            timeout: 30000, // 30 second timeout
          },
        );
        console.log("data image uploa", data);
        return data;
      } catch (error) {
        console.error("Error in uploading email:", error);
        throw error;
      }
    },
    [VITE_REPORT_ENDPOINT],
  );

  const downloadPdf = useCallback(
    (pdf: jsPDF) => {
      pdf.save("document.pdf");
      toast.success("Report Generated Successfully.");
      onClose();
    },
    [onClose],
  );

  const getReportData = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${VITE_REPORT_ENDPOINT}${apiRoutes.getPublicProfile}/${userPublicToken}`,
        { timeout: 30000 },
      );
      console.log("getreport data===>", data);
      if (data?.data) {
        setReportData(data.data);

        return data.data;
      } else {
        throw new Error("No data received from server");
      }
    } catch (error) {
      console.error("Failed to get data", error);
      throw error;
    }
  }, [userPublicToken]);

  const handleGenerateAndSend = async () => {
    const pdf = await generatePdf();
    if (!pdf) {
      throw new Error("PDF generation failed");
    }
    if (pdf) {
      await sendPdfToApi(pdf);
      downloadPdf(pdf);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (userPublicToken && !reportData) {
        await getReportData();
      }
    };

    fetchData();
  }, [userPublicToken]);

  useEffect(() => {
    if (!reportData) return;

    const timer = setTimeout(() => {
      buttonRef.current?.click();
    }, 1000);

    return () => clearTimeout(timer);
  }, [reportData]);

  const fullName =
    reportData?.firstName || reportData?.lastName
      ? `${reportData?.firstName ?? ""} ${reportData?.lastName ?? ""}`.trim()
      : "NA";

  const manualInsuranceList =
    reportData?.insurance?.filter((insurance: any) => {
      return !insurance?.frontImage?.fileUrl && !insurance?.backImage?.fileUrl;
    }) || [];

  const manualDLList =
    reportData?.driversLicense?.filter((driversLicense: any) => {
      return (
        !driversLicense?.frontImage?.fileUrl &&
        !driversLicense?.backImage?.fileUrl
      );
    }) || [];

  return (
    <>
      {/* Loader Dialog */}
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent
          className="max-w-md p-9 rounded-2xl"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {/* Close Button */}
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
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-black font-mona"></DialogTitle>
            </DialogHeader>

            <div style={{ textAlign: "center", padding: "100px 0" }}>
              <div className="flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00BCD4] border-t-transparent" />
              </div>
              <p className="mt-3">Generating Report... Please Wait...</p>
            </div>
            <DialogFooter className="w-fit flex items-center justify-center gap-6 pt-2 "></DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden report content for PDF generation */}
      <button
        ref={buttonRef}
        onClick={handleGenerateAndSend}
        style={{ display: "none" }}
      >
        Download
      </button>

      <div
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "64rem",
        }}
      >
        {reportData && (
          <>
            {/* Header */}
            <div
              id="pdf-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                backgroundColor: "#E8F9FF",
                padding: "28px 32px",
                fontFamily: `"Mona Sans", sans-serif`,
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              {/* LEFT SIDE */}
              <div>
                <h1
                  style={{
                    fontFamily: `"Mona Sans", sans-serif`,
                    marginTop: "16px",
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#000000",
                    lineHeight: "1.5",
                  }}
                >
                  PATIENT INTAKE FORM
                </h1>
                <p style={{ fontSize: "18px", color: "#000000" }}>
                  Medical Information Summary
                </p>
              </div>

              {/* RIGHT SIDE */}
              <div
                style={{
                  fontFamily: `"Mona Sans", sans-serif`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "8px",
                }}
              >
                <img
                  src="/../icons/kit-logo-icon.svg"
                  alt="KIT Logo"
                  style={{ width: "90px", height: "auto" }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div
                  style={{
                    fontSize: "12px",
                    color: "#000000",
                    textAlign: "right",
                    lineHeight: "1.4",
                  }}
                >
                  <div>
                    Generated via SevaKit on{" "}
                    {format(currentDate, "MMMM do, yyyy")}
                  </div>
                  <div>Last updated: December 3, 2025</div>
                </div>
              </div>
            </div>

            {/* Main Content Container - Only one ref needed */}
            <div
              ref={pdfRef}
              style={{
                width: "100%",
                backgroundColor: "white",
                fontFamily: `"Mona Sans", Arial, sans-serif`,
              }}
            >
              {/* Personal Information Section */}
              <div
                className="pdf-capture"
                style={{
                  padding: "32px",
                  backgroundColor: "white",
                }}
              >
                {/* PROFILE IMAGE */}
                <div style={{ marginBottom: "24px" }}>
                  <img
                    src={
                      reportData?.profilePicture?.fileUrl
                        ? `${reportData?.profilePicture?.fileUrl}?not-from-cache-please}`
                        : "https://via.placeholder.com/96?not-from-cache-please"
                    }
                    alt="profile"
                    crossOrigin="anonymous"
                    style={{
                      width: "120px",
                      height: "120px",
                      // borderRadius: "50%",
                      // objectFit: "cover",
                    }}
                  />
                </div>

                {/* PERSONAL IDENTITY */}
                <SectionHeader title="Personal Identity" />
                <InfoRow label="Full Name" value={fullName} />
                <InfoRow label="Gender" value={reportData?.gender} />
                <InfoRow
                  label="DOB"
                  value={formatDate(reportData?.dateOfBirth)}
                />

                {/* PERSONAL CONTACT */}
                <SectionHeader title="Personal Contact" />
                <InfoRow
                  label="Phone Number"
                  value={formatPhoneNumber(reportData?.phoneNumber)}
                />

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    fontSize: "14px",
                    marginBottom: "6px",
                    fontFamily: `"Mona Sans", sans-serif`,
                    fontWeight: 400,
                  }}
                >
                  <span>Email: </span>
                  <span>{reportData?.email}</span>
                </div>

                {/* ALLERGIES */}
                {reportData?.allergies?.length > 0 && (
                  <>
                    <SectionHeader title="Allergies" />
                    {reportData?.allergies.map(
                      (allergy: any, index: number) => (
                        <div key={index}>
                          <AllergyItem
                            name={allergy?.allergenName}
                            reaction={allergy?.reactionType}
                            severity={allergy?.severity}
                            notes={allergy?.notes}
                          />
                          {index !== reportData?.allergies.length - 1 && (
                            <Divider />
                          )}
                        </div>
                      ),
                    )}
                  </>
                )}
              </div>

              {/* Pharmacy Section */}
              {reportData?.pharmacy?.length > 0 && (
                <div
                  style={{
                    padding: "32px",
                    paddingTop: "10px",
                    backgroundColor: "white",
                  }}
                >
                  <SectionHeader title="Pharmacy" />
                  {reportData?.pharmacy.map((pharmacy: any, index: number) => (
                    <div key={index}>
                      <PharmacyItem
                        pharmacyName={pharmacy?.pharmacyName}
                        pharmacyAddress={pharmacy?.pharmacyAddress}
                        pharmacyPhone={pharmacy?.pharmacyPhone}
                      />
                      {index !== reportData?.pharmacy.length - 1 && <Divider />}
                    </div>
                  ))}
                </div>
              )}

              {/* Medications Section */}
              {reportData?.medications?.length > 0 && (
                <div
                  style={{
                    padding: "32px",
                    paddingTop: "10px",
                    backgroundColor: "white",
                  }}
                >
                  <SectionHeader title="Medications" />
                  {reportData?.medications.map(
                    (medication: any, index: number) => (
                      <div key={index}>
                        <MedicationItem
                          medicationName={medication?.medicationName}
                          form={medication?.form}
                          dosageFrequency={medication?.dosageFrequency}
                          isActive={medication?.isActive}
                          isReminder={medication?.isReminder}
                        />
                        {index !== reportData.medications.length - 1 && (
                          <Divider />
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* symptoms Section */}
              {reportData?.symptoms?.length > 0 && (
                <div
                  style={{
                    padding: "32px",
                    paddingTop: "10px",
                    backgroundColor: "white",
                  }}
                >
                  <SectionHeader title="Symptoms" />
                  {reportData.symptoms.map((symptom: any, index: number) => (
                    <div key={index}>
                      <SymptomItem
                        symptomName={symptom?.symptomName}
                        duration={symptom?.duration}
                        severity={symptom?.severity}
                        additionalNotes={symptom?.additionalNotes}
                      />
                      {index !== reportData.symptoms.length - 1 && <Divider />}
                    </div>
                  ))}
                </div>
              )}

              {/* insurance Section */}
              {reportData?.insurance?.length > 0 && manualInsuranceList && (
                <div
                  style={{
                    padding: "32px",
                    paddingTop: "10px",
                    backgroundColor: "white",
                  }}
                >
                  <SectionHeader title="Insurance" />
                  {manualInsuranceList?.map((insurance: any, index: number) => (
                    <div key={index}>
                      <InsuranceItem
                        policyType={insurance?.policyType}
                        memberId={insurance?.memberId}
                        groupId={insurance?.groupId}
                        expirationDate={insurance?.expirationDate}
                      />
                      {index !== manualInsuranceList.length - 1 && <Divider />}
                    </div>
                  ))}
                </div>
              )}

              {/* emergency contact Section */}
              {reportData?.emergencyContacts?.length > 0 && (
                <div
                  style={{
                    padding: "32px",
                    paddingTop: "10px",
                    backgroundColor: "white",
                  }}
                >
                  <SectionHeader title="Emergency Contacts" />
                  {reportData.emergencyContacts.map(
                    (emergencyContact: any, index: number) => (
                      <div key={index}>
                        <EmergencyContactsItem
                          contactName={emergencyContact?.contactName}
                          relationship={emergencyContact?.relationship}
                          phoneNumber={emergencyContact?.phoneNumber}
                          email={emergencyContact?.email}
                        />
                        {index !== reportData.emergencyContacts.length - 1 && (
                          <Divider />
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* advancedCarePlan section*/}
              {reportData?.advancedCarePlan &&
                reportData?.advancedCarePlan?.id !== "" && (
                  <div
                    style={{
                      padding: "32px",
                      paddingTop: "10px",
                      backgroundColor: "white",
                    }}
                  >
                    <SectionHeader title="Advance Care Plan" />
                    <InfoRow
                      label="Code Status"
                      value={
                        reportData.advancedCarePlan?.resuscitationPreference
                      }
                    />
                    <InfoRow
                      label="Last Updated"
                      value={formatDate(reportData.advancedCarePlan?.updatedAt)}
                    />
                    <InfoRow
                      label="Document"
                      value={
                        reportData.advancedCarePlan?.codeStatusDocument
                          ?.fileName
                          ? "On File"
                          : "Not Available"
                      }
                    />
                  </div>
                )}

              {/* living will section*/}
              {reportData?.livingWill?.isVisible &&
                reportData?.livingWill?.id !== "" && (
                  <div
                    style={{
                      padding: "32px",
                      paddingTop: "10px",
                      backgroundColor: "white",
                    }}
                  >
                    <SectionHeader title="Living Will" />
                    <InfoRow
                      label="Summary"
                      value={reportData.livingWill?.summary}
                    />

                    <InfoRow
                      label="Document"
                      value={
                        reportData.livingWill?.documents?.[0]?.fileName
                          ? "On File"
                          : "Not Available"
                      }
                    />
                  </div>
                )}

              {/* power of attorney section*/}
              {reportData?.powerOfAttorney?.hasPowerOfAttorney === "Yes" &&
                reportData?.powerOfAttorney?.isVisible && (
                  <div
                    style={{
                      padding: "32px",
                      paddingTop: "10px",
                      backgroundColor: "white",
                    }}
                  >
                    <SectionHeader title="Power Of Attorney" />
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {reportData?.powerOfAttorney?.representativeName}
                    </div>
                    <InfoRow
                      label="Relationship"
                      value={reportData?.powerOfAttorney?.relationship}
                    />
                    <InfoRow
                      label="Phone"
                      value={formatPhoneNumber(
                        reportData?.powerOfAttorney?.phoneNumber,
                      )}
                    />
                    <InfoRow
                      label="Email"
                      value={reportData?.powerOfAttorney?.email}
                    />
                  </div>
                )}

              {/* primary care provider Section */}
              {reportData?.primaryCare?.length > 0 && (
                <div
                  style={{
                    padding: "32px",
                    paddingTop: "10px",
                    backgroundColor: "white",
                  }}
                >
                  <SectionHeader title="Care Providers" />
                  {reportData.primaryCare.map(
                    (primaryCare: any, index: number) => (
                      <div key={index}>
                        <PrimaryCaresItem
                          doctorName={primaryCare?.doctorName}
                          medicalFacility={primaryCare?.medicalFacility}
                          doctorPhone={primaryCare?.doctorPhone}
                          doctorEmail={primaryCare?.doctorEmail}
                          doctorAddress={primaryCare?.doctorAddress}
                        />
                        {index !== reportData.primaryCare.length - 1 && (
                          <Divider />
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* care giver section*/}
              {reportData?.caregiver?.manageOwnHealth === "Yes" &&
                reportData?.caregiver?.isVisible && (
                  <div
                    style={{
                      padding: "32px",
                      paddingTop: "10px",
                      backgroundColor: "white",
                    }}
                  >
                    <SectionHeader title="Caregivers" />
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      {reportData?.caregiver?.caregiverName}
                    </div>
                    <InfoRow
                      label="Relationship"
                      value={reportData?.caregiver?.relationship}
                    />
                    <InfoRow
                      label="Phone"
                      value={formatPhoneNumber(
                        reportData?.caregiver?.caregiverPhone,
                      )}
                    />
                  </div>
                )}

              {/* driving License Section */}
              {reportData?.driversLicense?.length > 0 && manualDLList && (
                <div
                  style={{
                    padding: "32px",
                    paddingTop: "10px",
                    backgroundColor: "white",
                  }}
                >
                  <SectionHeader title="Driver's License" />
                  {manualDLList?.map((dL: any, index: number) => (
                    <div key={index}>
                      <DLItem
                        fullName={dL?.fullName}
                        licenseNumber={dL?.licenseNumber}
                        issuingState={dL?.issuingState}
                        expirationDate={dL?.expirationDate}
                      />
                      {index !== manualDLList.length - 1 && <Divider />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ReportGenerateSection;
