import fs from 'fs'
import path from 'path'
import fg from 'fast-glob'
import { SoftwareEntry } from '../../../../types/common'
import { BaseRequestApi } from '../abstract/BaseRequestApi'
import { exec } from 'child_process'
import { promisify } from 'util'
import { logger } from './../../utils/logger'
import yaml from 'js-yaml'
import semver from 'semver'

interface WingetSearchResultItem {
  name: string
  path: string
  repository: { name: string; full_name: string }
  html_url: string
}

interface WingetPackageDetails {
  id: string
  version: string
  publisher: string
  publisherUrl?: string
  publisherSupportUrl?: string
  author?: string
  name: string
  moniker?: string
  description?: string
  homepage?: string
  license?: string
  licenseUrl?: string
  privacyUrl?: string
  copyright?: string
  releaseNotes?: string
  releaseNotesUrl?: string
  documentations?: { DocumentLabel: string; DocumentUrl: string }[]
  tags?: string[]
  installer: {
    type?: string
    url?: string
    sha256?: string
    releaseDate?: string
    offlineSupported?: boolean
  }
}

const execAsync = promisify(exec)

export class WingetGitHubApi extends BaseRequestApi {
  private readonly repoUrl = 'https://github.com/microsoft/winget-pkgs.git'
  private readonly tempRepoPath = path.resolve('../../winget-temp')
  private readonly manifestsPath = path.join(this.tempRepoPath, 'manifests')

  public async searchSoftware(query: string): Promise<SoftwareEntry[]> {
    const pattern = `${this.manifestsPath.replace(/\\/g, '/')}/**/*${query.toLowerCase()}*.locale.en-US.yaml`
    const files = await fg(pattern, {
      caseSensitiveMatch: false,
      dot: false,
    })

    return this.parseEntriesFromPaths(files)
  }

  public async showSoftware(packageId: string): Promise<WingetPackageDetails | null> {
    try {
      // Ensure manifests directory exists
      if (!fs.existsSync(this.manifestsPath)) {
        logger.error(`Manifests directory does not exist: ${this.manifestsPath}`)
        return null
      }

      // Find the latest YAML file
      const yamlPath = this.findLatestYamlPath(packageId)
      if (!yamlPath) {
        logger.error(`No YAML file found for packageId: ${packageId}`)
        return null
      }

      // Parse the YAML file
      const packageDetails = this.parseYamlToPackageDetails(yamlPath)
      if (!packageDetails) {
        logger.error(`Failed to parse YAML file: ${yamlPath}`)
        return null
      }

      return packageDetails
    } catch (error) {
      logger.error(`Error in showSoftware for packageId ${packageId}:`, error)
      return null
    }
  }

  private parseEntriesFromPaths(files: string[]): SoftwareEntry[] {
    const entriesMap = new Map<string, SoftwareEntry>()

    for (const file of files) {
      // Normalize path and split into parts
      const pathParts = file.replace(/\\/g, '/').split('/')

      // Extract version as the second-to-last part
      const version = pathParts[pathParts.length - 2]

      // Extract winget_id from filename
      const filename = path.basename(file, '.locale.en-US.yaml')
      const winget_id = filename

      // Derive name from winget_id: split by '.', take parts after publisher, join with spaces
      const idParts = winget_id.split('.')
      const nameParts = idParts.slice(1) // Exclude publisher
      let name = nameParts
        .join(' ')
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim()

      // Create entry
      const entry: SoftwareEntry = {
        id: '',
        name,
        winget_id,
        version,
        source: 'winget',
      }

      // Keep only the highest version per winget_id
      const existing = entriesMap.get(winget_id)
      if (!existing || this.compareVersions(entry.version, existing.version) > 0) {
        entriesMap.set(winget_id, entry)
      }
    }

    return Array.from(entriesMap.values())
  }

  public compareVersions(a: string, b: string): number {
    const semA = semver.coerce(a)
    const semB = semver.coerce(b)
    if (semA && semB) return semver.compare(semA, semB)
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  }

  private findLatestYamlPath(packageId: string): string | null {
    const parts = packageId.split('.')
    if (parts.length < 2) return null // Invalid packageId

    const firstLetter = parts[0][0].toLowerCase()
    const baseDir = path.join(this.manifestsPath, firstLetter, ...parts)
    if (!fs.existsSync(baseDir)) return null

    // List all subdirectories (versions) containing the YAML file
    const versions = fs.readdirSync(baseDir).filter(dir => {
      const dirPath = path.join(baseDir, dir)
      const yamlPath = path.join(dirPath, `${packageId}.locale.en-US.yaml`)
      return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory() && fs.existsSync(yamlPath)
    })

    if (versions.length === 0) return null

    // Find the highest version using compareVersions
    let maxV = versions[0]
    for (let i = 1; i < versions.length; i++) {
      if (this.compareVersions(versions[i], maxV) > 0) {
        maxV = versions[i]
      }
    }

    return path.join(baseDir, maxV, `${packageId}.locale.en-US.yaml`)
  }

  private parseYamlToPackageDetails(yamlPath: string): WingetPackageDetails | null {
    if (!fs.existsSync(yamlPath)) return null
    try {
      const fileContent = fs.readFileSync(yamlPath, 'utf8')
      const yamlData = yaml.load(fileContent)

      // Map YAML fields to WingetPackageDetails
      const packageDetails: WingetPackageDetails = {
        id: yamlData.PackageIdentifier,
        version: yamlData.PackageVersion,
        publisher: yamlData.Publisher,
        publisherUrl: yamlData.PublisherUrl,
        publisherSupportUrl: yamlData.PublisherSupportUrl,
        author: yamlData.Author,
        name: yamlData.PackageName,
        moniker: yamlData.Moniker,
        description: yamlData.Description,
        homepage: yamlData.PackageUrl,
        license: yamlData.License,
        licenseUrl: yamlData.LicenseUrl,
        privacyUrl: yamlData.PrivacyUrl,
        copyright: yamlData.Copyright,
        releaseNotes: yamlData.ReleaseNotes,
        releaseNotesUrl: yamlData.ReleaseNotesUrl,
        documentations: yamlData.Documentations || [],
        tags: yamlData.Tags || [],
        installer: {}, // Empty for now; extend to parse .installer.yaml if needed
      }

      return packageDetails
    } catch (error) {
      logger.error(`Error parsing YAML file ${yamlPath}:`, error)
      return null
    }
  }

  public async updateManifests(): Promise<void> {
    if (fs.existsSync(this.tempRepoPath)) {
      logger.info('[WingetGitHubApi] Pulling latest changes...')

      const { stdout } = await execAsync(`git -C "${this.tempRepoPath}" pull`)
      if (/Already up[ -]to[ -]date/.test(stdout)) {
        logger.info('[WingetGitHubApi] Already up to date.')
      } else {
        logger.info('[WingetGitHubApi] Updates pulled:')
        logger.info(stdout)
      }

      return
    }

    logger.info('[WingetGitHubApi] Cloning manifests folder only with sparse checkout...')
    await execAsync(`git clone --filter=blob:none --sparse --depth=1 ${this.repoUrl} "${this.tempRepoPath}"`)
    await execAsync(`git -C "${this.tempRepoPath}" sparse-checkout set manifests`)
    logger.info('[WingetGitHubApi] Clone complete.')
  }
}
