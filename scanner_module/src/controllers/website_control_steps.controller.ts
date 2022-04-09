import { NextFunction, Request, Response } from 'express';
import { WebsiteControlStep } from '@interfaces/website_control_step.interface';
import WebsiteControlStepsService from '@services/website_control_steps.service';
import CreateWebsiteControlStepDto from '@dtos/step.dto';

class WebsiteControlStepsController {
  public websiteControlStepsService = new WebsiteControlStepsService();

  public getWebsiteControlSteps = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllControlStepsData: WebsiteControlStep[] = await this.websiteControlStepsService.findAllWebsiteControlSteps();
      res.status(200).json({ data: findAllControlStepsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getWebsiteControlStepsByWebsiteId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = Number(req.params.id);
      const findAllControlStepsData: WebsiteControlStep[] = await this.websiteControlStepsService.findControlStepsByWebsiteId(websiteId);

      res.status(200).json({ data: findAllControlStepsData, message: 'findControlStepsByWebsiteId' });
    } catch (error) {
      next(error);
    }
  };

  public createWebsiteControlStep = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stepData: CreateWebsiteControlStepDto = req.body;

      const createWebsiteControlStepData = await this.websiteControlStepsService.createWebsiteControlStep({ ...stepData });
      res.status(201).json({ data: createWebsiteControlStepData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateWebsiteControlStep = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.body);
      const stepId = Number(req.params.id);
      const stepData: CreateWebsiteControlStepDto = req.body;

      const updateWebsiteControlStepData = await this.websiteControlStepsService.updateWebsiteControlStep(stepId, { ...stepData });
      res.status(200).json({ data: updateWebsiteControlStepData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteWebsiteControlStep = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stepId = Number(req.params.id);
      const deleteWebsiteControlStep: WebsiteControlStep = await this.websiteControlStepsService.deleteWebsiteControlStep(stepId);

      res.status(200).json({ data: deleteWebsiteControlStep, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default WebsiteControlStepsController;
