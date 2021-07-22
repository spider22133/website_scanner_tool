import { Router } from 'express';
import WebsiteStatesController from '@controllers/website_states.controller';
import Route from '@interfaces/routes.interface';

class WebsiteStatesRoute implements Route {
  public path = '/website-states';
  public router = Router();
  public websiteStatesController = new WebsiteStatesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.websiteStatesController.getWebsiteStates);
    this.router.get(`${this.path}/website/:id(\\d+)`, this.websiteStatesController.getWebsiteStatesByWebsiteId);
  }
}

export default WebsiteStatesRoute;
