import {
  formatDate,
  formatDurationSince,
  formatPhoneNumber,
} from "@/lib/utils";

export const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div style={{ marginBottom: "28px" }}>
    <h2
      style={{
        fontSize: "20px",
        fontWeight: 700,
        marginBottom: "12px",
      }}
    >
      {title}
    </h2>

    <div
      style={{
        height: "1px",
        backgroundColor: "#E5E7EB",
        marginBottom: "12px",
      }}
    />

    {children}
  </div>
);

export const InfoRow = ({ label, value }: { label: string; value: string }) => (
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
    <span>{label}:</span>
    <span style={{ textTransform: "capitalize" }}>{value}</span>
  </div>
);

export const SectionHeader = ({ title }: { title: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      marginBottom: "12px",
      marginTop: "32px",
      fontFamily: `Mona Sans, sans-serif`,
      fontSize: "20px",
      fontWeight: 500,
    }}
  >
    <h2
      style={{
        margin: 0,
        fontSize: "22px",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {title}
    </h2>

    {/* Horizontal line */}
    <div
      style={{
        flex: 1,
        height: "1px",
        backgroundColor: "#E5E7EB",
        marginTop: "4px",
      }}
    />
  </div>
);

export const AllergyItem = ({
  name,
  reaction,
  severity,
  notes,
}: {
  name: string;
  reaction: string;
  severity: string;
  notes?: string;
}) => (
  <div
    style={{
      fontFamily: `"Mona Sans", sans-serif`,
      paddingBottom: "16px",
      pageBreakInside: "avoid", // PDF safe
    }}
  >
    <div
      style={{
        fontSize: "16px",
        fontWeight: 600,
        marginBottom: "8px",
      }}
    >
      {name}
    </div>

    <div style={{ fontSize: "14px", lineHeight: "1.8", fontWeight: 400 }}>
      <div>Reaction: {reaction}</div>
      <div>Severity: {severity}</div>
      {notes && <div>Notes: {notes}</div>}
    </div>
  </div>
);

export const Divider = () => (
  <div
    style={{
      height: "1px",
      backgroundColor: "#E5E7EB",
      margin: "10px 0",
      // width: "100%",
    }}
  />
);

export const PharmacyItem = ({
  pharmacyName,
  pharmacyAddress,
  pharmacyPhone,
}: {
  pharmacyName: string;
  pharmacyAddress: string;
  pharmacyPhone: string;
}) => (
  <div
    style={{
      fontFamily: `"Mona Sans", sans-serif`,
      paddingBottom: "16px",
      pageBreakInside: "avoid", // PDF safe
    }}
  >
    <div
      style={{
        fontSize: "16px",
        fontWeight: 600,
        marginBottom: "4px",
      }}
    >
      {pharmacyName}
    </div>

    <div style={{ fontSize: "14px", lineHeight: "1.8", fontWeight: 400 }}>
      <div>Address: {pharmacyAddress}</div>
      <div>Phone: {formatPhoneNumber(pharmacyPhone)}</div>
    </div>
  </div>
);

export const MedicationItem = ({
  medicationName,
  form,
  dosageFrequency,
  isActive,
  isReminder,
}: {
  medicationName: string;
  form: string;
  dosageFrequency: string;
  isActive: boolean;
  isReminder: boolean;
}) => (
  <div
    style={{
      fontFamily: `"Mona Sans", sans-serif`,
      paddingBottom: "16px",
      pageBreakInside: "avoid", // PDF safe
    }}
  >
    <div
      style={{
        fontSize: "16px",
        fontWeight: 600,
        marginBottom: "4px",
      }}
    >
      {medicationName}
    </div>

    <div style={{ fontSize: "14px", lineHeight: "1.8", fontWeight: 400 }}>
      <div>Form: {form}</div>
      <div>Frequency: {dosageFrequency}</div>
      <div>Active: {isActive ? "Yes" : "No"}</div>
      <div>Refile Reminder: {isReminder ? "Yes" : "None"}</div>
    </div>
  </div>
);

export const SymptomItem = ({
  symptomName,
  duration,
  severity,
  additionalNotes,
}: {
  symptomName: string;
  duration: string;
  severity: string;
  additionalNotes: string;
}) => (
  <div
    style={{
      fontFamily: `"Mona Sans", sans-serif`,
      paddingBottom: "16px",
      pageBreakInside: "avoid", // PDF safe
    }}
  >
    <div
      style={{
        fontSize: "16px",
        fontWeight: 600,
        marginBottom: "4px",
      }}
    >
      {symptomName}
    </div>

    <div style={{ fontSize: "14px", lineHeight: "1.8", fontWeight: 400 }}>
      <div>Severity: {severity}</div>
      <div>Duration: {formatDurationSince(duration)}</div>
      {additionalNotes && <div>Notes: {additionalNotes}</div>}
    </div>
  </div>
);

export const InsuranceItem = ({
  memberId,
  groupId,
  expirationDate,
  policyType,
}: {
  memberId: string;
  groupId: string;
  expirationDate: string;
  policyType: string;
}) => (
  <div
    style={{
      fontFamily: `"Mona Sans", sans-serif`,
      paddingBottom: "16px",
      pageBreakInside: "avoid",
    }}
  >
    <div
      style={{
        fontSize: "16px",
        fontWeight: 600,
        marginBottom: "4px",
      }}
    >
      {policyType}
    </div>

    <div style={{ fontSize: "14px", lineHeight: "1.8", fontWeight: 400 }}>
      <div>Member ID: {memberId}</div>
      <div>Group ID: {groupId}</div>
      <div>Expires {formatDate(expirationDate)}</div>
    </div>
  </div>
);

export const EmergencyContactsItem = ({
  contactName,
  relationship,
  phoneNumber,
  email,
}: {
  contactName: string;
  relationship: string;
  phoneNumber: string;
  email: string;
}) => (
  <div
    style={{
      fontFamily: `"Mona Sans", sans-serif`,
      paddingBottom: "16px",
      pageBreakInside: "avoid", // PDF safe
    }}
  >
    <div
      style={{
        fontSize: "16px",
        fontWeight: 600,
        marginBottom: "4px",
      }}
    >
      {contactName}
    </div>

    <div style={{ fontSize: "14px", lineHeight: "1.8", fontWeight: 400 }}>
      <div>Relationship: {relationship}</div>
      <div>Phone: {formatPhoneNumber(phoneNumber)}</div>

      <div>Email: {email}</div>
    </div>
  </div>
);

export const PrimaryCaresItem = ({
  doctorName,
  medicalFacility,
  doctorPhone,
  doctorEmail,
  doctorAddress,
}: {
  doctorName: string;
  medicalFacility: string;
  doctorPhone: string;
  doctorEmail: string;
  doctorAddress: string;
}) => (
  <div
    style={{
      fontFamily: `"Mona Sans", sans-serif`,
      paddingBottom: "16px",
      pageBreakInside: "avoid", // PDF safe
    }}
  >
    <div
      style={{
        fontSize: "16px",
        fontWeight: 600,
        marginBottom: "4px",
      }}
    >
      {doctorName}
    </div>

    <div
      style={{
        fontSize: "14px",
        lineHeight: "1.8",
        fontWeight: 400,
      }}
    >
      <div>Clinic: {medicalFacility}</div>
      <div>Phone: {formatPhoneNumber(doctorPhone)}</div>

      <div>Email: {doctorEmail}</div>
      <div>Address: {doctorAddress}</div>
    </div>
  </div>
);

export const DLItem = ({
  fullName,
  licenseNumber,
  issuingState,
  expirationDate,
}: {
  fullName: string;
  licenseNumber: string;
  issuingState: string;
  expirationDate: string;
}) => (
  <div
    style={{
      fontFamily: `"Mona Sans", sans-serif`,
      paddingBottom: "16px",
      pageBreakInside: "avoid", // PDF safe
    }}
  >
    <div style={{ fontSize: "14px", lineHeight: "1.8", fontWeight: 400 }}>
      <div>Name: {fullName}</div>
      <div>License Number: {licenseNumber}</div>

      <div>State: {issuingState}</div>
      <div>Expiration Date: {formatDate(expirationDate)}</div>
    </div>
  </div>
);
