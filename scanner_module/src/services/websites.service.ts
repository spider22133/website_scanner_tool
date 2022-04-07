import DB from '@databases';
import { Website } from '@/interfaces/website.interface';
import CreateWebsiteDto from '@dtos/website.dto';
import { isEmpty } from '@/utils/util';
import HttpException from '@/exceptions/HttpException';
import { WebsiteModel } from '@/models/website.model';
import { Op } from 'sequelize';

class WebsiteService {
  public websites = DB.Websites;

  public async findAllWebsites(): Promise<WebsiteModel[]> {
    return await this.websites.findAll();
  }

  public async findWebsiteById(websiteId: number): Promise<WebsiteModel> {
    if (isEmpty(websiteId)) throw new HttpException(400, 'Id is wrong');

    const findWebsite: WebsiteModel = await this.websites.findByPk(websiteId);

    if (!findWebsite) throw new HttpException(409, "Website doesn't exist");

    return findWebsite;
  }

  public async updateWebsite(id: number, data: CreateWebsiteDto): Promise<Website> {
    const findWebsite: Website = await this.websites.findByPk(id);
    if (!findWebsite) throw new HttpException(409, 'There is no website with such id');

    await this.websites.update(data, { where: { id: id } });

    return await this.websites.findByPk(id);
  }

  public async createWebsite(websiteData: CreateWebsiteDto): Promise<Website> {
    if (isEmpty(websiteData)) throw new HttpException(400, 'Website data is empty');

    const findWebsite: Website = await this.websites.findOne({ where: { url: websiteData.url } });
    if (findWebsite) throw new HttpException(409, `Url ${websiteData.url} already exists`);

    const website = await this.websites.create(websiteData);
    await website.createStep({ path: website.url, title: 'MAIN' });

    return website;
  }

  public async deleteWebsite(websiteId: number): Promise<Website> {
    if (isEmpty(websiteId)) throw new HttpException(400, "This isn't websiteId");

    const findWebsite: WebsiteModel = await this.websites.findByPk(websiteId);
    if (!findWebsite) throw new HttpException(409, "You're not website");

    await this.websites.destroy({ where: { id: websiteId } });

    return findWebsite;
  }
  public async searchQuery(data: string): Promise<Website[]> {
    return await this.websites.findAll({
      where: {
        [Op.or]: [{ name: { [Op.like]: `%${data}%` } }, { url: { [Op.like]: `%${data}%` } }],
      },
    });
  }
}

export default WebsiteService;
