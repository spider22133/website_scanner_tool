import { IsString, IsBoolean } from 'class-validator';

export default class CreateWebsiteControlStepDto {
  @IsString()
  public type: string;

  @IsString()
  public description: string;

  @IsString()
  public path: string;

  @IsBoolean()
  public api_call_data: string;

  @IsBoolean()
  public estimated_code: number;
}
