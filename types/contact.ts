export type HubSpotContact = {
  id: string;
  properties: {
    firstname?: string;
    lastname?: string;
    jobtitle?: string;
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

export type EditableContact = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address?: string;
  jobtitle?: string;
};

export type MeetingLog = {
  id: string;
  title: string;
  createdAt: string;
  notes?: string;
  status?: string;
};
