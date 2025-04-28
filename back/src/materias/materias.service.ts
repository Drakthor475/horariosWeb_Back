import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { Materia } from './entities/materia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horario } from 'src/horarios/entities/horario.entity';
import { UserRole } from 'src/usuarios/dataType';


@Injectable()
export class MateriasService {
  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>,
    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,
  ){

  }
    async create(createMateriaDto:CreateMateriaDto){
      const materia=this.materiaRepository.create({id_materia:createMateriaDto.id_materia, nombre:createMateriaDto.nombre,semestre:createMateriaDto.semestre})
      console.log('se creo matria con el id: ',)
      return await this.materiaRepository.save(materia);
    }
    
    async deleteOne(id_Materia:number, usuario:UserRole){
      if(usuario!=UserRole.ADMIN){
        throw new Error('No tiene permitido realizar esta operación')
      }
      
      const result = await this.horarioRepository.find({
        where:{
          materia:{
            id_materia:id_Materia
          }
        },
        relations: ['materia']
    
      })

      if(result){
        throw new Error('Esta materia pertenece a horarios, borra los horarios antes')
      
      }
      return await this.materiaRepository.delete(id_Materia)
    }

    async delete(){
      return await this.materiaRepository.delete({})
    }

  async findOneByNombre(nombreMateria:string) {
    const materia= await this.materiaRepository.findOne({
      where:{nombre:nombreMateria}
    })
    if (!materia) throw new Error;
    return materia;
  }
 
  async findBySemestre( semestreMateria:number){
    const semestre= await this.materiaRepository.find({
      where:{semestre:semestreMateria}
    })
    if (!semestre) throw new Error;
    return semestre; 
  }

  async update(id: number, newId: number){
    const materia = await this.materiaRepository.findOneBy({ id_materia: id });

    if (!materia) {
      throw new NotFoundException(`Materia con id ${id} no encontrada`);
    }

    // Crea una nueva materia copiando todo y cambiando el ID
    const nuevaMateria = { ...materia, id_materia: newId };

    // Guarda la nueva materia
    await this.materiaRepository.save(nuevaMateria);

    // Elimina la materia vieja
    await this.materiaRepository.delete(id);

    return nuevaMateria;
  }
  
  async findById(id: number): Promise<Materia> {
    try {
      const materia = await this.materiaRepository.findOne({ where: { id_materia: id } });
      if (!materia) {
        throw new Error(`Materia con id ${id} no encontrada`);
      }
      return materia;
    } catch (error) {
      console.error(`Error buscando materia ${id}:`, error);
      throw new Error(`Error buscando materia ${id}: ${error.message || error}`);
    }
  }
  
  
  async findAll(){
    const materias = await this.materiaRepository.find()
    return materias;
  }


}
