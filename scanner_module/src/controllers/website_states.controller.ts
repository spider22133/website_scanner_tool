import { NextFunction, Request, Response } from 'express';
import { WebsiteState } from '@/interfaces/website_state.interface';
import websiteStatesService from '@services/website_states.service';

class WebsiteStatesController {
  public websiteStatesService = new websiteStatesService();

  public getWebsiteStates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllStatesData: WebsiteState[] = await this.websiteStatesService.findAllWebsiteStates();
      res.status(200).json({ data: findAllStatesData, message: 'findAll' });
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
}

export default WebsiteStatesController;
