import { Materia } from 'src/materias/entities/materia.entity';
import { Profesor } from 'src/profesores/entities/profesore.entity';
import { Entity, Column,ManyToOne, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Horario {
    @PrimaryGeneratedColumn()
    id_horario:number;
    
    @Column()
    lunes:Number

    @Column()
    martes:Number;

    @Column()
    miercoles:Number;
    
    @Column()
    jueves:Number;
    
    @Column()
    viernes:Number;
    
    @Column()
    grupo:String;

    @ManyToOne(()=>Materia, (materia)=>materia.horarios) 
    materia:Materia;

    @ManyToOne(()=>Profesor,(profesor)=>profesor.horarios)
    profesor:Profesor;
}
