export default interface IUser {
  id?: number
  firstName?: string
  lastName?: string
  email: string
  password: string
  roles?: string[]
  token?: string
}
