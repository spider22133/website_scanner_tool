import { Router } from 'express';
import WebsiteErrorsController from '@controllers/website_errors.controller';
import Route from '@/interfaces/route.interface';
import authMiddleware from '@/middlewares/auth.middleware';

class WebsiteErrorsRoute implements Route {
  public path = '/website';
  public router = Router();
  public websiteErrorsController = new WebsiteErrorsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:id(\\d+)/errors`, authMiddleware, this.websiteErrorsController.getWebsiteErrorsByWebsiteId);
  }
}

export default WebsiteErrorsRoute;
