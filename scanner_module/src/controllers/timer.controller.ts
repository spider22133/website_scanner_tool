import { NextFunction, Request, Response } from 'express'
import SoftwareVersionChecker from '@/classes/SoftwareVersionChecker'
import dayjs from 'dayjs'
import { logger } from '@/utils/logger'

class TimerController {
  private static _instance: TimerController
  private timer?: NodeJS.Timeout
  private triggerHour = 7 // Default trigger time: 07:00
  private triggerMinute = 0

  private constructor(public worker: SoftwareVersionChecker) {}

  /**
   * Singleton instance method
   */
  public static getInstance(worker: SoftwareVersionChecker): TimerController {
    if (!this._instance) {
      this._instance = new TimerController(worker)
    }
    return this._instance
  }

  /**
   * Updates the trigger time (hour and minute) for the software check.
   */
  public updateTriggerTime = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { hour, minute } = req.body

      if (this.isValidTime(hour, minute)) {
        this.triggerHour = hour
        this.triggerMinute = minute

        logger.info(`✅ Trigger time updated to: ${this.formatTime(hour, minute)}`)
        res.status(200).json({ data: { hour, minute }, message: 'Trigger time updated' })
        this.restartTimer()
      } else {
        res.status(400).json({ message: 'Invalid hour or minute provided' })
      }
    } catch (error) {
      next(error)
    }
  }

  /**
   * Validates the hour and minute inputs.
   */
  private isValidTime(hour: number, minute: number): boolean {
    return Number.isInteger(hour) && Number.isInteger(minute) && hour >= 0 && hour < 24 && minute >= 0 && minute < 60
  }

  /**
   * Formats the time as a string "HH:mm".
   */
  private formatTime(hour: number, minute: number): string {
    return dayjs().hour(hour).minute(minute).format('HH:mm')
  }

  /**
   * Calculates the delay until the next trigger time in milliseconds.
   */
  private calculateNextTrigger(): number {
    const now = dayjs()
    let nextTrigger = dayjs().hour(this.triggerHour).minute(this.triggerMinute).second(0).millisecond(0)

    if (nextTrigger.isBefore(now)) {
      nextTrigger = nextTrigger.add(1, 'day')
    }

    return nextTrigger.diff(now)
  }

  /**
   * Starts or restarts the timer with the correct interval.
   */
  private restartTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer)
    }

    const delay = this.calculateNextTrigger()
    logger.info(`🕰️ Next software check scheduled at ${this.formatTime(this.triggerHour, this.triggerMinute)}`)

    this.timer = setTimeout(() => {
      this.worker.checkAllSoftware()
      // After executing, schedule the next check (next day)
      this.restartTimer()
    }, delay)
  }

  /**
   * Starts the timer to check the software version at the configured time.
   */
  public run(): void {
    this.restartTimer()
  }
}

export default TimerController
