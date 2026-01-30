import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDurationSince(dateString: string) {
  if (!dateString) return "NA";

  const startDate = new Date(dateString);
  const today = new Date();

  // Normalize both to start of the day
  startDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

  const formattedDate = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  return `Since ${formattedDate} (${diffDays} day${diffDays !== 1 ? "s" : ""})`;
}

export function formatDateTime(dateString: string) {
  if (!dateString) return "NA";

  const date = new Date(dateString);

  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatPhoneNumber(phone: string) {
  if (!phone) return "";

  const phoneNumber = parsePhoneNumberFromString(phone);

  if (!phoneNumber) return phone;

  return phoneNumber.formatInternational();
}

export const formatDate = (isoDate: string) => {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const isPdf = (url?: string) =>
  typeof url === "string" && url.toLowerCase().endsWith(".pdf");

export const isImage = (url?: string) =>
  typeof url === "string" &&
  (url.endsWith(".jpg") ||
    url.endsWith(".jpeg") ||
    url.endsWith(".png") ||
    url.endsWith(".webp"));

export const formatAddress = (address: any) =>
  [
    address?.street,
    address?.city,
    address?.state,
    address?.country,
    address?.zip,
  ]
    .filter(Boolean)
    .join(", ");
