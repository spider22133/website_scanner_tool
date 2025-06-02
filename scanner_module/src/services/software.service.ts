import DB from '@databases'
import { Software } from '@/interfaces/software.interface'
import CreateSoftwareDto from '@/dtos/software.dto'
import { isEmpty } from '@/utils/util'
import HttpException from '@/exceptions/HttpException'
import { SoftwareModel } from '@/models/software.model'
import { SoftwareVersionModel } from '@/models/software_version.model'
import { UserModel } from '@/models/user.model'
import { SoftwareUser } from '@/models/software_user.model'
const { Op } = require('sequelize')

class SoftwareService {
  public software = DB.Software

  public async findAllSoftware(): Promise<SoftwareModel[]> {
    return await this.software.findAll({
      order: ['name'],
      include: [
        {
          model: SoftwareVersionModel,
          as: 'versions',
        },
        {
          model: UserModel,
          as: 'users',
          through: {
            model: SoftwareUser,
            attributes: ['isPrimaryResponsible', 'isRepresentative'],
            where: { [Op.or]: [{ isPrimaryResponsible: true }, { isRepresentative: true }] },
          },
          attributes: ['id', 'email'],
        },
      ],
    })
  }

  public async findSoftwareById(softwareId: string): Promise<SoftwareModel> {
    if (isEmpty(softwareId)) throw new HttpException(400, 'Id is wrong')

    const findSoftware: SoftwareModel = await this.software.findOne({
      where: { id: softwareId },
      include: [
        {
          model: SoftwareVersionModel,
          as: 'versions',
        },
      ],
    })

    if (!findSoftware) throw new HttpException(409, "Software doesn't exist")

    return findSoftware
  }

  public async updateSoftware(id: string, data: CreateSoftwareDto, withVersion = false): Promise<SoftwareModel> {
    const findSoftware = await this.software.findByPk(id)

    if (!findSoftware) throw new HttpException(409, 'There is no software with such id')

    await this.software.update(data, { where: { id } })

    if (withVersion && findSoftware) {
      // Check for existing version
      const existingVersion = await findSoftware.getVersions({ where: { version: data.version } })
      if (existingVersion.length > 0) {
        throw new HttpException(409, `Version ${data.version} already exists for this software`)
      }

      // Create new version
      await findSoftware.createVersion({
        version: data.version,
        software_id: findSoftware.id,
      })
    }

    return await this.software.findOne({ where: { id } })
  }

  public async createSoftware(softwareData: CreateSoftwareDto): Promise<SoftwareModel> {
    if (isEmpty(softwareData)) throw new HttpException(400, 'Software data is empty')

    const findSoftware: SoftwareModel = await this.software.findOne({ where: { winget_id: softwareData.winget_id } })
    if (findSoftware) throw new HttpException(409, `Winget ID ${softwareData.winget_id} already exists`)

    const software = await this.software.create(softwareData)
    await software.createVersion({
      version: software.version,
    })

    return software
  }

  public async deleteSoftware(id: string): Promise<SoftwareModel> {
    if (isEmpty(id)) throw new HttpException(400, "This isn't softwareId")

    const findSoftware: SoftwareModel = await this.software.findByPk(id)
    if (!findSoftware) throw new HttpException(409, 'Cant find software with the id')

    await this.software.destroy({ where: { id } })

    return findSoftware
  }

  /* public async searchQuery(data: string): Promise<Software[]> {
    return await this.software.findAll({
      where: {
        [Op.or]: [{ name: { [Op.like]: `%${data}%` } }, { url: { [Op.like]: `%${data}%` } }],
      },
    })
  } */
}

export default SoftwareService
