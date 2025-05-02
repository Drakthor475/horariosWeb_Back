import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { Materia } from './entities/materia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Horario } from 'src/horarios/entities/horario.entity';
import { UserRole } from 'src/usuarios/dataType';
import { MateriaDto } from './dto/updateMateria.dto';


@Injectable()
export class MateriasService {
  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>,
    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,
  ){

  }
  async create(createMateriaDto: CreateMateriaDto) {
    // Si el cliente proporcionó un id_materia
    if (createMateriaDto.id_materia) {
      const existente = await this.materiaRepository.findOne({
        where: { id_materia: createMateriaDto.id_materia },
      });
  
      if (existente) {
        throw new Error('Ya existe una materia con ese ID');
      }
    }
  
    const materia = this.materiaRepository.create(
      createMateriaDto
    );
  
    console.log('Se creó materia con el ID:', createMateriaDto.id_materia);
    return await this.materiaRepository.save(materia);
  }
  
    
    async deleteOne(id_Materia: number, usuario: UserRole) {
      if (usuario !== UserRole.ADMIN) {
        throw new Error('No tiene permitido realizar esta operación');
      }
    
      // Primero busca los horarios que tengan esa materia asociada
      const horarios = await this.horarioRepository.find({
        where: {
          materia: { id_materia: id_Materia },
        },
        relations: ['materia'],
      });
    
      if (!horarios.length) {
        throw new Error('No se encontraron horarios con esa materia');
      }
    
      // Elimina todos los horarios encontrados
      for (const horario of horarios) {
        await this.horarioRepository.remove(horario);
      }
      const materia =await this.materiaRepository.findOneBy({id_materia:id_Materia})
      if(!materia){
        throw new Error('No se encontró materia');
      }
      await this.materiaRepository.remove(materia);
    
      return { mensaje: 'Horarios eliminados correctamente' };
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
 
  async findBySemestre( semestreMateria:number, ){
    const semestre= await this.materiaRepository.find({
      where:{semestre:semestreMateria}
    })
    if (!semestre) throw new Error;
    return semestre; 
  }

  async update(materiaDto: MateriaDto, id_Materia: number, usuario: UserRole) {
    if (usuario !== UserRole.ADMIN) {
      throw new Error('No tiene permitido realizar esta operación');
    }
    const materia = await this.materiaRepository.findOneBy({ id_materia: id_Materia });
  
    if (!materia) {
      throw new NotFoundException(`Materia con id ${id_Materia} no encontrada`);
    }

    if (
      materiaDto.id_materia &&
      materiaDto.id_materia !== id_Materia
    ) {
      const materiaExistente = await this.materiaRepository.findOneBy({ id_materia: materiaDto.id_materia });
      if (materiaExistente) {
        throw new Error(`Ya existe una materia con el id ${materiaDto.id_materia}`);
      }
    }
  
    // Solo actualiza las propiedades definidas en el DTO
    Object.assign(materia, {
      ...materiaDto,
    });
  
    await this.materiaRepository.save(materia);
    return materia;
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
