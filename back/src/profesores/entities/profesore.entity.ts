import { Horario } from 'src/horarios/entities/horario.entity';
import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profesor{
     @PrimaryGeneratedColumn()
     id_profesor:number;
     
     @Column()
     nombre:string;

     @OneToMany(()=> Horario, (horario) => horario.profesor)
     horarios:Horario[];
}

