import DB from '@databases';
import { Website } from '@interfaces/websites.interface';

class WebsiteService {
  public websites = DB.Websites;

  public async findAllWebsites(): Promise<Website[]> {
    const allWebsites: Website[] = await this.websites.findAll();
    return allWebsites;
  }
}

export default WebsiteService;
