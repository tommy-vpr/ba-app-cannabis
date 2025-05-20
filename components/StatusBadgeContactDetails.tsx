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
    dotColor: "bg-blue-200",
    bgColor: "bg-blue-100 dark:bg-blue-400",
    textColor: "text-blue-500 dark:text-blue-100",
    borderColor: "border-blue-400",
  },
  visited: {
    label: "Visited",
    dotColor: "bg-purple-200",
    bgColor: "bg-purple-100 dark:bg-purple-400",
    textColor: "text-purple-500 dark:text-purple-100",
    borderColor: "border-purple-400",
  },
  "dropped off": {
    label: "Dropped Off",
    dotColor: "bg-green-200",
    bgColor: "bg-green-100 dark:bg-green-400",
    textColor: "text-green-500 dark:text-green-100",
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
