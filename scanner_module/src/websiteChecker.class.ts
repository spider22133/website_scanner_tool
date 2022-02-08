import WebsiteService from '@services/websites.service';
import WebsiteStatesService from '@services/website_states.service';
import WebsiteErrorService from '@services/website_error.service';
import { Website } from '@/interfaces/website.interface';
import fetch from 'node-fetch';
import mailer from '@utils/mailer';
import { Socket } from 'socket.io';

const HTTP_CODE_404 = 404;
const HTTP_CODE_200 = 200;

class WebsiteChecker {
  public websiteService = new WebsiteService();
  public websiteStatesService = new WebsiteStatesService();
  public websiteErrorService = new WebsiteErrorService();
  public socket: Socket;

  public connectSocket = (socket: Socket) => {
    this.socket = socket;
  };

  public async checkWebsites(): Promise<void> {
    try {
      const findAllWebsitesData: Website[] = await this.websiteService.findAllWebsites();
      for (const website of findAllWebsitesData) {
        await this.checkWebsite(website);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async checkWebsite(website: Website): Promise<void> {
    try {
      const start = new Date().getTime();
      const { status } = await WebsiteChecker.checkWebsiteStatus(website.url);
      const end = new Date().getTime() - start;

      if (status == HTTP_CODE_200) {
        return await this.sendStatus(website, end, status);
      }
    } catch (error) {
      await this.sendError(website, error.code, error.message);
    }
  }

  public async checkUrl(url: string) {
    return await WebsiteChecker.checkWebsiteStatus(url);
  }

  private async sendStatus(website: Website, end: number, status: number) {
    const web = await this.websiteService.updateWebsite(website.id, { ...website, is_active: true });
    await this.websiteStatesService.createWebsiteState(website.id, end, status);

    // Client should update websites state
    if (web.is_active === true && website.is_active === false) this.socket.emit('updateWebsites', 'changed');
  }

  private async sendError(website: Website, status: number, msg = '') {
    await this.websiteService.updateWebsite(website.id, { ...website, is_active: false });
    await this.websiteErrorService.createWebsiteError(website.id, status, msg);

    // Client should update websites state
    this.socket.emit('updateWebsites', 'changed');

    //Send mail
    mailer(website, status, msg).catch(console.error);
  }

  private static checkWebsiteStatus(url: string): Promise<{ status: number; msg: string }> {
    return fetch(url).then(res => ({ status: res.status, msg: res.statusText }));
  }
}

export default WebsiteChecker;
