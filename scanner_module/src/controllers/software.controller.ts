import { NextFunction, Request, Response } from 'express'
import SoftwareService from '@services/software.service'
import SoftwareVersionChecker from '@/classes/SoftwareVersionChecker'
import SoftwareVersionService from '@services/software_versions.service'
import { SoftwareEntry } from '../../../types/common'
import CreateSoftwareDto from '@dtos/software.dto'
import { Software } from '@interfaces/software.interface'
import { WingetUtils } from '@/classes/WingetApi'
import { logger } from '@/utils/logger'

class SoftwareController {
  public softwareVersionChecker: SoftwareVersionChecker
  public softwareService = new SoftwareService()
  public softwareVersionService = new SoftwareVersionService()

  constructor(softwareVersionChecker: SoftwareVersionChecker) {
    this.softwareVersionChecker = softwareVersionChecker
  }

  public getSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllSoftwareData: Software[] = await this.softwareService.findAllSoftware()

      res.status(200).json({ data: findAllSoftwareData, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }

  public getSoftwareById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = req.params.id
      const findOne: Software = await this.softwareService.findSoftwareById(websiteId)

      res.status(200).json({ data: findOne, message: 'findOne' })
    } catch (error) {
      next(error)
    }
  }

  /*  public getSoftwareMainStepStates = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = Number(req.params.id)
      const steps = await this.softwareVersionService.findControlStepsBySoftwareId(websiteId)
      const mainStep = steps.find(step => step.type === 'MAIN')
      const states = await this.websiteStatesService.findStatesByStepId(mainStep.id)

      res.status(200).json({ data: states, message: 'findOne' })
    } catch (error) {
      next(error)
    }
  }*/

  public updateSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteData: CreateSoftwareDto = req.body
      const updateSoftwareData = await this.softwareService.updateSoftware(req.params.id, { ...websiteData })
      console.log(updateSoftwareData)
      res.status(200).json({ data: updateSoftwareData, message: 'updated' })
    } catch (error) {
      next(error)
    }
  }

  public checkSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = req.params.id
      const findOne = await this.softwareService.findSoftwareById(websiteId)
      const { software, message } = await this.softwareVersionChecker.checkSoftwareVersion(findOne)

      res.status(200).json({ software, message })
    } catch (error) {
      next(error)
    }
  }

  public createSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteData: CreateSoftwareDto = req.body

      const createSoftwareData = await this.softwareService.createSoftware({ ...websiteData, is_current: true })
      res.status(201).json({ data: createSoftwareData, message: 'created' })
    } catch (error) {
      next(error)
    }
  }

  public createWinGetSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const softwareData: CreateSoftwareDto = req.body
      const packageDetails = await WingetUtils.showSoftware(softwareData.winget_id)

      let createSoftwareData = await this.softwareService.createSoftware({
        ...softwareData,
        details: JSON.stringify(packageDetails),
      })

      const { currentBaramundiAppId } = await this.softwareVersionChecker.findCurrentBaramundiApp(createSoftwareData)

      // If no current version is found, return an update message
      if (!currentBaramundiAppId) {
        logger.error(`Update required for ${createSoftwareData.name} - Current version ${createSoftwareData.version} not found`)
      }

      if (currentBaramundiAppId) {
        createSoftwareData = await this.softwareVersionChecker.updateSoftwareFromBaramundi(createSoftwareData, currentBaramundiAppId)
      }

      res.status(201).json({ data: createSoftwareData, message: 'created' })
    } catch (error) {
      next(error)
    }
  }

  public deleteSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wingetId = req.params.id
      const deleteSoftwareData: Software = await this.softwareService.deleteSoftware(wingetId)

      res.status(200).json({ data: deleteSoftwareData, message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }

  /*  public searchSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchString = String(req.params.query)
      const searchSoftwareData: Software[] = await this.softwareService.searchQuery(searchString)

      res.status(200).json({ data: searchSoftwareData })
    } catch (error) {
      next(error)
    }
  } */

  public searchWinGetSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchString = String(req.params.query)
      const searchSoftwareData: SoftwareEntry[] = await WingetUtils.searchSoftware(searchString)

      res.status(200).json({ data: searchSoftwareData })
    } catch (error) {
      next(error)
    }
  }
}

export default SoftwareController
