import { Role } from '../../../../scanner_module/dist/scanner_module/src/interfaces/role.interface'

export const isAdminUser = (roles?: Role[]): boolean => roles?.some(role => role.name === 'admin') ?? false
