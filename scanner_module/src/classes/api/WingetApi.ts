import fs from 'fs'
import path from 'path'
import fg from 'fast-glob'
import { InstallerDetails, SoftwareEntry, WingetPackageDetails } from '../../../../types/common'
import { BaseRequestApi } from '../abstract/BaseRequestApi'
import { exec } from 'child_process'
import { promisify } from 'util'
import { logger } from '../../utils/logger'
import yaml from 'js-yaml'
import semver from 'semver'

const execAsync = promisify(exec)

export class WingetGitHubApi extends BaseRequestApi {
  private readonly repoUrl = 'https://github.com/microsoft/winget-pkgs.git'
  private readonly tempRepoPath = path.resolve('../../winget-temp')
  private readonly manifestsPath = path.join(this.tempRepoPath, 'manifests')

  public async searchSoftware(query: string): Promise<SoftwareEntry[]> {
    const pattern = `${this.manifestsPath.replace(/\\/g, '/')}/**/*${query.toLowerCase()}*.locale.en-US.yaml`
    const files = await fg(pattern, { caseSensitiveMatch: false, dot: false })
    return this.parseEntriesFromPaths(files)
  }

  public async showSoftware(packageId: string): Promise<WingetPackageDetails | null> {
    try {
      if (!fs.existsSync(this.manifestsPath)) {
        logger.error(`Manifests directory does not exist: ${this.manifestsPath}`)
        return null
      }

      const yamlPath = this.findLatestYamlPath(packageId)
      if (!yamlPath) {
        logger.error(`No YAML file found for packageId: ${packageId}`)
        return null
      }

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
      const pathParts = file.replace(/\\/g, '/').split('/')
      const version = pathParts[pathParts.length - 2]
      const wingetId = path.basename(file, '.locale.en-US.yaml')
      const name = wingetId.split('.').slice(1).join(' ').replace(/\s+/g, ' ').trim()

      const entry: SoftwareEntry = {
        id: '',
        name,
        winget_id: wingetId,
        version,
        source: 'winget',
      }

      const existing = entriesMap.get(wingetId)
      if (!existing || this.compareVersions(entry.version, existing.version) > 0) {
        entriesMap.set(wingetId, entry)
      }
    }

    return Array.from(entriesMap.values())
  }

  public compareVersions(a: string, b: string): number {
    const semA = semver.coerce(a)
    const semB = semver.coerce(b)
    return semA && semB ? semver.compare(semA, semB) : a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  }

  private findLatestYamlPath(packageId: string): string | null {
    const parts = packageId.split('.')
    if (parts.length < 2) {
      logger.error(`Invalid packageId: ${packageId}`)
      return null
    }

    const firstLetter = parts[0][0].toLowerCase()
    const baseDir = path.join(this.manifestsPath, firstLetter, ...parts)
    if (!fs.existsSync(baseDir)) {
      logger.debug(`Base directory does not exist: ${baseDir}`)
      return null
    }

    const versions = fs.readdirSync(baseDir).filter(dir => {
      const dirPath = path.join(baseDir, dir)
      const yamlPath = path.join(dirPath, `${packageId}.locale.en-US.yaml`)
      return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory() && fs.existsSync(yamlPath)
    })

    if (versions.length === 0) {
      logger.debug(`No versions found for packageId: ${packageId}`)
      return null
    }

    const maxVersion = versions.reduce((max, curr) => (this.compareVersions(curr, max) > 0 ? curr : max), versions[0])

    return path.join(baseDir, maxVersion, `${packageId}.locale.en-US.yaml`)
  }

  private parseYamlToPackageDetails(yamlPath: string): WingetPackageDetails | null {
    if (!fs.existsSync(yamlPath)) {
      logger.error(`YAML file does not exist: ${yamlPath}`)
      return null
    }

    try {
      const fileContent = fs.readFileSync(yamlPath, 'utf8')
      const yamlData = yaml.load(fileContent) as any

      const installerPath = yamlPath.replace('.locale.en-US.yaml', '.installer.yaml')
      const installers = this.parseInstallerYaml(installerPath)

      return {
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
        installers,
      }
    } catch (error) {
      logger.error(`Error parsing YAML file ${yamlPath}:`, error)
      return null
    }
  }

  private parseInstallerYaml(installerPath: string): InstallerDetails[] {
    if (!fs.existsSync(installerPath)) {
      logger.debug(`Installer YAML file does not exist: ${installerPath}`)
      return []
    }

    try {
      const fileContent = fs.readFileSync(installerPath, 'utf8')
      const yamlData = yaml.load(fileContent) as any

      const topLevelFields = {
        locale: yamlData.InstallerLocale,
        minimumOSVersion: yamlData.MinimumOSVersion,
        type: yamlData.InstallerType || undefined, // Handle null explicitly
        installModes: yamlData.InstallModes,
        upgradeBehavior: yamlData.UpgradeBehavior,
      }

      return (yamlData.Installers || []).map((installer: any) => ({
        architecture: installer.Architecture,
        type: installer.InstallerType || topLevelFields.type,
        url: installer.InstallerUrl,
        sha256: installer.InstallerSha256,
        scope: installer.Scope,
        locale: installer.InstallerLocale || topLevelFields.locale,
        minimumOSVersion: installer.MinimumOSVersion || topLevelFields.minimumOSVersion,
        installModes: installer.InstallModes || topLevelFields.installModes,
        upgradeBehavior: installer.UpgradeBehavior || topLevelFields.upgradeBehavior,
        switches: installer.InstallerSwitches
          ? {
              silent: installer.InstallerSwitches.Silent,
              silentWithProgress: installer.InstallerSwitches.SilentWithProgress,
              custom: installer.InstallerSwitches.Custom,
            }
          : undefined,
      }))
    } catch (error) {
      logger.error(`Error parsing installer YAML file ${installerPath}:`, error)
      return []
    }
  }
  public async updateManifests(): Promise<void> {
    try {
      if (fs.existsSync(this.tempRepoPath)) {
        logger.info('[WingetGitHubApi] Pulling latest changes...')
        const { stdout } = await execAsync(`git -C "${this.tempRepoPath}" pull`)
        if (/Already up[ -]to[ -]date/.test(stdout)) {
          logger.info('[WingetGitHubApi] Already up to date.')
        } else {
          logger.info('[WingetGitHubApi] Updates pulled:', stdout)
        }
        return
      }

      logger.info('[WingetGitHubApi] Cloning manifests folder only with sparse checkout...')
      await execAsync(`git clone --filter=blob:none --sparse --depth=1 ${this.repoUrl} "${this.tempRepoPath}"`)
      await execAsync(`git -C "${this.tempRepoPath}" sparse-checkout set manifests`)
      logger.info('[WingetGitHubApi] Clone complete.')
    } catch (error) {
      logger.error('Error updating manifests:', error)
      throw error
    }
  }
}
