export default interface IUser {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  roles?: string[];
  token?: string;
}
