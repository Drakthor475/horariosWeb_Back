
import { IsNumber, IsString } from 'class-validator';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

@Entity()
export class ProfesorDto{
     @IsNumber()
     id_profesor:number;
     
     @IsString()
     nombre:string;


}

