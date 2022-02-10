import { NextFunction, Request, Response } from 'express';
import { WebsiteState } from '@/interfaces/website_state.interface';
import WebsiteStatesService from '@services/website_states.service';
import WebsiteChecker from '@/websiteChecker.class';

class WebsiteStatesController {
  public websiteStatesService = new WebsiteStatesService();

  public getWebsiteStates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllStatesData: WebsiteState[] = await this.websiteStatesService.findAllWebsiteStates();
      res.status(200).json({ data: findAllStatesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getWebsiteErrorStates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllStatesData: WebsiteState[] = await this.websiteStatesService.findAllWebsiteErrorStates();
      res.status(200).json({ data: findAllStatesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getLatestStateByWebsiteId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = Number(req.params.id);
      const latestStateByWebsiteId: WebsiteState = await this.websiteStatesService.findLatestStateByWebsiteId(websiteId);

      res.status(200).json({ data: latestStateByWebsiteId, message: 'findLatestStateByWebsiteId' });
    } catch (error) {
      next(error);
    }
  };

  public getWebsiteStatesByWebsiteId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = Number(req.params.id);
      const findAllStatesData: WebsiteState[] = await this.websiteStatesService.findStatesByWebsiteId(websiteId);

      res.status(200).json({ data: findAllStatesData, message: 'findStatesByWebsiteId' });
    } catch (error) {
      next(error);
    }
  };

  public getWebsiteErrorStatesByWebsiteId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = Number(req.params.id);
      const findAllStatesData: WebsiteState[] = await this.websiteStatesService.findErrorStatesByWebsiteId(websiteId);

      res.status(200).json({ data: findAllStatesData, message: 'findStatesByWebsiteId' });
    } catch (error) {
      next(error);
    }
  };

  public getAggregatedDataByWebsiteId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = Number(req.params.id);
      const getAggregatedData: any = await this.websiteStatesService.aggregatedByWebsiteId(websiteId);

      res.status(200).json({ data: getAggregatedData, message: 'findStatesByWebsiteId' });
    } catch (error) {
      next(error);
    }
  };
}

export default WebsiteStatesController;
