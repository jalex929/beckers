export interface Speaker {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  companyName: string;
  email: string;
}

export type AssetType = 'Live Webinar' | 'On-Demand Webinar' | 'Whitepaper' | 'on-demand podcast';

export interface Asset {
  id: string;
  name: string;
  description: string;
  assetType: AssetType;
  sponsorName: string;
  executionDate?: string;
  expirationDate?: string;
  speakers?: Speaker[];
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

export interface SignupPayload {
  person: {
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    companyName: string;
  };
}

export interface SignupRecord {
  id: string;
  assetId: string;
  signupDate: string;
  person: Speaker;
}
