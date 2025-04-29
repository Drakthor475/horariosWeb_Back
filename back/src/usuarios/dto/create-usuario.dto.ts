import { IsOptional, IsString, Length, MinLength,  } from "class-validator";
import { UserRole } from "../dataType";

export class CreateUsuarioDto {
    
    @IsString()
    @Length(9,9)
    noCuenta:string;

    @IsString()
    @MinLength(3)
    nombre:string

    @IsString()
    contraseña:string



}


