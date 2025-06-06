import { Router } from 'express'
import AuthController from '@controllers/auth.controller'
import { CreateUserDto } from '@dtos/users.dto'
import Route from '@/interfaces/route.interface'
import authMiddleware from '@middlewares/auth.middleware'
import validationMiddleware from '@middlewares/validation.middleware'
import { ActiveDirectoryAuth } from '@/classes/api/ActiveDirectoryAuth'

class AuthRoute implements Route {
  public path = '/'
  public router = Router()
  public authController: AuthController
  public activeDirectory: ActiveDirectoryAuth

  // ActiveDirectory service user credentials
  private activeDirectoryUrl: string
  private activeDirectoryName: string
  private activeDirectorySecret: string

  constructor() {
    this.activeDirectoryUrl = process.env.AD_SERVER_URL
    this.activeDirectoryName = process.env.AD_SERVICE_USER_NAME
    this.activeDirectorySecret = process.env.AD_SERVICE_USER_PASSWORD

    // ActiveDirectory initialization
    this.activeDirectory = new ActiveDirectoryAuth({
      url: this.activeDirectoryUrl,
      baseDN: 'DC=med,DC=tu-dresden,DC=de',
      bindDN: this.activeDirectoryName,
      bindPassword: this.activeDirectorySecret,
    })

    this.authController = new AuthController(this.activeDirectory)
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.post(`${this.path}login`, validationMiddleware(CreateUserDto, 'body'), this.authController.logIn)
    this.router.post(`${this.path}logout`, authMiddleware, this.authController.logOut)
  }
}

export default AuthRoute
