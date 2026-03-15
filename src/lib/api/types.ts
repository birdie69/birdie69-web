export type CoupleStatus = "Pending" | "Active" | "Disbanded" | "Cancelled";

export interface QuestionDto {
  id: string;
  documentId: string;
  title: string;
  body: string;
  category: string;
  scheduledDate: string;
  tags: string[];
}

export interface AnswerDto {
  id: string;
  userId: string;
  text: string;
  submittedAt: string;
}

export interface AnswerRevealDto {
  isRevealed: boolean;
  myAnswer: AnswerDto | null;
  partnerAnswer: AnswerDto | null;
}

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
