import { IsString, IsBoolean, IsNumber } from 'class-validator'

export default class CreateSoftwareDto {
  @IsNumber()
  public id: number

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

  @IsString()
  public details: string

  @IsBoolean()
  public is_hidden: boolean

  @IsBoolean()
  public is_current: boolean

  @IsBoolean()
  public subscribeCreateIssue: boolean

  @IsBoolean()
  public is_central_managed: boolean
}
