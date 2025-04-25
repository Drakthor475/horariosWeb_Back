import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginUsuarioDto } from './dto/loginUsuario';

@Controller('usuarios')
export class UsuariosController {
  
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('register')
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }


  @Post('login')
  login(@Body() loginUsuarioDto:LoginUsuarioDto){
    return this.usuariosService.verificarUsuario(loginUsuarioDto.noCuenta,loginUsuarioDto.contraseña);
  }

  @Get('verTodos')
  seeAllUseer(){
  return this.usuariosService.seeAllUser();
  }
  
  
}
