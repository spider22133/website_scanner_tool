import websiteService from '@services/websites.service';
import { Website } from '@interfaces/websites.interface';
import fetch from 'node-fetch';

class WebsiteChecker {
  public websiteService = new websiteService();

  public async checkWebsites() {
    try {
      const findAllWebsitesData: Website[] = await this.websiteService.findAllWebsites();

      findAllWebsitesData.forEach(item => {
        fetch(item['url']).then(res => {
          console.log(res.status);
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  //   public checkWebsiteStatus(url: string): number {
  //     return fetch(url).then(res => res.status);
  //   }
}

export default WebsiteChecker;
