import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Put } from '@nestjs/common';
import { MateriasService } from './materias.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UserRole } from 'src/usuarios/dataType';
import { MateriaDto } from './dto/updateMateria.dto';
import { Materia } from './entities/materia.entity';


@Controller('materias')
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Post()
  create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiasService.create(createMateriaDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() materiaDto: MateriaDto,
  ): Promise<Materia> {
    return this.materiasService.update(materiaDto, id);
  }

  

  @Get()
  findOneByNombre(@Body() nombreMateria:string) {
    return this.materiasService.findOneByNombre(nombreMateria);
  }

  @Post('guardarTodo')
  async saveAll(@Body() createMateriaDto: CreateMateriaDto[]){
  for(let i=0; i<createMateriaDto.length; i++){
    await this.materiasService.create(createMateriaDto[i]);
  }
  return console.log("Se guardó con exito");
  }

  @Delete('delete')
  async deleteMateria(@Body()id_Materia:number, usuario:UserRole){
    return this.materiasService.deleteOne(id_Materia, usuario);
  }

  @Delete('deleteAll')
  async deleteAll(){
    return this.materiasService.delete();
  }

  @Post('findBySemestre')
  findBySemestre(@Body() body: { semestreMateria: number }) {
    return this.materiasService.findBySemestre(body.semestreMateria);
  }
  
  @Get('finById')
  finById(@Body()idMat:number){
    return this.materiasService.findById(idMat);
  }

  @Get('findAll')
  findAll(){
    return this.materiasService.findAll();

  }


}

