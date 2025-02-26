import { Router } from 'express'
import SoftwareController from '@controllers/websites.controller'
import Route from '@/interfaces/route.interface'
import CreateWebsiteDto from '@dtos/website.dto'
import validationMiddleware from '@middlewares/validation.middleware'
import authMiddleware from '@/middlewares/auth.middleware'
import SoftwareVersionChecker from '@/softwareVersionChecker'
import CreateSoftwareDto from '@dtos/sofware.dto'

class WebsitesRoute implements Route {
  public path = '/software'
  public router = Router()
  public softwareController: SoftwareController

  constructor(softwareVersionChecker: SoftwareVersionChecker) {
    this.softwareController = new SoftwareController(softwareVersionChecker)
    this.initializeRoutes()
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.softwareController.getWebsites)
    this.router.get(`${this.path}/:id(\\d+)`, authMiddleware, this.softwareController.getWebsiteById)
    // this.router.get(`${this.path}/q=:query`, authMiddleware, this.softwareController.searchWebsite)
    this.router.get(`${this.path}/q=:query`, authMiddleware, this.softwareController.searchWinGetSoftware)
    this.router.get(`${this.path}/:id(\\d+)/check`, authMiddleware, this.softwareController.checkWebsite)
    this.router.get(`${this.path}/:id(\\d+)/main_states`, authMiddleware, this.softwareController.getWebsiteMainStepStates)
    this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateWebsiteDto, 'body', true), this.softwareController.updateWebsite)
    this.router.post(
      `${this.path}/create`,
      [validationMiddleware(CreateSoftwareDto, 'body'), authMiddleware],
      this.softwareController.createWinGetSoftware,
    )
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.softwareController.deleteWebsite)
  }
}

export default WebsitesRoute
