export default interface IWebsiteControlStep {
  id: string;
  website_id: string;
  type?: string;
  description: string;
  path: string;
  api_call_data: string;
  estimated_code?: number;
  createdAt?: string;
  updatedAt?: string;
}
