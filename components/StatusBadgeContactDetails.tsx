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
  "pending visit": {
    label: "Pending Visit",
    dotColor: "bg-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-200/20",
    textColor: "text-orange-500 dark:text-orange-400",
    borderColor: "border-orange-400",
  },
  "visit requested by rep": {
    label: "Visit requested by rep",
    dotColor: "bg-pink-400",
    bgColor: "bg-pink-100 dark:bg-pink-200/20",
    textColor: "text-pink-500 dark:text-pink-400",
    borderColor: "border-pink-400",
  },
  "dropped off": {
    label: "Dropped Off",
    dotColor: "bg-emerald-400",
    bgColor: "bg-emerald-100 dark:bg-emerald-200/20",
    textColor: "text-emerald-500 dark:text-emerald-400",
    borderColor: "border-emerald-400",
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
