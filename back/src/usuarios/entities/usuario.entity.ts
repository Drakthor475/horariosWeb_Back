import { IsNotEmpty } from 'class-validator';
import { Entity, Column, PrimaryColumn } from 'typeorm';
import { UserRole } from '../dataType';


@Entity()
export class Usuario {

    @PrimaryColumn({unique: true})
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
