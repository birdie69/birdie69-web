export type CoupleStatus = "Pending" | "Active" | "Disbanded" | "Cancelled";

export interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface CoupleDto {
  id: string;
  initiatorId: string;
  partnerId: string | null;
  inviteCode: string;
  status: CoupleStatus;
  notificationTime: string;
}
