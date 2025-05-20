// Enum for labels and keying
export enum StatusKey {
  All = "all",
  Assigned = "assigned",
  Visited = "visited",
  DroppedOff = "dropped off",
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
];

// Optional: UI labels or styles
export const statusLabels: Record<StatusKey, string> = {
  [StatusKey.All]: "All Status",
  [StatusKey.Assigned]: "assigned",
  [StatusKey.Visited]: "visited",
  [StatusKey.DroppedOff]: "Dropped Off",
};
