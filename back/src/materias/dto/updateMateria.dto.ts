
import { IsNumber, IsString } from 'class-validator';



export class MateriaDto {
    
    @IsNumber()
    id_materia?:number;
     
    @IsString()
    nombre?:string;

    @IsNumber()
    semestre?:Number;

}
