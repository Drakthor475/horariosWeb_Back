import { Horario } from 'src/horarios/entities/horario.entity';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

@Entity()
export class Profesor{
     @PrimaryColumn()
     id_profesor:number;
     
     @Column()
     nombre:string;

     @OneToMany(()=> Horario, (horario) => horario.profesor)
     horarios:Horario[];
}

