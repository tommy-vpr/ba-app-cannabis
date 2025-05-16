// Enum for labels and keying
export enum StatusKey {
  All = "all",
  PendingVisit = "pending visit",
  VisitRequestedByRep = "visit requested by rep",
  DroppedOff = "dropped off",
}

// Derived type
export type StatusCount = {
  [K in StatusKey]: number;
};

// For iterating through statuses in UI
export const statusList: StatusKey[] = [
  StatusKey.All,
  StatusKey.PendingVisit,
  StatusKey.VisitRequestedByRep,
  StatusKey.DroppedOff,
];

// Optional: UI labels or styles
export const statusLabels: Record<StatusKey, string> = {
  [StatusKey.All]: "All Status",
  [StatusKey.PendingVisit]: "Pending Visit",
  [StatusKey.VisitRequestedByRep]: "Visit Requested by Rep",
  [StatusKey.DroppedOff]: "Dropped Off",
};
