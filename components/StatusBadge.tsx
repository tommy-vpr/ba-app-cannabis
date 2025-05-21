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
    bgColor: "bg-purple-50 dark:bg-purple-400",
    textColor: "text-purple-400 dark:text-white",
    borderColor: "border-purple-300 dark:border-transparent",
  },
  visited: {
    label: "Visited",
    dotColor: "bg-rose-300",
    bgColor: "bg-rose-50 dark:bg-rose-400",
    textColor: "text-rose-400 dark:text-white",
    borderColor: "border-rose-300 dark:border-transparent",
  },
  "dropped off": {
    label: "Dropped Off",
    dotColor: "bg-green-300",
    bgColor: "bg-green-50 dark:bg-green-400",
    textColor: "text-green-400 dark:text-white",
    borderColor: "border-green-300 dark:border-transparent",
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
