export type Company = {
  id: string;
  name: string;
  legal_business_name: string;
  address: string | null;
  city: string | null;
  state?: string | null;
  zip?: string | null;
  county?: string | null;
  isBookmarked?: boolean;
  contacts: {
    id: string;
    properties: {
      firstname: string | null;
      lastname: string | null;
      email: string;
    };
  }[];
};
