import { Module } from '@nestjs/common';
import { MateriasService } from './materias.service';
import { MateriasController } from './materias.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horario } from 'src/horarios/entities/horario.entity';
import { Materia } from './entities/materia.entity';


@Module({
  imports:[TypeOrmModule.forFeature([Horario,Materia])],
  controllers: [MateriasController],
  providers: [MateriasService],
  exports:[MateriasModule, TypeOrmModule, MateriasService]
  
})
export class MateriasModule {}
