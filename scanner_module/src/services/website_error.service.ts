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

  public async createWebsiteError(website_id: number, answer_code: number, answer_text: string): Promise<WebsiteError> {
    const createUserData: WebsiteError = await this.website_errors.create({ website_id, answer_code, answer_text });
    return createUserData;
  }
}

export default WebsiteErrorService;
