export interface Company {
  id: string;
  owner_id: string;
  name: string;
  phone?: string;
  share_token: string;
}

export interface Deadline {
  id: string;
  company_id: string;
  name: string;
  category: string;
  expires_on: string;
}

export interface PacketData {
  company: string;
  items: Array<{
    name: string;
    category: string;
    expires_on: string;
  }>;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
  };
  access_token: string;
}
