import { IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn } from 'typeorm';
import { UserRole } from '../dataType';


@Entity()
export class Usuario {

    @PrimaryColumn()
    @IsNotEmpty()
    noCuenta:string

    @Column()
    @IsNotEmpty()
    nombre:string

    @Column()
    @IsNotEmpty()
    contraseña:string

    @Column({
    default: UserRole.VIEWER,
    })
    nivelUsuario:UserRole;

}
