import { NextFunction, Request, Response } from 'express'
import SoftwareVersionChecker from '@/classes/SoftwareVersionChecker'
import dayjs from 'dayjs'
import { logger } from '@/utils/logger'
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)

class TimerController {
  private static _instance: TimerController
  private timer?: NodeJS.Timeout
  private triggerHour = 10
  private triggerMinute = 35
  private constructor(public worker: SoftwareVersionChecker) {}

  public static getInstance(worker: SoftwareVersionChecker): TimerController {
    if (!this._instance) {
      this._instance = new TimerController(worker)
    }
    return this._instance
  }

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

  private isValidTime(hour: number, minute: number): boolean {
    return Number.isInteger(hour) && Number.isInteger(minute) && hour >= 0 && hour < 24 && minute >= 0 && minute < 60
  }

  private formatTime(hour: number, minute: number): string {
    return dayjs().hour(hour).minute(minute).format('HH:mm')
  }

  private calculateNextTrigger(): number {
    const now = dayjs()
    let nextTrigger = dayjs().hour(this.triggerHour).minute(this.triggerMinute).second(0).millisecond(0)

    if (nextTrigger.isBefore(now) || nextTrigger.isSame(now)) {
      nextTrigger = nextTrigger.add(1, 'day')
    }

    // Skip weekends (Sunday=0, Saturday=6)
    while (nextTrigger.weekday() === 0 || nextTrigger.weekday() === 6) {
      nextTrigger = nextTrigger.add(1, 'day')
    }

    return nextTrigger.diff(now)
  }

  private restartTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer)
    }

    const delay = this.calculateNextTrigger()
    const nextRun = dayjs().add(delay, 'millisecond')

    // Map weekday number to name for better readability
    const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const weekdayName = weekdayNames[nextRun.weekday()]

    logger.info(`🕰️ Next software check scheduled at ${nextRun.format('YYYY-MM-DD HH:mm')} (${weekdayName})`)

    this.timer = setTimeout(() => {
      this.worker.checkAllSoftware()
      this.restartTimer()
    }, delay)
  }

  public run(): void {
    this.restartTimer()
  }
}

export default TimerController
