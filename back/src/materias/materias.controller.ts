import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Put, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { MateriasService } from './materias.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UserRole } from 'src/usuarios/dataType';
import { MateriaDto } from './dto/updateMateria.dto';
import { Materia } from './entities/materia.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('materias')
export class MateriasController {
  constructor(private readonly materiasService: MateriasService) {}

  @Post()
  create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiasService.create(createMateriaDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard) // Protege esta ruta con el JWT Auth Guard
  async update(
    @Param('id') idMateria: number, // Parametro que representa el id de la materia
    @Body() materiaDto: MateriaDto, // El DTO con los datos que se quieren actualizar
    @Req() req: any, // Requiere el JWT, donde req.user contendrá el payload decodificado
  ) {
    const usuario = req.user; // Usuario extraído del JWT (validado por JwtAuthGuard)

    if (usuario.nivelUsuario !== UserRole.ADMIN) {
      throw new UnauthorizedException('No tiene permitido realizar esta operación');
    }

    // Llamamos al servicio para realizar la actualización
    const updatedMateria = await this.materiasService.update(materiaDto, idMateria, usuario.nivelUsuario);
    return updatedMateria; // Retorna la materia actualizada
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async eliminarMateria(
    @Param('id') idMateria: number,
    @Req() req: any, // req.user contiene lo decodificado del JWT
  ) {
    console.log(req.user); // aquí estará el nivelUsuario, id, etc.
    return this.materiasService.deleteOne(idMateria, req.user.nivelUsuario);
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

