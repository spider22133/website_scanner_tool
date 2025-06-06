import { IsString } from 'class-validator'

export default class CreateSoftwareVersionDto {
  @IsString()
  public id: string

  @IsString()
  public software_id: string

  @IsString()
  public version: string
}
