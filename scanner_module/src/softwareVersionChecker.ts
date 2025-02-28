import SoftwareService from '@services/software.service'
import { Socket } from 'socket.io'
import { SoftwareModel } from '@models/software.model'
import SoftwareVersionService from '@services/software_versions.service'
import { WingetSoftwareEntry } from '@/types/common'
import { exec } from 'child_process'
import { promisify } from 'util'
import { logger } from '@utils/logger'

import mailer from '@utils/mailer'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'

class SoftwareVersionChecker {
  public softwareService = new SoftwareService()
  public softwareVersionService = new SoftwareVersionService()
  public _socket: Socket

  public connectSocket = (socket: Socket) => {
    this._socket = socket
  }

  public async checkAllSoftware(): Promise<void> {
    try {
      const findAllSoftwaresData: SoftwareModel[] = await this.softwareService.findAllSoftwares()
      for (const software of findAllSoftwaresData) {
        // await this.checkSoftware(software)
      }
    } catch (error) {
      console.log(error)
    }
  }

  public async checkVersion(id: string) {
    return await SoftwareVersionChecker.checkSoftwareVersion(id)
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
      const winget_id = parts[i] || ''
      const version = parts[i + 1] || 'Unknown'
      const source = parts[parts.length - 1] || ''
      let match = parts.slice(i + 2, parts.length - 1).join(' ') || undefined

      // Clean up match field (remove if empty or just whitespace)
      if (match && match.trim() === '') match = undefined

      entries.push({
        name,
        winget_id,
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
