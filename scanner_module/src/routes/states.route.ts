import { Router } from 'express';
import WebsiteStatesController from '@controllers/website_states.controller';
import Route from '@/interfaces/route.interface';
import authMiddleware from '@/middlewares/auth.middleware';

class WebsiteStatesRoute implements Route {
  public path = '/website-states';
  public router = Router();
  public websiteStatesController = new WebsiteStatesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, authMiddleware, this.websiteStatesController.getStepStates);
    this.router.get(`${this.path}/errors`, authMiddleware, this.websiteStatesController.getStepErrorStates);
    this.router.get(`${this.path}/step/:id(\\d+)`, authMiddleware, this.websiteStatesController.getStepStatesByStepId);
    this.router.get(`${this.path}/step/:id(\\d+)/errors`, authMiddleware, this.websiteStatesController.getStepErrorStatesByStepId);
    this.router.get(`${this.path}/step/:id(\\d+)/latest`, authMiddleware, this.websiteStatesController.getLatestStateByStepId);
    this.router.get(`${this.path}/step/:id(\\d+)/aggregate`, authMiddleware, this.websiteStatesController.getAggregatedDataByStepId);
  }
}

export default WebsiteStatesRoute;
