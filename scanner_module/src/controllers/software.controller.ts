import { NextFunction, Request, Response } from 'express'
import SoftwareService from '@services/software.service'
import SoftwareVersionChecker from '@/classes/SoftwareVersionChecker'
import SoftwareVersionService from '@services/software_versions.service'
import { SoftwareEntry } from '../../../types/common'
import CreateSoftwareDto from '@dtos/software.dto'
import { Software } from '@interfaces/software.interface'
import { WingetUtils } from '@/classes/api/WingetApi'
import { logger } from '@/utils/logger'
import { SoftwareModel } from '@/models/software.model'
import { SoftwareRepresentative } from '@/models/software_representative.model'
import multer from 'multer'
import HttpException from '@/exceptions/HttpException'
import fs from 'fs'
import path from 'path'

class SoftwareController {
  public softwareVersionChecker: SoftwareVersionChecker
  public softwareService = new SoftwareService()
  public softwareVersionService = new SoftwareVersionService()

  constructor(softwareVersionChecker: SoftwareVersionChecker) {
    this.softwareVersionChecker = softwareVersionChecker
  }

  //
  // CRUD
  //

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

  public updateSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteData: CreateSoftwareDto = req.body
      const updateSoftwareData = await this.softwareService.updateSoftware(req.params.id, { ...websiteData })

      res.status(200).json({ data: updateSoftwareData, message: 'updated' })
    } catch (error) {
      next(error)
    }
  }

  public checkSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = req.params.id
      const findOne = await this.softwareService.findSoftwareById(websiteId)
      const { software, message } = await this.softwareVersionChecker.checkSoftwareVersion(findOne, true)

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

  public deleteSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wingetId = req.params.id
      const deleteSoftwareData: Software = await this.softwareService.deleteSoftware(wingetId)

      res.status(200).json({ data: deleteSoftwareData, message: 'deleted' })
    } catch (error) {
      next(error)
    }
  }

  //
  // Representatives
  //

  public getSoftwareRepresentatives = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const websiteId = req.params.id
      const findOne: SoftwareModel = await this.softwareService.findSoftwareById(websiteId)
      const representatives: SoftwareRepresentative[] = await findOne.getRepresentatives()

      res.status(200).json({ data: representatives, message: 'findAll' })
    } catch (error) {
      next(error)
    }
  }

  public setSoftwareRepresentatives = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const softwareId = req.params.id
      const representativeIds = req.body // Expects an array of user IDs

      // Validate representative IDs
      if (!Array.isArray(representativeIds) || representativeIds.some(id => typeof id !== 'number')) {
        return res.status(400).json({ message: 'Invalid representative IDs' })
      }

      // Find the software entry by ID
      const software: SoftwareModel = await this.softwareService.findSoftwareById(softwareId)

      if (!software) {
        return res.status(404).json({ message: 'Software not found' })
      }

      // Update representatives (assumes representativeIds is an array of user IDs)
      await software.setRepresentatives(representativeIds)

      res.status(200).json({ message: 'Representatives updated successfully' })
    } catch (error) {
      next(error)
    }
  }

  //
  // WinGet
  //

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

  public searchWinGetSoftware = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const searchString = String(req.params.query)
      const searchSoftwareData: SoftwareEntry[] = await WingetUtils.searchSoftware(searchString)

      res.status(200).json({ data: searchSoftwareData })
    } catch (error) {
      next(error)
    }
  }

  public saveSoftwareIcon = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const wingetId = req.params.id

      const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          const dir = 'public/icons'

          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
          }
          cb(null, dir)
        },
        filename: (req, file, cb) => {
          // Preserve the original file extension
          const ext = path.extname(file.originalname).toLowerCase()
          cb(null, `${wingetId}${ext}`)
        },
      })

      const upload = multer({
        storage,
        fileFilter: (req, file, cb) => {
          const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml']
          if (!allowedTypes.includes(file.mimetype)) {
            return cb(new HttpException(400, 'Only PNG, JPG, and SVG files are allowed'))
          }
          cb(null, true)
        },
      }).single('icon')

      await new Promise<void>((resolve, reject) => {
        upload(req, res, err => {
          if (err) {
            reject(new HttpException(400, err.message))
          } else if (!req.file) {
            reject(new HttpException(400, 'No icon file provided'))
          } else {
            resolve()
          }
        })
      })

      // Use the uploaded file's extension in the icon path
      const ext = path.extname(req.file.originalname).toLowerCase()
      const iconPath = `/icons/${wingetId}${ext}`

      // Update software with the icon path
      const findOne = await this.softwareService.findSoftwareById(wingetId)
      const updatedSoftware = await this.softwareService.updateSoftware(wingetId, { ...findOne, icon: iconPath })

      res.status(200).json({
        data: updatedSoftware,
        message: 'Icon uploaded and software updated successfully',
      })
    } catch (error) {
      next(error)
    }
  }
}

export default SoftwareController
