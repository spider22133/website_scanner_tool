import DB from '@databases';
import { Website } from '@interfaces/websites.interface';
import CreateWebsiteDto from '@dtos/website.dto';
import { isEmpty } from '@/utils/util';
import HttpException from '@/exceptions/HttpException';

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

    const updatedWebsite: Website = await this.websites.findByPk(id);
    return updatedWebsite;
  }

  public async createWebsite(websiteData: CreateWebsiteDto): Promise<Website> {
    if (isEmpty(websiteData)) throw new HttpException(400, 'Website data is empty');

    const findWebsite: Website = await this.websites.findOne({ where: { url: websiteData.url } });
    if (findWebsite) throw new HttpException(409, `Url ${websiteData.url} already exists`);

    const createWebsiteData: Website = await this.websites.create({ ...websiteData });
    return createWebsiteData;
  }
}

public async deleteWebsite(userId: number): Promise<User> {
  if (isEmpty(userId)) throw new HttpException(400, "You're not userId");

  const findUser: User = await this.users.findByPk(userId);
  if (!findUser) throw new HttpException(409, "You're not user");

  await this.users.destroy({ where: { id: userId } });

  return findUser;
}

export default WebsiteService;
