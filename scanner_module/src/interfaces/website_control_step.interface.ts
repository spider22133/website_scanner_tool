export interface WebsiteControlStep {
  id: number;
  website_id: number;
  type: string;
  description: string;
  path: string;
  api_call_data: string;
  estimated_code: number;
}
