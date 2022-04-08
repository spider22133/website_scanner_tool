import WebsiteService from '@services/websites.service';
import WebsiteStatesService from '@services/website_states.service';
import WebsiteErrorService from '@services/website_control_steps.service';
import fetch from 'node-fetch';
import mailer from '@utils/mailer';
import { Socket } from 'socket.io';
import { WebsiteModel } from '@models/website.model';
import { WebsiteControlStep } from '@interfaces/website_control_step.interface';
import WebsiteControlStepService from '@services/website_control_steps.service';
import { WebsiteControlStepModel } from '@models/website_control_step.model';

const HTTP_CODE_404 = 404;
const HTTP_CODE_200 = 200;

class WebsiteChecker {
  public websiteService = new WebsiteService();
  public websiteControlStepService = new WebsiteControlStepService();
  public websiteStatesService = new WebsiteStatesService();
  public websiteErrorService = new WebsiteErrorService();
  public _socket: Socket;

  public connectSocket = (socket: Socket) => {
    this._socket = socket;
  };

  public async checkWebsites(): Promise<void> {
    try {
      const findAllWebsitesData: WebsiteModel[] = await this.websiteService.findAllWebsites();
      for (const website of findAllWebsitesData) {
        await this.checkWebsite(website);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async checkWebsite(website: WebsiteModel) {
    const controlSteps: WebsiteControlStepModel[] = await website.getSteps();

    for (const step of controlSteps) {
      try {
        const start = new Date().getTime();
        switch (step.type) {
          case 'MAIN':
            const { status, msg } = await WebsiteChecker.checkWebsiteStatus(step.path);
            await this.updateStatus(status, start, step, msg);
            break;
          case 'API_CALL':
            console.log('API_CALL');
            break;
          case 'LOGIN_CALL':
            const { login_status, login_msg } = await WebsiteChecker.checkLoginCall(step);
            await this.updateStatus(login_status, start, step, login_msg);
            break;
        }
      } catch (error) {
        await this.sendError(step, error.code, error.message);
      }
    }
    // Check if their any unsuccessfully requests
    const controlStepsUpdated: WebsiteControlStepModel[] = await website.getSteps();
    const hasErrors = controlStepsUpdated.find(item => item.estimated_code === HTTP_CODE_404);

    if (hasErrors) {
      await this.websiteService.updateWebsite(website.id, { ...website, is_active: false });
    } else {
      await this.websiteService.updateWebsite(website.id, { ...website, is_active: true });
    }

    this._socket.emit('updateWebsites', 'changed');
  }

  private async updateStatus(status: number, start: number, step: WebsiteControlStepModel, msg: string) {
    if (status == HTTP_CODE_200) {
      const end = new Date().getTime() - start;
      await this.sendStatus(step, end, status);
    } else {
      await this.sendError(step, status, msg);
    }
  }

  public async checkUrl(url: string) {
    return await WebsiteChecker.checkWebsiteStatus(url);
  }

  private async sendStatus(step: WebsiteControlStepModel, end: number, status: number) {
    await this.websiteControlStepService.updateWebsiteControlStep(step.id, { ...step, estimated_code: HTTP_CODE_200 });
    await this.websiteStatesService.createStepState({ step_id: step.id, response_time: end, response_code: status });
  }

  private async sendError(step: WebsiteControlStep, status: number, msg = '') {
    await this.websiteControlStepService.updateWebsiteControlStep(step.id, { ...step, estimated_code: HTTP_CODE_404 });
    await this.websiteStatesService.createStepErrorState({ step_id: step.id, response_code: status, response_text: msg, is_error: true });

    //Send mail
    //mailer(website, status, msg).catch(console.error);
  }

  private static checkWebsiteStatus(url: string): Promise<{ status: number; msg: string }> {
    return fetch(url).then(res => ({ status: res.status, msg: res.statusText }));
  }

  private static checkLoginCall(step: WebsiteControlStep): Promise<{ login_status: number; login_msg: string }> {
    const dataApi = JSON.parse(step.api_call_data);
    const data = {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataApi),
    };

    return fetch(step.path, data).then(res => ({ login_status: res.status, login_msg: res.statusText }));
  }
}

export default WebsiteChecker;
