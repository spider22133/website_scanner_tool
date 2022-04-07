import DB from '@databases';
import { WebsiteControlStep } from '@interfaces/website_control_step.interface';
import { isEmpty } from '@utils/util';
import HttpException from '@exceptions/HttpException';
import CreateWebsiteControlStepDto from '@dtos/step.dto';

class WebsiteControlStepService {
  public website_control_steps = DB.WebsiteControlSteps;

  public async findAllWebsiteControlSteps(): Promise<WebsiteControlStep[]> {
    return await this.website_control_steps.findAll();
  }

  public async findControlStepsByWebsiteId(websiteId: number): Promise<WebsiteControlStep[]> {
    return await this.website_control_steps.findAll({ where: { website_id: websiteId } });
  }

  public async createWebsiteControlStep(data: CreateWebsiteControlStepDto): Promise<WebsiteControlStep> {
    return await this.website_control_steps.create(data);
  }

  public async updateWebsiteControlStep(id: number, data: CreateWebsiteControlStepDto): Promise<WebsiteControlStep> {
    const findWebsiteControlStep: WebsiteControlStep = await this.website_control_steps.findByPk(id);
    if (!findWebsiteControlStep) throw new HttpException(409, 'There is no step with such id');

    await this.website_control_steps.update(data, { where: { id: id } });

    return await this.website_control_steps.findByPk(id);
  }

  public async deleteWebsiteControlStep(websiteId: number): Promise<WebsiteControlStep> {
    if (isEmpty(websiteId)) throw new HttpException(400, "This isn't stepId");

    const findWebsiteControlStep: WebsiteControlStep = await this.website_control_steps.findByPk(websiteId);
    if (!findWebsiteControlStep) throw new HttpException(409, 'There is no step with such id');

    await this.website_control_steps.destroy({ where: { id: websiteId } });

    return findWebsiteControlStep;
  }
}

export default WebsiteControlStepService;
