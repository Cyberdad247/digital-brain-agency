export interface Agency {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  services: string[];
  contactEmail: string;
  phoneNumber?: string;
  address?: string;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}
