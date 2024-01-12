import { IsString, IsISO8601, MaxLength } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MaxLength(32)
  public readonly name: string;

  @IsString()
  @IsISO8601()
  public readonly startDate: string;

  @IsString()
  @IsISO8601()
  public readonly endDate: string;
}
