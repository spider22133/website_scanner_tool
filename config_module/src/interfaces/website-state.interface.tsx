export default interface IState {
  id: number;
  website_id: string;
  response_code: number;
  response_time?: number;
  response_text?: string;
  is_error?: boolean;
  createdAt: string;
}
