import { Router } from 'express'
import SoftwareController from '@controllers/software.controller'
import Route from '@/interfaces/route.interface'
import validationMiddleware from '@middlewares/validation.middleware'
import authMiddleware from '@/middlewares/auth.middleware'
import SoftwareVersionChecker from '@/classes/SoftwareVersionChecker'
import CreateSoftwareDto from '@dtos/software.dto'

class SoftwareRoute implements Route {
  public path = '/software'
  public router = Router()
  public softwareController: SoftwareController

  constructor(softwareVersionChecker: SoftwareVersionChecker) {
    this.softwareController = new SoftwareController(softwareVersionChecker)
    this.initializeRoutes()
  }

  private initializeRoutes() {
    // Software retrieval routes
    this.router.get(this.path, authMiddleware, this.softwareController.getSoftware)
    this.router.get(`${this.path}/:id(\\d+)`, authMiddleware, this.softwareController.getSoftwareById)
    this.router.get(`${this.path}/q=:query`, authMiddleware, this.softwareController.searchWinGetSoftware)

    // Software version checking
    this.router.get(`${this.path}/:id/check`, authMiddleware, this.softwareController.checkSoftware)

    // Representative management
    this.router.get(`${this.path}/:id/representatives`, authMiddleware, this.softwareController.getSoftwareRepresentatives)
    this.router.post(`${this.path}/:id/representatives`, authMiddleware, this.softwareController.setSoftwareRepresentatives)

    // Software modification routes
    this.router.post(
      `${this.path}/create`,
      [validationMiddleware(CreateSoftwareDto, 'body'), authMiddleware],
      this.softwareController.createWinGetSoftware,
    )
    this.router.put(`${this.path}/:id`, validationMiddleware(CreateSoftwareDto, 'body', true), this.softwareController.updateSoftware)
    this.router.delete(`${this.path}/:id`, authMiddleware, this.softwareController.deleteSoftware)
  }
}

export default SoftwareRoute
