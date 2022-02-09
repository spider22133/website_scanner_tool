export default interface IWebsite {
  id: string;
  name: string;
  url: string;
  is_hidden?: boolean;
  is_active?: boolean;
  updatedAt?: string;
}
