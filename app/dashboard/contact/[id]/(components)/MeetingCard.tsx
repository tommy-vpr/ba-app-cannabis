import { IconCheck } from "@tabler/icons-react";

type Props = {
  log: {
    id: string;
    title: string;
    notes?: string;
    createdAt: string;
  };
  onClick: () => void;
};

const MeetingCard = ({ log, onClick }: Props) => {
  return (
    <div
      className="relative cursor-pointer transition duration-200 hover:-translate-y-0.5 shadow-md shadow-gray-200 dark:shadow-black/30 gap-4 border border-muted p-4 rounded-md dark:border-[#30363d] bg-white dark:bg-[#161b22]"
      onClick={onClick}
    >
      <h4 className="text-md font-medium">{log.title}</h4>
      <p className="text-sm text-gray-500">
        {new Date(log.createdAt).toLocaleString()}
      </p>
      <IconCheck
        size={21}
        className="text-blue-500 dark:text-green-500 absolute top-2 right-2 set-chart-2"
      />
    </div>
  );
};

export default MeetingCard;
