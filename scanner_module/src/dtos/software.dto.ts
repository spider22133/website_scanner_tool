import { IsString, IsBoolean, IsNumber } from 'class-validator'

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
  public icon: string

  @IsNumber()
  public user_id: number

  @IsString()
  public details: string

  @IsBoolean()
  public is_hidden: boolean

  @IsBoolean()
  public is_current: boolean

  @IsBoolean()
  public is_central_managed: boolean
}
