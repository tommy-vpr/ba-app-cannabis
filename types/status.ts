// Enum for labels and keying
export enum StatusKey {
  All = "all",
  Assigned = "Assigned",
  Visited = "Visited",
  DroppedOff = "Dropped Off",
  NotStarted = "Not Started",
}

// Derived type
export type StatusCount = {
  [K in StatusKey]: number;
};

// For iterating through statuses in UI
export const statusList: StatusKey[] = [
  StatusKey.All,
  StatusKey.Assigned,
  StatusKey.Visited,
  StatusKey.DroppedOff,
  StatusKey.NotStarted,
];

// Optional: UI labels or styles
export const statusLabels: Record<StatusKey, string> = {
  [StatusKey.All]: "All Status",
  [StatusKey.Assigned]: "Assigned",
  [StatusKey.Visited]: "Visited",
  [StatusKey.DroppedOff]: "Dropped Off",
  [StatusKey.NotStarted]: "Not Started",
};
