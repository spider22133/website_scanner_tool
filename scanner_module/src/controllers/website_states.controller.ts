import { NextFunction, Request, Response } from 'express';
import { WebsiteState } from '@interfaces/website_states.interface';
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

  // public createWebsiteState = async (website_id: number, answer_time: number, answer_code: number) => {
  //   try {
  //     const createWebsiteStateData: WebsiteState = await this.websiteStatesService.createWebsiteState(website_id, answer_time, answer_code);
  //     console.log(createWebsiteStateData.id);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
}

export default WebsiteStatesController;
