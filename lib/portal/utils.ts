import { IdentifierKind } from "@/lib/portal/types";

const IST_TIME_ZONE = "Asia/Kolkata";

export function normalizeEmail(value: string): string {
  return String(value || "").trim().toLowerCase();
}

export function normalizePhone(value: string): string {
  return String(value || "").replace(/\D/g, "");
}

export function getPhoneVariants(value: string): string[] {
  const normalized = normalizePhone(value);
  if (!normalized) {
    return [];
  }

  const variants = new Set<string>([normalized]);

  if (normalized.length === 12 && normalized.startsWith("91")) {
    variants.add(normalized.slice(2));
  }

  if (normalized.length > 10) {
    variants.add(normalized.slice(-10));
  }

  return Array.from(variants);
}

export function parseIdentifierKind(identifier: string): IdentifierKind {
  return String(identifier).includes("@") ? "email" : "phone";
}

export function normalizeIdentifier(identifier: string): { kind: IdentifierKind; value: string } {
  const kind = parseIdentifierKind(identifier);
  if (kind === "email") {
    return { kind, value: normalizeEmail(identifier) };
  }

  return { kind, value: normalizePhone(identifier) };
}

export function toBooleanCell(value: string): boolean {
  const normalized = String(value || "").trim().toLowerCase();
  return ["yes", "true", "1", "enabled", "submitted"].includes(normalized);
}

export function isPaymentVerified(status: string): boolean {
  const normalized = String(status || "").trim().toLowerCase();
  return ["verified", "paid", "completed", "complete", "success", "confirmed"].includes(
    normalized
  );
}

export function toIsoStringSafe(value: string): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
}

export function formatDateTimeInIST(value: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: IST_TIME_ZONE,
    timeZoneName: "short",
  });
}

export function sanitizeFileName(name: string): string {
  return String(name || "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(0, 80);
}

export function getDomainFolderName(domain: string): string {
  if (domain === "AI for Social Good") {
    return "AI for Social Good";
  }

  if (domain === "Sustainability Goals") {
    return "Sustainability Goals";
  }

  if (domain === "Cybersecurity & Blockchain") {
    return "Cybersecurity & Blockchain";
  }

  return "Other";
}
