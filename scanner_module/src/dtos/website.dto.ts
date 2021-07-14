import { IsString, IsBoolean } from 'class-validator';

export class CreateWebsiteDto {
  @IsString()
  public name: string;

  @IsString()
  public url: string;

  @IsBoolean()
  public is_active: boolean;
}
