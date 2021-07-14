import { NextFunction, Request, Response } from 'express';
import { Website } from '@interfaces/websites.interface';
import websiteService from '@services/websites.service';

class WebsitesController {
  public websiteService = new websiteService();

  public getWebsites = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllWebsitesData: Website[] = await this.websiteService.findAllWebsites();

      res.status(200).json({ data: findAllWebsitesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public updateWebsite = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {}
  };
}

export default WebsitesController;
