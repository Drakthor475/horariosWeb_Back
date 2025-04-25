import { Module } from '@nestjs/common';
import { ProfesoresService } from './profesores.service';
import { ProfesoresController } from './profesores.controller';
import { HorariosService } from 'src/horarios/horarios.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horario } from 'src/horarios/entities/horario.entity';
import { Profesor } from './entities/profesore.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Horario,Profesor])],
  controllers: [ProfesoresController],
  providers: [ProfesoresService],
  exports:[ProfesoresModule, ProfesoresService]
})
export class ProfesoresModule {}
