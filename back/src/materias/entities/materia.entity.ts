import { Horario } from 'src/horarios/entities/horario.entity';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

@Entity()
export class Materia {
    
    @PrimaryColumn()
    id_materia:number;
     
    @Column()
    nombre:string;

    @Column()
    semestre:Number;
     
    @OneToMany(()=> Horario, (horario) => horario.materia)
    horarios:Horario[];

}
