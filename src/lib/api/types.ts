// The API serializes CoupleStatus as a string ("Active") after JsonStringEnumConverter
// is configured, but older containers may return the numeric form (0, 1, 2, 3).
// Accept both so the UI is robust during migrations.
export type CoupleStatus =
  | "Pending" | "Active" | "Disbanded" | "Cancelled"
  | 0 | 1 | 2 | 3;

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
