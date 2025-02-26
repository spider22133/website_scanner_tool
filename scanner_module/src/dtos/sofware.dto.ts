import { IsString, IsBoolean } from 'class-validator'

export default class CreateSoftwareDto {
  @IsString()
  public name: string

  @IsString()
  public id: string

  @IsString()
  public version: string

  @IsString()
  public source: string

  @IsBoolean()
  public is_hidden: boolean

  @IsBoolean()
  public is_active: boolean
}
