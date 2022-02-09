import DB from '@databases';
import { WebsiteState } from '@/interfaces/website_state.interface';
import sequelize from 'sequelize';

class WebsiteStatesService {
  public website_states = DB.WebsiteStates;

  public async findAllWebsiteStates(): Promise<WebsiteState[]> {
    return await this.website_states.findAll();
  }

  public async findAllWebsiteErrorStates(): Promise<WebsiteState[]> {
    return await this.website_states.findAll({ where: { is_error: true } });
  }

  public async findStatesByWebsiteId(websiteId: number): Promise<WebsiteState[]> {
    return await this.website_states.findAll({ where: { website_id: websiteId } });
  }

  public async findErrorStatesByWebsiteId(websiteId: number): Promise<WebsiteState[]> {
    return await this.website_states.findAll({ where: { website_id: websiteId, is_error: true } });
  }

  public async findLatestStateByWebsiteId(websiteId: number): Promise<WebsiteState> {
    return await this.website_states.findOne({ limit: 1, where: { website_id: websiteId }, order: [['createdAt', 'DESC']] });
  }

  public async createWebsiteState(data: WebsiteState): Promise<WebsiteState> {
    return await this.website_states.create(data);
  }

  public async createWebsiteErrorState(data: WebsiteState): Promise<WebsiteState> {
    return await this.website_states.create(data);
  }

  public async aggregatedByWebsiteId(website_id: number): Promise<{ avg: number; min: number; max: number }> {
    const [{ avg, min, max }]: any = await this.website_states.findAll({
      where: { website_id },
      attributes: [
        [sequelize.fn('avg', sequelize.col('answer_time')), 'avg'],
        [sequelize.fn('min', sequelize.col('answer_time')), 'min'],
        [sequelize.fn('max', sequelize.col('answer_time')), 'max'],
      ],
      raw: true,
    });
    return { avg, min, max };
  }
}

export default WebsiteStatesService;
