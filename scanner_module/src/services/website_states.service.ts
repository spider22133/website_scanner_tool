import DB from '@databases';
import { WebsiteState } from '@/interfaces/website_state.interface';
import sequelize from 'sequelize';

class WebsiteStatesService {
  public website_states = DB.WebsiteStates;

  public async findAllStepStates(): Promise<WebsiteState[]> {
    return await this.website_states.findAll();
  }

  public async findAllStepErrorStates(): Promise<WebsiteState[]> {
    return await this.website_states.findAll({ where: { is_error: true } });
  }

  public async findStatesByStepId(stepId: number): Promise<WebsiteState[]> {
    return await this.website_states.findAll({ where: { step_id: stepId } });
  }

  public async findErrorStatesByStepId(stepId: number): Promise<WebsiteState[]> {
    return await this.website_states.findAll({ where: { step_id: stepId, is_error: true } });
  }

  public async findLatestStateByStepId(stepId: number): Promise<WebsiteState> {
    return await this.website_states.findOne({ limit: 1, where: { step_id: stepId }, order: [['createdAt', 'DESC']] });
  }

  public async createStepState(data: WebsiteState): Promise<WebsiteState> {
    return await this.website_states.create(data);
  }

  public async createStepErrorState(data: WebsiteState): Promise<WebsiteState> {
    return await this.website_states.create(data);
  }

  public async aggregatedByStepId(step_id: number): Promise<{ avg: number; min: number; max: number }> {
    const [{ avg, min, max }]: any = await this.website_states.findAll({
      where: { step_id },
      attributes: [
        [sequelize.fn('avg', sequelize.col('response_time')), 'avg'],
        [sequelize.fn('min', sequelize.col('response_time')), 'min'],
        [sequelize.fn('max', sequelize.col('response_time')), 'max'],
      ],
      raw: true,
    });
    return { avg, min, max };
  }
}

export default WebsiteStatesService;
