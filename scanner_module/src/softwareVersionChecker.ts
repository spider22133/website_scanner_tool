import WebsiteService from '@services/websites.service'
import WebsiteStatesService from '@services/website_states.service'
import WebsiteErrorService from '@services/website_control_steps.service'
import fetch from 'node-fetch'
import mailer from '@utils/mailer'
import { Socket } from 'socket.io'
import { WebsiteModel } from '@models/website.model'
import { WebsiteControlStep } from '@interfaces/website_control_step.interface'
import WebsiteControlStepService from '@services/website_control_steps.service'
import { WebsiteControlStepModel } from '@models/website_control_step.model'
import * as cheerio from 'cheerio'
import { SoftwareProfile } from '@/types/common'
import { exec } from 'child_process'

const HTTP_CODE_404 = 404
const HTTP_CODE_200 = 200

class SoftwareVersionChecker {
  public websiteService = new WebsiteService()
  public websiteControlStepService = new WebsiteControlStepService()
  public websiteStatesService = new WebsiteStatesService()
  public websiteErrorService = new WebsiteErrorService()
  public _socket: Socket

  public connectSocket = (socket: Socket) => {
    this._socket = socket
  }

  public async checkAllSoftware(): Promise<void> {
    try {
      const findAllWebsitesData: WebsiteModel[] = await this.websiteService.findAllWebsites()
      for (const website of findAllWebsitesData) {
        await this.checkSoftware(website)
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async checkSoftware(website: WebsiteModel) {
    const controlSteps: WebsiteControlStepModel[] = await website.getSteps()

    for (const step of controlSteps) {
      try {
        const start = new Date().getTime()
        switch (step.type) {
          case 'MAIN':
            const profile = JSON.parse(step.api_call_data) as SoftwareProfile
            await SoftwareVersionChecker.checkSoftwareVersion(profile)
            // await this.updateStatus(status, start, step, msg)
            break
          case 'API_CALL':
            console.log('API_CALL')
            break
        }
      } catch (error) {
        await this.sendError(step, error.code, error.message)
      }
    }
    // Check if their any unsuccessfully requests
    const controlStepsUpdated: WebsiteControlStepModel[] = await website.getSteps()
    const hasErrors = controlStepsUpdated.find(item => item.estimated_code === HTTP_CODE_404)

    if (hasErrors) {
      await this.websiteService.updateWebsite(website.id, { ...website, is_active: false })
    } else {
      await this.websiteService.updateWebsite(website.id, { ...website, is_active: true })
    }

    this._socket.emit('updateWebsites', 'changed')
  }

  private async updateStatus(status: number, start: number, step: WebsiteControlStepModel, msg: string) {
    if (status == HTTP_CODE_200) {
      const end = new Date().getTime() - start
      await this.sendStatus(step, end, status)
    } else {
      await this.sendError(step, status, msg)
    }
  }

  public async checkVersion(profile: SoftwareProfile) {
    return await SoftwareVersionChecker.checkSoftwareVersion(profile)
  }

  private async sendStatus(step: WebsiteControlStepModel, end: number, status: number) {
    await this.websiteControlStepService.updateWebsiteControlStep(step.id, { ...step, estimated_code: HTTP_CODE_200 })
    await this.websiteStatesService.createStepState({ step_id: step.id, response_time: end, response_code: status })
  }

  private async sendError(step: WebsiteControlStep, status: number, msg = '') {
    await this.websiteControlStepService.updateWebsiteControlStep(step.id, { ...step, estimated_code: HTTP_CODE_404 })
    await this.websiteStatesService.createStepErrorState({
      step_id: step.id,
      response_code: status,
      response_text: msg,
      is_error: true,
    })

    //Send mail
    //mailer(website, status, msg).catch(console.error);
  }

  private static async checkSoftwareVersion(profile: SoftwareProfile): Promise<{ status: number; msg: string }> {
    const { url, pattern, mainSelector } = profile

    // try {
    //  const response = await fetch(url)
    //  const body = await response.text()
    //  const $ = cheerio.load(body)

    //  const versionMatch = $(mainSelector).text().match(new RegExp(pattern))
    //  const version = versionMatch ? versionMatch[0] : undefined

    //  console.info('Extracted Version:', version)
    //} catch (error) {
    //  console.log(error)
    //}

    exec('winget show Docker.DockerDesktop', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`)
        return
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`)
        return
      }
      console.log(stdout) // Parse this output to find updates
      const versionMatch = stdout.match(new RegExp('Version:\\s*([\\w.-]+)'))
      const version = versionMatch ? versionMatch[1] : undefined

      console.info('Extracted Version:', version)
    })
    return new Promise(() => ({ status: 200, msg: '' }))
  }
}

export default SoftwareVersionChecker
