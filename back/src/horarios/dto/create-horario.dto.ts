import { IsNumber, IsString, Length, Max, Min, minLength, MinLength } from "class-validator";
export class CreateHorarioDto {

    @IsNumber()
    id_horario?:number;
    
    @IsNumber()
    @Min(7,{message:'Hora no valida'})
    @Max(20,{message:'Hora no valida'})
    lunes:Number
    
    @IsNumber()
    @Min(7,{message:'Hora no valida'})
    @Max(20,{message:'Hora no valida'})
    martes:Number
    
    @IsNumber()
    @Min(7,{message:'Hora no valida'})
    @Max(20,{message:'Hora no valida'})
    miercoles:Number
    
    @IsNumber()
    @Min(7,{message:'Hora no valida'})
    @Max(20,{message:'Hora no valida'})
    jueves:Number
    
    @IsNumber()
    @Min(7,{message:'Hora no valida'})
    @Max(20,{message:'Hora no valida'})
    viernes:Number

    @IsString()
    @MinLength(3)
    grupo:string

    @IsNumber()
    @Min(1)
    id_Materia:number

    @IsNumber()
    @Min(1)
    id_Profesor:number

}
