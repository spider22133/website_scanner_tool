export default interface IUser {
  id?: string
  firstName?: string
  lastName?: string
  email: string
  password: string
  roles?: string[]
  token?: string
}
