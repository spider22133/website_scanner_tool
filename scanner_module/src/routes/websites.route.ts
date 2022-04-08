import { Router } from 'express';
import WebsitesController from '@controllers/websites.controller';
import Route from '@/interfaces/route.interface';
import CreateWebsiteDto from '@dtos/website.dto';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';
import WebsiteChecker from '@/websiteChecker.class';

class WebsitesRoute implements Route {
  public path = '/websites';
  public router = Router();
  public websitesController;

  constructor(websiteChecker: WebsiteChecker) {
    this.websitesController = new WebsitesController(websiteChecker);
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.websitesController.getWebsites);
    this.router.get(`${this.path}/:id(\\d+)`, authMiddleware, this.websitesController.getWebsiteById);
    this.router.get(`${this.path}/q=:query`, authMiddleware, this.websitesController.searchWebsite);
    this.router.get(`${this.path}/:id(\\d+)/check`, authMiddleware, this.websitesController.checkWebsite);
    this.router.get(`${this.path}/:id(\\d+)/main_states`, authMiddleware, this.websitesController.getWebsiteMainStepStates);
    this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateWebsiteDto, 'body', true), this.websitesController.updateWebsite);
    this.router.post(`${this.path}/create`, [validationMiddleware(CreateWebsiteDto, 'body'), authMiddleware], this.websitesController.createWebsite);
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.websitesController.deleteWebsite);
  }
}

export default WebsitesRoute;
