import { Horario } from 'src/horarios/entities/horario.entity';
import { Entity, Column, PrimaryColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Materia {
    
    @PrimaryGeneratedColumn()
    id_materia:number;
     
    @Column()
    nombre:string;

    @Column()
    semestre:Number;
     
    @OneToMany(()=> Horario, (horario) => horario.materia)
    horarios:Horario[];

}
