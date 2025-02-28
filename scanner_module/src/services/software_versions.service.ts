import DB from '@databases'
import { SoftwareVersion } from '@interfaces/software_version.interface'
import { isEmpty } from '@utils/util'
import HttpException from '@exceptions/HttpException'
import CreateSoftwareVersionDto from '@dtos/version.dto'

class SoftwareVersionService {
  public software_version = DB.SoftwareVersions

  public async findAllWebsiteControlSteps(): Promise<SoftwareVersion[]> {
    return await this.software_version.findAll()
  }

  public async findControlStepsByWebsiteId(websiteId: number): Promise<SoftwareVersion[]> {
    return await this.software_version.findAll({ where: { software_id: websiteId } })
  }

  public async createWebsiteControlStep(data: CreateSoftwareVersionDto): Promise<SoftwareVersion> {
    return await this.software_version.create(data)
  }

  public async updateWebsiteControlStep(id: number, data: CreateSoftwareVersionDto): Promise<SoftwareVersion> {
    const findWebsiteControlStep: SoftwareVersion = await this.software_version.findByPk(id)
    if (!findWebsiteControlStep) throw new HttpException(409, 'There is no step with such id')

    await this.software_version.update(data, { where: { id: id } })

    return await this.software_version.findByPk(id)
  }

  public async deleteWebsiteControlStep(websiteId: number): Promise<SoftwareVersion> {
    if (isEmpty(websiteId)) throw new HttpException(400, "This isn't stepId")

    const findWebsiteControlStep: SoftwareVersion = await this.software_version.findByPk(websiteId)
    if (!findWebsiteControlStep) throw new HttpException(409, 'There is no step with such id')

    await this.software_version.destroy({ where: { id: websiteId } })

    return findWebsiteControlStep
  }
}

export default SoftwareVersionService
