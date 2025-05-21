const statusMap: Record<
  string,
  {
    label: string;
    dotColor: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  assigned: {
    label: "Assigned",
    dotColor: "bg-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-200/20",
    textColor: "text-amber-500 dark:text-amber-400",
    borderColor: "border-amber-400",
  },
  visited: {
    label: "Visited",
    dotColor: "bg-rose-400",
    bgColor: "bg-rose-100 dark:bg-rose-200/20",
    textColor: "text-rose-500 dark:text-rose-400",
    borderColor: "border-rose-400",
  },
  "dropped off": {
    label: "Dropped Off",
    dotColor: "bg-green-400",
    bgColor: "bg-green-100 dark:bg-green-200/20",
    textColor: "text-green-500 dark:text-green-400",
    borderColor: "border-green-400",
  },
};

export function StatusBadgeContactDetails({ status }: { status: string }) {
  const config = statusMap[status.toLowerCase()] ?? {
    label: status,
    dotColor: "bg-gray-400",
    bgColor: "bg-gray-100",
    textColor: "text-gray-500 dark:text-gray-400",
    borderColor: "border-gray-400",
  };

  return (
    <div
      className={`mt-auto inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} border ${config.borderColor}`}
    >
      {/* <span className={`w-3 h-3 rounded-full ${config.dotColor}`} /> */}
      <span className={`block rounded-full ${config.dotColor} h-2 w-2`}>
        &nbsp;
      </span>
      <span className={`text-[11px] font-semibold ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
}
