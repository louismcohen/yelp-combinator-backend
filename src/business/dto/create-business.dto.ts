import { IsString, IsNumber  } from "class-validator";

export class CreateBusinessDto {
  @IsString()
  alias: string;
}
