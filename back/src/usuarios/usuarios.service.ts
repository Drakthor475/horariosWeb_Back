import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly jwtService: JwtService
  ){}


  async create(createUsuarioDto: CreateUsuarioDto) {
    const user = await this.usuarioRepository.findOne({
      where: { noCuenta: createUsuarioDto.noCuenta },
    });
    if (user) throw new Error('Cuenta ya registrada');

    const password_hash = await bcrypt.hash(createUsuarioDto.contraseña, 5);

    const usuario = this.usuarioRepository.create({
      noCuenta: createUsuarioDto.noCuenta,
      nombre: createUsuarioDto.nombre,
      contraseña: password_hash,
    });

    return await this.usuarioRepository.save(usuario);
  }

  async verificarUsuario(noCuenta: string, contraseña: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { noCuenta: noCuenta },
    });

    if (!usuario) throw new Error('Usuario no encontrado');

    const contra = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!contra) throw new Error('Contraseña incorrecta');

    
    const token = await this.jwtService.signAsync({
      sub: usuario.noCuenta,
      noCuenta: usuario.noCuenta,
      nivelUsuario: usuario.nivelUsuario,
    });

    return { token, nivelUsuario: usuario.nivelUsuario };
  }

  async seeAllUser(){
    const usuario= await this.usuarioRepository.find();

    return usuario;

  }
}

