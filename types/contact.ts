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
    l2_lead_status?: string;
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
