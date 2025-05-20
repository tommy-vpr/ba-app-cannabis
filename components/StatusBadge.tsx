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
    dotColor: "bg-purple-300",
    bgColor: "bg-purple-50 dark:bg-purple-500",
    textColor: "text-purple-400 dark:text-purple-100",
    borderColor: "border-purple-300 dark:border-none",
  },
  visited: {
    label: "Visited",
    dotColor: "bg-orange-300",
    bgColor: "bg-orange-50 dark:bg-orange-400",
    textColor: "text-orange-400 dark:text-white",
    borderColor: "border-orange-300 dark:border-none",
  },
  "dropped off": {
    label: "Dropped Off",
    dotColor: "bg-green-300",
    bgColor: "bg-green-50 dark:bg-green-500",
    textColor: "text-green-400 dark:text-white",
    borderColor: "border-green-300 dark:border-none",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status.toLowerCase()] ?? {
    label: status,
    dotColor: "bg-gray-400",
    bgColor: "bg-gray-100 dark:bg-transparent",
    textColor: "text-gray-300",
    borderColor: "border-gray-300",
  };

  return (
    <div
      className={`mt-auto inline-flex w-fit items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} border ${config.borderColor}`}
    >
      {/* <span className={`w-3 h-3 rounded-full ${config.dotColor}`} /> */}
      <span className={`text-[11px] font-semibold ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
}
