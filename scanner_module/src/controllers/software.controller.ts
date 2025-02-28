import { NextFunction, Request, Response } from 'express'
import { Website } from '@/interfaces/website.interface'
import SoftwareService from '@services/software.service'
import CreateWebsiteDto from '@dtos/website.dto'
import SoftwareVersionChecker from '@/softwareVersionChecker'
import WebsiteStatesService from '@services/website_states.service'
import { SoftwareModel } from '@models/software.model'
import SoftwareVersionService from '@services/software_versions.service'
import { WingetSoftwareEntry } from '@/types/common'
import CreateSoftwareDto from '@dtos/software.dto'
import { Software } from '@interfaces/software.interface'

class SoftwareController {
  public softwareVersionChecker: SoftwareVersionChecker
  public softwareService = new SoftwareService()
  public softwareVersionService = new SoftwareVersionService()

  constructor(softwareVersionChecker: SoftwareVersionChecker) {
    this.softwareVersionChecker = softwareVersionChecker
  }

  public getSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllSoftwareData: Software[] = await this.softwareService.findAllSoftwares()

      res.status(200).json({ data: findAllSoftwareData, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }

  public getSoftwareById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = Number(req.params.id)
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
      const websiteId = Number(req.params.id)
      const websiteData: CreateSoftwareDto = req.body

      const updateSoftwareData = await this.softwareService.updateSoftware(websiteId, { ...websiteData, is_current: true })
      res.status(200).json({ data: updateSoftwareData, message: 'updated' })
    } catch (error) {
      next(error)
    }
  }

  /* public checkSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = Number(req.params.id)
      const findOne: SoftwareModel = await this.softwareService.findSoftwareById(websiteId)

      await this.softwareVersionChecker.checkVersion(findOne.id.toString())

      const steps = await this.softwareVersionService.findControlStepsBySoftwareId(websiteId)
      const mainStep = steps.find(step => step.type === 'MAIN')
      const latestState = await this.websiteStatesService.findLatestStateByStepId(mainStep.id)

      res.status(200).json({ data: latestState, message: 'checked' })
    } catch (error) {
      next(error)
    }
  }*/

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

      const createSoftwareData = await this.softwareService.createSoftware({ ...softwareData, is_current: true })
      res.status(201).json({ data: createSoftwareData, message: 'created' })
    } catch (error) {
      next(error)
    }
  }

  public deleteSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wingetId = req.params.id
      console.log('wingetId', wingetId)
      const deleteSoftwareData: Software = await this.softwareService.deleteSoftware(wingetId)

      res.status(200).json({ data: deleteSoftwareData, message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }

  public searchSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchString = String(req.params.query)
      const searchSoftwareData: Software[] = await this.softwareService.searchQuery(searchString)

      res.status(200).json({ data: searchSoftwareData })
    } catch (error) {
      next(error)
    }
  }

  public searchWinGetSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchString = String(req.params.query)
      const searchSoftwareData: WingetSoftwareEntry[] = await this.softwareVersionChecker.prepareSearchedSoftwareList(searchString)

      res.status(200).json({ data: searchSoftwareData })
    } catch (error) {
      next(error)
    }
  }
}

export default SoftwareController
