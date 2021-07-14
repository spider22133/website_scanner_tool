import DB from '@databases';
import { Website } from '@interfaces/websites.interface';
import { CreateWebsiteDto } from '@dtos/website.dto';

class WebsiteService {
  public websites = DB.Websites;

  public async findAllWebsites(): Promise<Website[]> {
    const allWebsites: Website[] = await this.websites.findAll();
    return allWebsites;
  }

  public async updateWebsite(id: number, data: CreateWebsiteDto): Promise<Website> {
    // const findWebsite: Website = await this.websites.findByPk(id);
    // TODO: error if no website exists with id

    await this.websites.update({ ...data }, { where: { id: id } });

    const updatedWebsite: Website = await this.websites.findByPk(id);
    return updatedWebsite;
  }
}

export default WebsiteService;
