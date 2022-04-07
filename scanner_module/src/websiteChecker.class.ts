import WebsiteService from '@services/websites.service';
import WebsiteStatesService from '@services/website_states.service';
import WebsiteErrorService from '@services/website_control_steps.service';
import fetch from 'node-fetch';
import mailer from '@utils/mailer';
import { Socket } from 'socket.io';
import { WebsiteModel } from '@models/website.model';
import { WebsiteControlStep } from '@interfaces/website_control_step.interface';
import WebsiteControlStepService from '@services/website_control_steps.service';

const HTTP_CODE_404 = 404;
const HTTP_CODE_200 = 200;

class WebsiteChecker {
  public websiteService = new WebsiteService();
  public websiteControlStepService = new WebsiteControlStepService();
  public websiteStatesService = new WebsiteStatesService();
  public websiteErrorService = new WebsiteErrorService();
  private _socket: Socket;

  public connectSocket = (socket: Socket) => {
    this._socket = socket;
  };

  public async checkWebsites(): Promise<void> {
    try {
      const findAllWebsitesData: WebsiteModel[] = await this.websiteService.findAllWebsites();
      for (const website of findAllWebsitesData) {
        const controlSteps: WebsiteControlStep[] = await website.getSteps();
        await this.checkWebsite(controlSteps);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public async checkWebsite(controlSteps: WebsiteControlStep[]): Promise<void> {
    for (const step of controlSteps) {
      try {
        const start = new Date().getTime();

        switch (step.title) {
          case 'MAIN':
            const { status } = await WebsiteChecker.checkWebsiteStatus(step.path);
            if (status == HTTP_CODE_200) {
              const end = new Date().getTime() - start;
              return await this.sendStatus(step, end, status);
            }
            break;
          case 'API_CALL':
            console.log('API_CALL');
            break;
          case 'LOGIN_CALL':
            console.log('API_CALL');
            break;
        }
      } catch (error) {
        await this.sendError(step, error.code, error.message);
      }
    }
  }

  public async checkUrl(url: string) {
    return await WebsiteChecker.checkWebsiteStatus(url);
  }

  private async sendStatus(step: WebsiteControlStep, end: number, status: number) {
    const updated = await this.websiteControlStepService.updateWebsiteControlStep(step.id, { ...step, estimated_code: HTTP_CODE_200 });
    await this.websiteStatesService.createStepState({ step_id: step.id, response_time: end, response_code: status });

    // Client should update websites state
    if (updated.estimated_code === HTTP_CODE_200 && step.estimated_code === HTTP_CODE_404) this._socket.emit('updateWebsites', 'changed');
  }

  private async sendError(step: WebsiteControlStep, status: number, msg = '') {
    await this.websiteControlStepService.updateWebsiteControlStep(step.id, { ...step, estimated_code: HTTP_CODE_404 });
    await this.websiteStatesService.createStepErrorState({ step_id: step.id, response_code: status, response_text: msg, is_error: true });

    // Client should update websites state
    this._socket.emit('updateWebsites', 'changed');

    //Send mail
    //mailer(website, status, msg).catch(console.error);
  }

  private static checkWebsiteStatus(url: string): Promise<{ status: number; msg: string }> {
    return fetch(url).then(res => ({ status: res.status, msg: res.statusText }));
  }
}

export default WebsiteChecker;
