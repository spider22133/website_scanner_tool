import { Router } from 'express';
import WebsiteStatesController from '@controllers/website_states.controller';
import Route from '@interfaces/routes.interface';
import { CreateWebsiteDto } from '@dtos/website.dto';
import validationMiddleware from '@middlewares/validation.middleware';

class WebsiteStatesRoute implements Route {
  public path = '/website-states';
  public router = Router();
  public websiteStatesController = new WebsiteStatesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.websiteStatesController.getWebsiteStates);
  }
}

export default WebsiteStatesRoute;