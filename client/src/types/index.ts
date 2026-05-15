export type AssetType =
  | 'Live Webinar'
  | 'On-Demand Webinar'
  | 'Whitepaper'
  | 'on-demand podcast';

export interface Speaker {
  name: string;
  title?: string;
  company?: string;
}

export interface Asset {
  id: string;
  name: string;
  description: string;
  assetType: AssetType;
  sponsorName: string;
  executionDate?: string;
  expirationDate?: string;
  speakers?: Speaker[];
  createdDate?: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
}

export interface SignupPayload {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  companyName: string;
}

export interface SignupResult {
  id: string;
  assetId: string;
  signupDate: string;
  person: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    companyName: string;
  };
}
