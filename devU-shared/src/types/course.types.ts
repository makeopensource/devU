export type Course = {
  id?: number
  name: string
  semester: string
  number: string
  startDate: string
  endDate: string
  createdAt?: string
  updatedAt?: string
  isPublic?: boolean;
  makePrivateDate?: string;
  allowlist?: string[]; 
  blocklist?: string[]; 
}
