import websiteService from '@services/websites.service';
import { Website } from '@interfaces/websites.interface';
import fetch from 'node-fetch';
import { CreateWebsiteDto } from '@dtos/website.dto';

class WebsiteChecker {
  public websiteService = new websiteService();

  public async checkWebsites() {
    try {
      const findAllWebsitesData: Website[] = await this.websiteService.findAllWebsites();

      for (const data of findAllWebsitesData) {
        const status = await this.checkWebsiteStatus(data.url);
        const dataToUpdate: CreateWebsiteDto = { name: data.name, url: data.url, is_active: true };

        if (status === 200) {
          await this.websiteService.updateWebsite(data.id, dataToUpdate);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  public checkWebsiteStatus(url: string): Promise<number> {
    return fetch(url).then(res => res.status);
  }
}

export default WebsiteChecker;
