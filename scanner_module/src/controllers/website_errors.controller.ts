import { NextFunction, Request, Response } from 'express';
import { WebsiteError } from '@/interfaces/website_error.interface';
import websiteErrorsService from '@services/website_error.service';

class WebsiteErrorsController {
  public websiteErrorsService = new websiteErrorsService();

  public getWebsiteErrors = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllErrorsData: WebsiteError[] = await this.websiteErrorsService.findAllWebsiteErrors();
      res.status(200).json({ data: findAllErrorsData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getWebsiteErrorsByWebsiteId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = Number(req.params.id);
      const findAllErrorsData: WebsiteError[] = await this.websiteErrorsService.findErrorsByWebsiteId(websiteId);

      res.status(200).json({ data: findAllErrorsData, message: 'findErrorsByWebsiteId' });
    } catch (error) {
      next(error);
    }
  };
}

export default WebsiteErrorsController;
