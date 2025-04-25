import {IsNumber, IsString, MinLength } from "class-validator";
export class CreateProfesoreDto {
    @IsNumber()
    id_profesor:number;

    @IsString()
    @MinLength(3)
    nombre:string;

}