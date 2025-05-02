import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';

export class UpdateHorarioDto {
  @IsOptional()
  @IsNumber()
  id_horario?: number;

  @IsOptional()
  @IsString()
  materia?: string;

  @IsOptional()
  @IsString()
  profesor?: string;

  @IsOptional()
  @IsString()
  hora_inicio?: string;

  @IsOptional()
  @IsString()
  hora_fin?: string;

  @IsOptional()
  @IsArray()
  dias?: string[];  // Ejemplo: ['Lunes', 'Miércoles', 'Viernes']
}
