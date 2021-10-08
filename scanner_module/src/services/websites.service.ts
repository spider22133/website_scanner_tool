import DB from '@databases';
import { Website } from '@/interfaces/website.interface';
import CreateWebsiteDto from '@dtos/website.dto';
import { isEmpty } from '@/utils/util';
import HttpException from '@/exceptions/HttpException';
import { WebsiteModel } from '@/models/website.model';
import WebsiteChecker from 'websiteChecker';

class WebsiteService {
  public websites = DB.Websites;

  public async findAllWebsites(): Promise<Website[]> {
    const allWebsites: Website[] = await this.websites.findAll();
    return allWebsites;
  }

  public async findWebsiteById(websiteId: number): Promise<Website> {
    if (isEmpty(websiteId)) throw new HttpException(400, 'Id is wrong');

    const findWebsite: Website = await this.websites.findByPk(websiteId);

    if (!findWebsite) throw new HttpException(409, "Website doesn't exist");

    return findWebsite;
  }

  public async updateWebsite(id: number, data: CreateWebsiteDto): Promise<Website> {
    // const findWebsite: Website = await this.websites.findByPk(id);
    // TODO: error if no website exists with id

    await this.websites.update({ ...data }, { where: { id: id } });

    // await WebsiteChecker.checkWebsites();

    const updatedWebsite: Website = await this.websites.findByPk(id);
    return updatedWebsite;
  }

  public async createWebsite(websiteData: CreateWebsiteDto): Promise<Website> {
    if (isEmpty(websiteData)) throw new HttpException(400, 'Website data is empty');

    const findWebsite: Website = await this.websites.findOne({ where: { url: websiteData.url } });
    if (findWebsite) throw new HttpException(409, `Url ${websiteData.url} already exists`);

    // await WebsiteChecker.checkWebsites();

    const createWebsiteData: Website = await this.websites.create({ ...websiteData });
    return createWebsiteData;
  }

  public async deleteWebsite(websiteId: number): Promise<Website> {
    if (isEmpty(websiteId)) throw new HttpException(400, "You're not websiteId");

    const findWebsite: WebsiteModel = await this.websites.findByPk(websiteId);
    if (!findWebsite) throw new HttpException(409, "You're not website");

    await this.websites.destroy({ where: { id: websiteId } });

    return findWebsite;
  }
}

export default WebsiteService;
