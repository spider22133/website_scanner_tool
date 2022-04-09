import { IsString, IsNumber } from 'class-validator';

export default class CreateWebsiteControlStepDto {
  @IsString()
  public id: string;

  @IsString()
  public website_id: string;

  @IsString()
  public description: string;

  @IsString()
  public path: string;

  @IsString()
  public api_call_data: string;
}
