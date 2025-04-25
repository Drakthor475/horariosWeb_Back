import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, InternalServerErrorException } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { FiltrosHorariosDto } from './dto/filtros-horario.dto';



@Controller('horarios')
export class HorariosController {
  constructor(private readonly horariosService: HorariosService) {}

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
    return await this.horariosService.delete();
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
    return await this.horariosService.obtenerMateriasYProfesoresPorProfesor(idMateria);
  }


  @Post('generar-horarios')
  async generarHorarios(@Body() filtros: FiltrosHorariosDto) {
    return this.horariosService.generarHorarios(filtros);
  }
  

 
}
