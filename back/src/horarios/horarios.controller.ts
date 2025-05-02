import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, InternalServerErrorException, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { FiltrosHorariosDto } from './dto/filtros-horario.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateHorarioDto } from './dto/horario.dto';
import { UserRole } from 'src/usuarios/dataType';



@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

  @Patch(':id')
  @UseGuards(JwtAuthGuard)  // Protege esta ruta con el JWT Auth Guard
  async update(
    @Param('id') idHorario: number,  // Recibe el ID del horario en la URL
    @Body() updateHorarioDto: UpdateHorarioDto,  // Recibe el DTO con los datos a actualizar
    @Req() req: any,  // Requiere el JWT, donde req.user contendrá el payload decodificado
  ) {
    const usuario = req.user;  // Usuario extraído del JWT (validado por JwtAuthGuard)
    
    if (usuario.nivelUsuario !== UserRole.ADMIN) {
      throw new UnauthorizedException('No tiene permitido realizar esta operación');
    }

    return this.horariosService.update(idHorario, updateHorarioDto, usuario.nivelUsuario);
  }

  // Eliminar un horario
  @Delete(':id')
  @UseGuards(JwtAuthGuard)  // Protege esta ruta con el JWT Auth Guard
  async delete(
    @Param('id') idHorario: number,  // Recibe el ID del horario en la URL
    @Req() req: any,  // Requiere el JWT, donde req.user contendrá el payload decodificado
  ) {
    const usuario = req.user;  // Usuario extraído del JWT (validado por JwtAuthGuard)

    if (usuario.nivelUsuario !== UserRole.ADMIN) {
      throw new UnauthorizedException('No tiene permitido realizar esta operación');
    }

    return this.horariosService.delete(idHorario, usuario.nivelUsuario);
  }


  @Post('create')
  create(@Body() createHorarioDto: CreateHorarioDto) {
    return this.horariosService.create(createHorarioDto);
  }

  @Post('guardarTodo')
  async guardarTodo(@Body() createHorarioDto:CreateHorarioDto[]){
    for(let i=0; i<createHorarioDto.length; i++){
      await this.horariosService.create(createHorarioDto[i]);
    }
    return console.log("se guardaron correctamente");
  }
  
  @Post('guardarHorarios')
async guardarHorarios(@Body() createHorarioDto: CreateHorarioDto[]) {
  try {
    for (const dto of createHorarioDto) {
      await this.horariosService.create(dto);
    }
    return { mensaje: 'Horarios guardados correctamente' };
  } catch (error) {
    console.error('Error al guardar los horarios:', error);
    throw new InternalServerErrorException('No se pudieron guardar todos los horarios');
  }
}

  @Delete()
  async borrar(){
    return await this.horariosService.deleteAll();
  }

  @Get('findAll')
  async findAll(){
    return await this.horariosService.findAll()
  }

  @Get('por-semestre/:semestre')
  async obtenerPorSemestre(@Param('semestre', ParseIntPipe) semestre: number) {
    return await this.horariosService.buscarPorSemestre(semestre);
  }

  @Get('materias-profesores/:idMateria')
  async getMateriasYProfesores(@Param('idMateria') idMateria: number) {
    return await this.horariosService.obtenerMateriasYProfesoresPorMateria(idMateria);
  }


  @Post('generar-horarios')
  async generarHorarios(@Body() filtros: FiltrosHorariosDto) {
    return this.horariosService.generarHorarios(filtros);
  }
  

 
}
