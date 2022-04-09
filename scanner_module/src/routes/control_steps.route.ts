import { Router } from 'express';
import WebsiteControlStepsController from '@controllers/website_control_steps.controller';
import Route from '@/interfaces/route.interface';
import authMiddleware from '@/middlewares/auth.middleware';
import validationMiddleware from '@middlewares/validation.middleware';
import CreateWebsiteControlStepDto from '@dtos/step.dto';

class WebsiteControlStepsRoute implements Route {
  public path = '/website-control-steps';
  public router = Router();
  public websiteControlStepsController = new WebsiteControlStepsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/`, authMiddleware, this.websiteControlStepsController.getWebsiteControlSteps);
    this.router.get(`${this.path}/:id(\\d+)`, authMiddleware, this.websiteControlStepsController.getWebsiteControlStepsByWebsiteId);
    this.router.put(`${this.path}/:id(\\d+)`, this.websiteControlStepsController.updateWebsiteControlStep);
    this.router.post(
      `${this.path}/create`,
      [validationMiddleware(CreateWebsiteControlStepDto, 'body'), authMiddleware],
      this.websiteControlStepsController.createWebsiteControlStep,
    );
    this.router.delete(`${this.path}/:id(\\d+)`, authMiddleware, this.websiteControlStepsController.deleteWebsiteControlStep);
  }
}

export default WebsiteControlStepsRoute;
