import WebsiteService from '@services/websites.service'
import WebsiteStatesService from '@services/website_states.service'
import WebsiteErrorService from '@services/website_control_steps.service'
import { Socket } from 'socket.io'
import { WebsiteModel } from '@models/website.model'
import { WebsiteControlStep } from '@interfaces/software_version.interface'
import WebsiteControlStepService from '@services/website_control_steps.service'
import { WebsiteControlStepModel } from '@models/software_version.model'
import { WingetSoftwareEntry } from '@/types/common'
import { exec, ExecOptions, PromiseWithChild } from 'child_process'
import { promisify } from 'util'
import { ObjectEncodingOptions } from 'fs'
import { logger } from '@utils/logger'

import mailer from '@utils/mailer'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'

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
            await SoftwareVersionChecker.checkSoftwareVersion(step.api_call_data)
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

  public async checkVersion(id: string) {
    return await SoftwareVersionChecker.checkSoftwareVersion(id)
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

  private static parseSoftwareTable(input: string): WingetSoftwareEntry[] {
    const lines = input.split('\n').slice(2) // Skip header lines

    let entries: WingetSoftwareEntry[] = []

    for (const line of lines) {
      // Split by whitespace, but preserve content after the version (e.g., "Tag: docker")
      const parts = line.trim().split(/\s+/)
      if (parts.length < 3) continue // Skip malformed lines

      const nameParts = []
      let i = 0
      // Name can have multiple words, so collect until we hit the ID (which has dots or specific format)
      while (i < parts.length && !parts[i].includes('.') && parts[i] !== 'Unknown') {
        nameParts.push(parts[i])
        i++
      }
      const name = nameParts.join(' ')
      const id = parts[i] || ''
      const version = parts[i + 1] || 'Unknown'
      const source = parts[parts.length - 1] || ''
      let match = parts.slice(i + 2, parts.length - 1).join(' ') || undefined

      // Clean up match field (remove if empty or just whitespace)
      if (match && match.trim() === '') match = undefined

      entries.push({
        name,
        id,
        version,
        source,
      })
    }
    entries = entries.filter(entrie => entrie.source !== 'msstore')
    console.log('entries found', entries)
    return entries
  }

  public async prepareSearchedSoftwareList(query: string): Promise<WingetSoftwareEntry[]> {
    try {
      const execAsync = promisify(exec)
      console.log('query', query)
      console.log('query', `winget search --name "${query.trim()}"`)
      const { stdout, stderr } = await execAsync(`winget search --name "${query.trim()}"`)
      if (stderr) {
        logger.error(`winget stderr: ${stderr}`)
      }

      return SoftwareVersionChecker.parseSoftwareTable(stdout)
    } catch (error) {
      logger.error(`Failed to search software: ${(error as Error).message}`)
      logger.error(error) // Propagate error to caller
    }
  }

  private static async checkSoftwareVersion(id: string): Promise<{ status: number; msg: string }> {
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

    return new Promise(() => ({ status: 200, msg: '' }))
  }
}

export default SoftwareVersionChecker
