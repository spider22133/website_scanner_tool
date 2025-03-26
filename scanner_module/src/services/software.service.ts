import DB from '@databases'
import { Software } from '@/interfaces/software.interface'
import CreateSoftwareDto from '@/dtos/software.dto'
import { isEmpty } from '@/utils/util'
import HttpException from '@/exceptions/HttpException'
import { SoftwareModel } from '@/models/software.model'
import { Op } from 'sequelize'

class SoftwareService {
  public software = DB.Software

  public async findAllSoftware(): Promise<SoftwareModel[]> {
    return await this.software.findAll()
  }

  public async findSoftwareById(softwareId: string): Promise<SoftwareModel> {
    if (isEmpty(softwareId)) throw new HttpException(400, 'Id is wrong')

    const findSoftware: SoftwareModel = await this.software.findOne({ where: { winget_id: softwareId } })

    if (!findSoftware) throw new HttpException(409, "Software doesn't exist")

    return findSoftware
  }

  public async updateSoftware(id: string, data: CreateSoftwareDto): Promise<SoftwareModel> {
    const findSoftware = await this.software.findOne({ where: { winget_id: id } })
    if (!findSoftware) throw new HttpException(409, 'There is no software with such id')

    await this.software.update(data, { where: { winget_id: id } })

    return await this.software.findOne({ where: { winget_id: id } })
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

  public async deleteSoftware(wingetId: string): Promise<Software> {
    if (isEmpty(wingetId)) throw new HttpException(400, "This isn't softwareId")

    const findSoftware: SoftwareModel = await this.software.findOne({ where: { winget_id: wingetId } })
    if (!findSoftware) throw new HttpException(409, "You're not software")

    await this.software.destroy({ where: { winget_id: wingetId } })

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
