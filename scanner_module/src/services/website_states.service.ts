import DB from '@databases';
import HttpException from '@exceptions/HttpException';
import { WebsiteState } from '@/interfaces/website_state.interface';

class WebsiteStatesService {
  public website_states = DB.WebsiteStates;

  public async findAllWebsiteStates(): Promise<WebsiteState[]> {
    const allWebsiteStates: WebsiteState[] = await this.website_states.findAll();
    return allWebsiteStates;
  }

  public async findStatesByWebsiteId(websiteId: number): Promise<WebsiteState[]> {
    const findStates: WebsiteState[] = await this.website_states.findAll({ where: { website_id: websiteId } });
    return findStates;
  }

  public async createWebsiteState(website_id: number, answer_time: number, answer_code: number): Promise<WebsiteState> {
    const createUserData: WebsiteState = await this.website_states.create({ website_id, answer_time, answer_code });
    return createUserData;
  }
}

export default WebsiteStatesService;
