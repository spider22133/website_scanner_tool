export interface WebsiteState {
  id?: number;
  step_id: number;
  response_code: number;
  response_time?: number;
  response_text?: string;
  is_error?: boolean;
}
