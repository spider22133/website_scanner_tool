import websiteService from '@services/websites.service';
import websiteStatesService from '@services/website_states.service';
import websiteErrorService from '@services/website_error.service';
import { Website } from '@/interfaces/website.interface';
import fetch from 'node-fetch';

const HTTP_CODE_404 = 404;
const HTTP_CODE_200 = 200;

class WebsiteChecker {
  public websiteService = new websiteService();
  public websiteStatesService = new websiteStatesService();
  public websiteErrorService = new websiteErrorService();

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
  public async checkUrl(url: string) {
    try {
      const { status, msg } = await this.checkWebsiteStatus(url);

      return { status, msg };
    } catch (error) {}
  }

  public async checkWebsite(website: Website): Promise<void> {
    try {
      const start = new Date().getTime();
      const { status, msg } = await this.checkWebsiteStatus(website.url);
      const end = new Date().getTime() - start;

      if (status == HTTP_CODE_200) {
        return await this.sendStatus(website, end, status);
      }
      await this.sendError(website, status, msg);
    } catch (error) {
      switch (error.code) {
        case 'ENOTFOUND':
          await this.sendError(website, HTTP_CODE_404, error.message);
          break;

        default:
          await this.sendError(website, error.code, error.message);
          break;
      }
    }
  }

  private async sendStatus(website: Website, end: number, status: number) {
    await this.websiteService.updateWebsite(website.id, { ...website, is_active: true });
    await this.websiteStatesService.createWebsiteState(website.id, end, status);
  }

  private async sendError(website: Website, status: number, msg = '') {
    await this.websiteService.updateWebsite(website.id, { ...website, is_active: false });
    await this.websiteErrorService.createWebsiteError(website.id, status, msg);
  }

  private checkWebsiteStatus(url: string): Promise<{ status: number; msg: string }> {
    return fetch(url).then(res => ({ status: res.status, msg: res.statusText }));
  }
}

export default WebsiteChecker;
