export type IdentifierKind = "email" | "phone";

export interface PortalRecord {
  rowNumber: number;
  timestamp: string;
  teamName: string;
  teamLeaderName: string;
  email: string;
  phone: string;
  college: string;
  domain: string;
  ideaTitle: string;
  paymentStatus: string;
  teamId: string;
  portalAccessEnabled: boolean;
  passwordHash: string;
  pptSubmitted: boolean;
  pptFileName: string;
  pptDriveUrl: string;
  pptUploadedAt: string;
}

export interface PortalPublicProfile {
  teamName: string;
  teamId: string;
  teamLeaderName: string;
  email: string;
  phone: string;
  college: string;
  domain: string;
  ideaTitle: string;
  registrationDate: string;
  paymentStatus: string;
  pptSubmitted: boolean;
  pptFileName: string;
  pptDriveUrl: string;
  pptUploadedAt: string;
}

export interface PortalSessionPayload {
  teamId: string;
  email: string;
  phone: string;
}

export interface TeamLookupResult {
  record: PortalRecord;
  matchedOn: IdentifierKind;
}
