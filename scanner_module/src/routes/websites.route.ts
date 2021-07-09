import { Router } from 'express';
import WebsitesController from '@controllers/websites.controller';
import Route from '@interfaces/routes.interface';

class WebsitesRoute implements Route {
  public path = '/websites';
  public router = Router();
  public websitesController = new WebsitesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.websitesController.getWebsites);
  }
}

export default WebsitesRoute;
