import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { MateriasService } from './materias.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UserRole } from 'src/usuarios/dataType';


@Controller('materias')
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Post()
  create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiasService.create(createMateriaDto);
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

  @Patch('change-id/:oldId')
  async changeId(
    @Param('oldId') oldId: number,
    @Body('newId') newId: number,
  ) {
    return this.materiasService.update(oldId, newId);
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

