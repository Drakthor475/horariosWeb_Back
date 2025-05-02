import { IsNumber, IsString, Min, MinLength } from "class-validator";
export class CreateMateriaDto {
    
    @IsNumber()
    id_materia?:number;
    

    @IsString()
    @MinLength(4)
    nombre:string;
    
    @Min(1)
    semestre:number;

}
