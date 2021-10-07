import { NextFunction, Request, Response } from 'express';
import { Website } from '@/interfaces/website.interface';
import websiteService from '@services/websites.service';
import CreateWebsiteDto from '@dtos/website.dto';

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

  public getWebsiteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = Number(req.params.id);
      const findOne: Website = await this.websiteService.findWebsiteById(websiteId);

      res.status(200).json({ data: findOne, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public updateWebsite = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = Number(req.params.id);
      const websiteData: CreateWebsiteDto = req.body;
      const updateWebsiteData: Website = await this.websiteService.updateWebsite(websiteId, websiteData);

      res.status(200).json({ data: updateWebsiteData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public createWebsite = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteData: CreateWebsiteDto = req.body;
      const createWebsiteData: Website = await this.websiteService.createWebsite(websiteData);

      res.status(201).json({ data: createWebsiteData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public deleteWebsite = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = Number(req.params.id);
      const deleteWebsiteData: Website = await this.websiteService.deleteWebsite(websiteId);

      res.status(200).json({ data: deleteWebsiteData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default WebsitesController;
