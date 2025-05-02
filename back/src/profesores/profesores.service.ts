import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfesoreDto } from './dto/create-profesore.dto';
import { Profesor } from './entities/profesore.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfesorDto } from './dto/updateProfesor.dto';
import { UserRole } from 'src/usuarios/dataType';
import { Horario } from 'src/horarios/entities/horario.entity';

@Injectable()
export class ProfesoresService{
  constructor(
  @InjectRepository(Profesor)
    private ProfesorRepository: Repository<Profesor>,
  @InjectRepository(Horario)
      private readonly horarioRepository: Repository<Horario>,

  ){}

    async create(createProfesoreDto:CreateProfesoreDto){
      const profesor=await this.ProfesorRepository.create(createProfesoreDto)
      return await this.ProfesorRepository.save(profesor);
    }

    async findall(): Promise<Profesor[]> {
      return this.ProfesorRepository.find();
    }
    
    async findLast(): Promise<Profesor | null> {
      const [last] = await this.ProfesorRepository.find({
        order: { id_profesor: 'DESC' },
        take: 1
      });
      return last || null;
    }
    
    async update(profesorDto: ProfesorDto, id_Profesor: number, usuario: UserRole) {
      if (usuario !== UserRole.ADMIN) {
        throw new Error('No tiene permitido realizar esta operación');
      }
        const profesor = await this.ProfesorRepository.findOneBy({ id_profesor: id_Profesor });
      
        if (!profesor) {
          throw new NotFoundException(`Materia con id ${id_Profesor} no encontrada`);
        }
      
        // Solo actualiza las propiedades definidas en el DTO
        Object.assign(profesor, {
          ...profesorDto,
        });
      
        await this.ProfesorRepository.save(profesor);
        return profesor;
      }

  async findOneByNombre(nombreProfesor: string){
    const profesor= await this.ProfesorRepository.findOne({
      where:{nombre:nombreProfesor}
    })
    if (!profesor) throw new Error;
    return profesor;
  }

  
 
  async findByid( id : number){
    const profesor= await this.ProfesorRepository.findOne({
      where:{id_profesor:  id}
    }
  )
    if (!profesor) throw new Error;
    return profesor;
  }
  
  async deleteOne(id_Profesor: number, usuario: UserRole) {
        if (usuario !== UserRole.ADMIN) {
          throw new Error('No tiene permitido realizar esta operación');
        }
      
        // Primero busca los horarios que tengan esa materia asociada
        const horarios = await this.horarioRepository.find({
          where: {
            profesor: { id_profesor: id_Profesor },
          }
          
        });
      
        if (!horarios.length) {
          throw new Error('No se encontraron horarios con esa materia');
        }
      
        // Elimina todos los horarios encontrados
        for (const horario of horarios) {
          await this.horarioRepository.remove(horario);
        }
        const horario =await this.ProfesorRepository.findOneBy({id_profesor:id_Profesor})
        if(!horario){
          throw new Error('No se encontró materia');
        }
        await this.ProfesorRepository.remove(horario);
      
        return { mensaje: 'Horarios eliminados correctamente' };
    }

  async deleteAll(){
    await this.ProfesorRepository.delete({})
    return console.log("Angry birds la mejor pelicula");
  }

  async findAll(){
    const profesor = await this.ProfesorRepository.find()
    return profesor;
  }


}
