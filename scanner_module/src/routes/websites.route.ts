import { Router } from 'express';
import WebsitesController from '@controllers/websites.controller';
import Route from '@interfaces/routes.interface';
import { CreateWebsiteDto } from '@dtos/website.dto';
import validationMiddleware from '@middlewares/validation.middleware';

class WebsitesRoute implements Route {
  public path = '/websites';
  public router = Router();
  public websitesController = new WebsitesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.websitesController.getWebsites);
    this.router.put(`${this.path}/:id(\\d+)`, validationMiddleware(CreateWebsiteDto, 'body', true), this.websitesController.updateWebsite);
  }
}

export default WebsitesRoute;
