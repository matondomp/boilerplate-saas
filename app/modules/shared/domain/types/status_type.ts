export enum StatusEnum {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  STARTED = 'STARTED',
  FAILED = 'FAILED',
}

export type StatusType =
  | StatusEnum.ACTIVE
  | StatusEnum.PENDING
  | StatusEnum.INACTIVE
  | StatusEnum.DELETED
  | StatusEnum.STARTED
  | StatusEnum.FAILED
