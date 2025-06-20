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
    dotColor: "bg-amber-300",
    bgColor: "bg-transparent",
    textColor: "text-amber-400 dark:text-amber-400",
    borderColor: "border-amber-300 dark:border-amber-400",
  },
  visited: {
    label: "Visited",
    dotColor: "bg-rose-300",
    bgColor: "bg-transparent",
    textColor: "text-rose-400 dark:text-rose-400",
    borderColor: "border-rose-300 dark:border-rose-400",
  },
  "dropped off": {
    label: "Dropped Off",
    dotColor: "bg-green-300",
    bgColor: "bg-transparent",
    textColor: "text-green-400 dark:text-green-400",
    borderColor: "border-green-300 dark:border-green-400",
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusMap[status.toLowerCase()] ?? {
    label: status,
    dotColor: "bg-gray-400",
    bgColor: "bg-gray-100 dark:bg-transparent",
    textColor: "text-gray-400 dark:text-gray-300",
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
