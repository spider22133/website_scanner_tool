import { IsString, IsBoolean } from 'class-validator';

export default class CreateWebsiteDto {
  @IsString()
  public name: string;

  @IsString()
  public url: string;

  @IsBoolean()
  public is_hidden: boolean;

  @IsBoolean()
  public is_active: boolean;
}
