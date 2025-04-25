import { Injectable } from '@nestjs/common';
import { CreateProfesoreDto } from './dto/create-profesore.dto';
import { Profesor } from './entities/profesore.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfesoresService{
  constructor(
  @InjectRepository(Profesor)
    private ProfesorRepository: Repository<Profesor>
  ){}

    async create(createProfesoreDto:CreateProfesoreDto){
      const profesor=await this.ProfesorRepository.create(createProfesoreDto)
      return await this.ProfesorRepository.save(profesor);
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
  
  async deleteAll(){
    await this.ProfesorRepository.delete({})
    return console.log("Angry birds la mejor pelicula");
  }

  async findAll(){
    const profesor = await this.ProfesorRepository.find()
    return profesor;
  }


}
