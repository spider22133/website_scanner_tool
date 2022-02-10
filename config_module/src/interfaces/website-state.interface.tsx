export default interface IState {
  id: number;
  website_id: string;
  answer_code: number;
  answer_time?: number;
  answer_text?: string;
  is_error?: boolean;
  createdAt: string;
}
