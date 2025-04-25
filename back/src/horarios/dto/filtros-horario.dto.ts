import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BloqueLibreDto {
  @IsNumber()
  inicio: number;

  @IsNumber()
  fin: number;

  @IsString()
  dia: string;
  
}

export class FiltrosHorariosDto {
  @IsNumber()
  semestre: number;

  @IsArray()
  @IsOptional()
  materiasObligatorias?: number[];

  @IsOptional()
  profesoresPreferidos?: Record<number, number[]>;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => BloqueLibreDto)
  bloquesLibres?: BloqueLibreDto[];

  @IsOptional()
  @IsNumber()
  horaInicio?: number;

  @IsOptional()
  @IsNumber()
  horaFin?: number;
}
