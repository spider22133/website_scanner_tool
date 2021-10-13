import DB from '@databases';
import HttpException from '@exceptions/HttpException';
import { WebsiteState } from '@/interfaces/website_state.interface';
import sequelize from 'sequelize';

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
