import websiteService from '@services/websites.service';
import websiteStatesService from '@services/website_states.service';
import { Website } from '@/interfaces/website.interface';
import fetch from 'node-fetch';

const HTTP_CODE_404 = 404;
const HTTP_CODE_200 = 200;

class WebsiteChecker {
  public websiteService = new websiteService();
  public websiteStatesService = new websiteStatesService();

  public async checkWebsites(): Promise<void> {
    try {
      const findAllWebsitesData: Website[] = await this.websiteService.findAllWebsites();

      for (const website of findAllWebsitesData) {
        this.checkWebsite(website);
      }
    } catch (error) {
      console.log(error);
    }
  }
  public async checkWebsite(website: Website): Promise<void> {
    try {
      const start = new Date().getTime();
      const status = await this.checkWebsiteStatus(website.url);
      const end = new Date().getTime() - start;

      if (status == HTTP_CODE_200) {
        await this.updateData(website, end, status, true);
        return;
      }
      await this.updateData(website, end, status, false);
    } catch (error) {
      if (error.code === 'ENOTFOUND') {
        await this.updateData(website, 0, HTTP_CODE_404, false);
      }
      console.log(error);
    }
  }

  private async updateData(website: Website, end: number, status: number, is_active: boolean) {
    await this.websiteService.updateWebsite(website.id, { name: website.name, url: website.url, is_active });
    await this.websiteStatesService.createWebsiteState(website.id, end, status);
  }

  private checkWebsiteStatus(url: string): Promise<number> {
    return fetch(url).then(res => res.status);
  }
}

export default WebsiteChecker;
