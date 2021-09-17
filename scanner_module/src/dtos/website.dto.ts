import { IsString, IsBoolean } from 'class-validator';

export default class CreateWebsiteDto {
  @IsString()
  public name: string;

  @IsString()
  public url: string;

  @IsBoolean()
  public is_active: boolean;
}
