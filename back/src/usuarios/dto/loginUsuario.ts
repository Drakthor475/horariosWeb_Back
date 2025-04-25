import { IsString, Length, IsNotEmpty, MinLength } from "class-validator";
export class LoginUsuarioDto{
    @IsString()
    
    readonly noCuenta:string;
    @IsString()
    
    readonly contraseña:string;

}