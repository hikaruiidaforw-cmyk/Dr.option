import type {
  User,
  DoctorProfile,
  DoctorSpecialty,
  CorporationProfile,
  ConsultantProfile,
  JobPosting,
  JobPostingImage,
  Application,
  Scout,
  Favorite,
  Match,
  Contract,
  MatchNote,
  ChatRoom,
  ChatParticipant,
  ChatMessage,
  Notification,
  UserRole,
  Gender,
  JobPostingStatus,
  ApplicationStatus,
  ScoutStatus,
  MatchStatus,
  ContractType,
  ContractStatus,
  NotificationType,
} from "@prisma/client";

// Re-export Prisma types
export type {
  User,
  DoctorProfile,
  DoctorSpecialty,
  CorporationProfile,
  ConsultantProfile,
  JobPosting,
  JobPostingImage,
  Application,
  Scout,
  Favorite,
  Match,
  Contract,
  MatchNote,
  ChatRoom,
  ChatParticipant,
  ChatMessage,
  Notification,
  UserRole,
  Gender,
  JobPostingStatus,
  ApplicationStatus,
  ScoutStatus,
  MatchStatus,
  ContractType,
  ContractStatus,
  NotificationType,
};

// ──────────────────────────────────────
// Extended Types with Relations
// ──────────────────────────────────────

export type UserWithProfile = User & {
  doctorProfile?: DoctorProfile | null;
  corporationProfile?: CorporationProfile | null;
  consultantProfile?: ConsultantProfile | null;
};

export type DoctorProfileWithSpecialties = DoctorProfile & {
  specialties: DoctorSpecialty[];
};

export type DoctorProfileFull = DoctorProfile & {
  specialties: DoctorSpecialty[];
  user: Pick<User, "id" | "email" | "role">;
};

export type CorporationProfileFull = CorporationProfile & {
  user: Pick<User, "id" | "email" | "role">;
  jobPostings?: JobPosting[];
};

export type JobPostingWithCorporation = JobPosting & {
  corporation: Pick<CorporationProfile, "id" | "corporationName" | "logoUrl">;
  images?: JobPostingImage[];
};

export type JobPostingFull = JobPosting & {
  corporation: CorporationProfile;
  images: JobPostingImage[];
  applications?: Application[];
  favorites?: Favorite[];
};

export type ApplicationWithDetails = Application & {
  doctorProfile: DoctorProfile & {
    specialties: DoctorSpecialty[];
  };
  jobPosting: JobPosting & {
    corporation: Pick<CorporationProfile, "id" | "corporationName">;
  };
  match?: Match | null;
};

export type ScoutWithDetails = Scout & {
  corporation: CorporationProfile;
  doctorProfile: DoctorProfile;
  jobPosting: JobPosting;
};

export type MatchWithDetails = Match & {
  application: Application & {
    doctorProfile: DoctorProfile;
    jobPosting: JobPosting & {
      corporation: CorporationProfile;
    };
  };
  consultant?: ConsultantProfile | null;
  contracts: Contract[];
  notes: MatchNote[];
};

export type ChatRoomWithParticipants = ChatRoom & {
  participants: ChatParticipant[];
  messages: ChatMessage[];
};

export type ChatMessageWithSender = ChatMessage & {
  sender: Pick<User, "id" | "role">;
};

// ──────────────────────────────────────
// API Request/Response Types
// ──────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiErrorResponse {
  error: string;
  details?: Record<string, string[]>;
}

// ──────────────────────────────────────
// Form Types
// ──────────────────────────────────────

export interface JobSearchFilters {
  department?: string;
  area?: string;
  salaryMin?: number;
  salaryMax?: number;
  transferPriceMin?: number;
  transferPriceMax?: number;
  transferTimingMin?: number;
  transferTimingMax?: number;
  includesRealEstate?: boolean;
  includesEquipment?: boolean;
  includesStaff?: boolean;
  keyword?: string;
  sortBy?: "createdAt" | "salary" | "transferPrice";
  sortOrder?: "asc" | "desc";
}

export interface DoctorSearchFilters {
  departments?: string[];
  areas?: string[];
  salaryMin?: number;
  salaryMax?: number;
  experienceMin?: number;
  keyword?: string;
}

// ──────────────────────────────────────
// Session Types
// ──────────────────────────────────────

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
}

// ──────────────────────────────────────
// Component Props Types
// ──────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: number;
}
