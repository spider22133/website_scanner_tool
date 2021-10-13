import DB from '@databases';
import { WebsiteError } from '@/interfaces/website_error.interface';

class WebsiteErrorService {
  public website_errors = DB.WebsiteErrors;

  public async findAllWebsiteErrors(): Promise<WebsiteError[]> {
    const allWebsiteErrors: WebsiteError[] = await this.website_errors.findAll();
    return allWebsiteErrors;
  }

  public async findErrorsByWebsiteId(websiteId: number): Promise<WebsiteError[]> {
    const findErrors: WebsiteError[] = await this.website_errors.findAll({ where: { website_id: websiteId } });
    return findErrors;
  }
}

export default WebsiteErrorService;
