import { Role } from '../../../scanner_module/dist/scanner_module/src/interfaces/role.interface'
export default interface IUser {
  id?: number
  firstName?: string
  lastName?: string
  email: string
  password: string
  roles?: Role[]
  token?: string
}
