import config from 'config'
import jwt from 'jsonwebtoken'
import DB from '@databases'
import { CreateUserDto } from '@dtos/users.dto'
import HttpException from '@exceptions/HttpException'
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface'
import { User } from '@/interfaces/user.interface'
import { isEmpty } from '@utils/util'
import { RoleModel } from '@/models/role.model'
import { UserModel } from '@/models/user.model'
import { ActiveDirectoryAuth } from '@/classes/api/ActiveDirectoryAuth'

class AuthService {
  public users = DB.Users
  private activeDirectory: ActiveDirectoryAuth

  constructor(activeDirectory: ActiveDirectoryAuth) {
    this.activeDirectory = activeDirectory
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; findUser: User; roles: RoleModel[]; token: string }> {
    try {
      if (isEmpty(userData)) throw new HttpException(400, 'Sie haben keine Benutzerdaten angegeben')

      const { email, password } = userData

      const isAuthenticated = await this.activeDirectory.authenticate(email, password)
      if (!isAuthenticated) throw new HttpException(401, 'Ungültige Anmeldeinformationen')

      const adUser = await this.activeDirectory.findUser(email)
      if (!adUser) throw new HttpException(404, 'Benutzer im Active Directory nicht gefunden')

      const userInfo = {
        userName: adUser.sAMAccountName || '',
        email: adUser.mail || adUser.userPrincipalName.toLowerCase(),
        firstName: adUser.givenName || '',
        lastName: adUser.sn || '',
      }

      const roleData = {
        id: adUser.employeeID.includes('#ADMIN') ? 3 : 1,
      }

      let findUser: UserModel = await this.users.findOne({
        where: { email: userInfo.email },
        include: [
          {
            model: RoleModel,
            as: 'roles',
          },
        ],
      })

      if (findUser) {
        await findUser.update(userInfo)
        await findUser.setRoles([roleData.id])
      } else {
        findUser = await this.users.create(userInfo)
        const roleExists = await RoleModel.findByPk(roleData.id)
        if (!roleExists) {
          await RoleModel.create({ id: roleData.id, name: adUser.employeeID.includes('#ADMIN') ? 'admin' : 'user' })
        }
        await findUser.setRoles([roleData.id])
      }

      // Fetch the updated user with roles
      findUser = await this.users.findByPk(findUser.id, {
        include: [
          {
            model: RoleModel,
            as: 'roles',
          },
        ],
      })

      const tokenData = this.createToken(findUser)
      const cookie = this.createCookie(tokenData)
      const roles = findUser.roles || [] // Ensure roles is always an array

      return { cookie, findUser, roles, token: tokenData.token }
    } catch (error) {
      console.error('Login error:', error)
      throw error instanceof HttpException ? error : new HttpException(500, 'Interner Serverfehler')
    }
  }

  public async logout(userData: User): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, 'Sie haben keine Benutzerdaten angegeben')

    const findUser: User = await this.users.findOne({ where: { email: userData.email } })
    if (!findUser) throw new HttpException(409, 'Sie sind kein Benutzer')

    return findUser
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id, email: user.email }
    const secretKey: string = config.get('secretKey')
    const expiresIn: number = 60 * 60 * 24 // expires in 24 hours

    return { expiresIn, token: jwt.sign(dataStoredInToken, secretKey, { expiresIn }) }
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`
  }
}

export default AuthService
