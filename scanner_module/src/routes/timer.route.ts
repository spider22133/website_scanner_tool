import { Router } from 'express';
import TimerController from '@controllers/timer.controller';
import Route from '@/interfaces/route.interface';

class TimerRoute implements Route {
  public path = '/timer';
  public router = Router();
  public timerController: TimerController;

  constructor(timerController: TimerController) {
    this.timerController = timerController;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:interval(\\d+)`, this.timerController.updateInterval);
  }
}

export default TimerRoute;
