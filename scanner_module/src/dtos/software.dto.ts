import { IsString, IsBoolean } from 'class-validator'

export default class CreateSoftwareDto {
  @IsString()
  public name: string

  @IsString()
  public version: string

  @IsString()
  public bara_version: string

  @IsString()
  public source: string

  @IsString()
  public winget_id: string

  @IsString()
  public details: string

  @IsBoolean()
  public is_hidden: boolean

  @IsBoolean()
  public is_current: boolean
}
