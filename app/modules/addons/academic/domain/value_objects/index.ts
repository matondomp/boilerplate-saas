export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  NUMERIC = 'NUMERIC',
  TEXT = 'TEXT',
  OPEN_ENDED = 'OPEN_ENDED',
}

export enum QuestionStatus {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  AI_PROCESSED = 'AI_PROCESSED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
}

export enum DifficultyLevel {
  VERY_EASY = 'VERY_EASY',
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  VERY_HARD = 'VERY_HARD',
}

export enum ContentSource {
  OFFICIAL_EXAM = 'OFFICIAL_EXAM',
  PREPARATORY_MATERIAL = 'PREPARATORY_MATERIAL',
  PARTNER_CONTENT = 'PARTNER_CONTENT',
  USER_SUBMITTED = 'USER_SUBMITTED',
  ORIGINAL = 'ORIGINAL',
  AI_GENERATED = 'AI_GENERATED',
}

export interface SourceMetadata {
  sourceName?: string
  sourceUrl?: string
  sourceAuthor?: string
  license?: string
  confidenceScore?: number
}

export enum QuestionRelationType {
  SAME_AS = 'SAME_AS',
  SIMILAR_TO = 'SIMILAR_TO',
}

export enum UniversityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum CourseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum PreparationGoalStatus {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}
