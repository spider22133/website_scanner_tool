import { IsString, IsNumber } from 'class-validator';

export default class CreateWebsiteControlStepDto {
  @IsNumber()
  public id: number;

  @IsNumber()
  public website_id: number;

  @IsString()
  public description: string;

  @IsString()
  public path: string;

  @IsString()
  public api_call_data: string;

  @IsNumber()
  public estimated_code: number;
}
