import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req, UnauthorizedException } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesoreDto } from './dto/create-profesore.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ProfesorDto } from './dto/updateProfesor.dto';
import { UserRole } from 'src/usuarios/dataType';


@Controller('Profesores')
export class ProfesoresController {
  constructor(private readonly profesoresService: ProfesoresService) {}

  @Post('create')
  create(@Body() createProfesoreDto: CreateProfesoreDto) {
    return this.profesoresService.create(createProfesoreDto);
  }

  @Post('guardarTodo')
  async saveAll(@Body() createProfesoreDto: CreateProfesoreDto[]) {
    for(let i=0; i<createProfesoreDto.length; i++){
      await this.profesoresService.create(createProfesoreDto[i]);
    }
  
    return console.log("Se guardó con exito");
  
  }

  @Delete('borrarTodo')
  async deleteAll(){
    await this.profesoresService.deleteAll();
  }

  @Get('findAll')
  findAll(){
    return this.profesoresService.findAll()

  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Protege esta ruta con el JWT Auth Guard
  async delete(
    @Param('id') idProfesor: number, // Parametro que representa el id del profesor
    @Req() req: any, // Requiere el JWT, donde req.user contendrá el payload decodificado
  ) {
    const usuario = req.user; // Usuario extraído del JWT (validado por JwtAuthGuard)

    if (usuario.nivelUsuario !== UserRole.ADMIN) {
      throw new UnauthorizedException('No tiene permitido realizar esta operación');
    }

    // Llamamos al servicio para realizar la eliminación
    await this.profesoresService.deleteOne(idProfesor, usuario.nivelUsuario);
    return { message: 'Profesor eliminado correctamente' }; // Mensaje de éxito
  }


  @Get('findOneByNombre')
  findOneByNombre(@Body() nombreProfesor: string) {
    return this.profesoresService.findOneByNombre(nombreProfesor);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard) // Protege esta ruta con el JWT Auth Guard
  async update(
    @Param('id') idProfesor: number, // Parametro que representa el id del profesor
    @Body() profesorDto: ProfesorDto, // El DTO con los datos que se quieren actualizar
    @Req() req: any, // Requiere el JWT, donde req.user contendrá el payload decodificado
  ) {
    const usuario = req.user; // Usuario extraído del JWT (validado por JwtAuthGuard)

    if (usuario.nivelUsuario !== UserRole.ADMIN) {
      throw new UnauthorizedException('No tiene permitido realizar esta operación');
    }

    // Llamamos al servicio para realizar la actualización
    const updatedProfesor = await this.profesoresService.update(profesorDto, idProfesor, usuario.nivelUsuario);
    return updatedProfesor; // Retorna el profesor actualizado
  }

  @Get('findOneByid')
  findOneByid(@Body() id : number) {
    return this.profesoresService.findByid(id);
  }
}
