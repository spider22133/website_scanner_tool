import { NextFunction, Request, Response } from 'express';
import { Timer } from '@interfaces/timer.interface';
import WebsiteChecker from 'websiteChecker';

class TimerController implements Timer {
  private _interval = 3600000;
  public timer: NodeJS.Timer;
  public worker: WebsiteChecker;

  constructor(worker: WebsiteChecker) {
    this.worker = worker;
  }

  get interval(): number {
    return this._interval;
  }

  set interval(value: number) {
    this._interval = value;
  }

  public updateInterval = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newInterval = Number(req.params.interval);

      clearInterval(this.timer);
      this._interval = newInterval;

      this.timer = setInterval(() => {
        return this.worker.checkWebsites();
      }, this._interval);

      res.status(200).json({ data: newInterval, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public run() {
    this.timer = setInterval(() => {
      return this.worker.checkWebsites();
    }, this._interval);
  }
}

export default TimerController;
