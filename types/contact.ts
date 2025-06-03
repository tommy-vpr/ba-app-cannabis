export type HubSpotContact = {
  id: string;
  properties: {
    firstname?: string;
    lastname?: string;
    email?: string;
    company?: string;
    phone?: string;
    address?: string;
    zip?: string;
    lead_status_l2?: string;
    meeting_logs?: MeetingLog[];
    [key: string]: any;
  };
};

export type MeetingLog = {
  id: string;
  date: string;
  notes: string;
  createdBy: string;
};
