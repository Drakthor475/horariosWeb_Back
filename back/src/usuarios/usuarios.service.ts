import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>
    
  ){}

  async create(createUsuarioDto: CreateUsuarioDto) {
    let user= await this.usuarioRepository.findOne({
      where: 
      {noCuenta: createUsuarioDto.noCuenta}
    });
    if(user) throw new Error;
    
    let password_hash=await bcrypt.hash(createUsuarioDto.contraseña, 5);
    
    const usuario= this.usuarioRepository.create({noCuenta:createUsuarioDto.noCuenta, nombre:createUsuarioDto.nombre, contraseña:password_hash})
    return await this.usuarioRepository.save(usuario);
  }

  async verificarUsuario(noCuenta:string, contraseña:string) {
    const usuario= await this.usuarioRepository.findOne({
      where:{noCuenta:noCuenta}
    }) 

    if (!usuario) throw new Error;

    
    const contra= await bcrypt.compare(contraseña, usuario.contraseña )
    
    if(!contra) throw new Error
    
    return true;
  }

  async seeAllUser(){
    const usuario= await this.usuarioRepository.find();

    return usuario;

    }
  }

