import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { CreateProfesoreDto } from './dto/create-profesore.dto';


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


  @Get('findOneByNombre')
  findOneByNombre(@Body() nombreProfesor: string) {
    return this.profesoresService.findOneByNombre(nombreProfesor);
  }

  @Get('findOneByid')
  findOneByid(@Body() id : number) {
    return this.profesoresService.findByid(id);
  }
}
