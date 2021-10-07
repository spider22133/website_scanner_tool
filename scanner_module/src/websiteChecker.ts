import websiteService from '@services/websites.service';
import websiteStatesService from '@services/website_states.service';
import { Website } from '@/interfaces/website.interface';
import fetch from 'node-fetch';
import CreateWebsiteDto from '@dtos/website.dto';

class WebsiteChecker {
  public websiteService = new websiteService();
  public websiteStatesService = new websiteStatesService();

  public async checkWebsites(): Promise<void> {
    try {
      const findAllWebsitesData: Website[] = await this.websiteService.findAllWebsites();

      for (const website of findAllWebsitesData) {
        const start = new Date().getTime();
        const status = await this.checkWebsiteStatus(website.url);
        const end = new Date().getTime() - start;
        const websiteToUpdate: CreateWebsiteDto = { name: website.name, url: website.url, is_active: true };

        if (status === 200) {
          await this.websiteService.updateWebsite(website.id, websiteToUpdate);
          await this.websiteStatesService.createWebsiteState(website.id, end, status);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  private checkWebsiteStatus(url: string): Promise<number> {
    return fetch(url).then(res => res.status);
  }
}

export default WebsiteChecker;
