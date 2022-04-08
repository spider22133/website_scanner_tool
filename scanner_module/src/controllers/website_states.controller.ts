import { NextFunction, Request, Response } from 'express';
import { WebsiteState } from '@/interfaces/website_state.interface';
import WebsiteStatesService from '@services/website_states.service';
import WebsiteControlStepsService from '@services/website_control_steps.service';

class WebsiteStatesController {
  public websiteStatesService = new WebsiteStatesService();
  public websiteControlStepsService = new WebsiteControlStepsService();
  public getStepStates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllStatesData: WebsiteState[] = await this.websiteStatesService.findAllStepStates();
      res.status(200).json({ data: findAllStatesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getStepErrorStates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllStatesData: WebsiteState[] = await this.websiteStatesService.findAllStepErrorStates();
      res.status(200).json({ data: findAllStatesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getLatestStateByStepId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = Number(req.params.id);
      const steps = await this.websiteControlStepsService.findControlStepsByWebsiteId(websiteId);
      const mainStep = steps.find(step => step.type === 'MAIN');
      const latestStateByWebsiteId: WebsiteState = await this.websiteStatesService.findLatestStateByStepId(mainStep.id);

      res.status(200).json({ data: latestStateByWebsiteId, message: 'findLatestStateByWebsiteId' });
    } catch (error) {
      next(error);
    }
  };

  public getStepStatesByStepId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stepId = Number(req.params.id);
      const findAllStatesData: WebsiteState[] = await this.websiteStatesService.findStatesByStepId(stepId);

      res.status(200).json({ data: findAllStatesData, message: 'findStatesByWebsiteId' });
    } catch (error) {
      next(error);
    }
  };

  public getStepErrorStatesByStepId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stepId = Number(req.params.id);
      const findAllStatesData: WebsiteState[] = await this.websiteStatesService.findErrorStatesByStepId(stepId);

      res.status(200).json({ data: findAllStatesData, message: 'findStatesByWebsiteId' });
    } catch (error) {
      next(error);
    }
  };

  public getAggregatedDataByStepId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stepId = Number(req.params.id);
      const getAggregatedData: any = await this.websiteStatesService.aggregatedByStepId(stepId);

      res.status(200).json({ data: getAggregatedData, message: 'findStatesByWebsiteId' });
    } catch (error) {
      next(error);
    }
  };
}

export default WebsiteStatesController;
