import { Module } from '@nestjs/common';
import { HorariosService } from './horarios.service';
import { HorariosController } from './horarios.controller';
import { Materia } from 'src/materias/entities/materia.entity';
import { Profesor } from 'src/profesores/entities/profesore.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horario } from './entities/horario.entity';
import { MateriasModule } from 'src/materias/materias.module';
import { ProfesoresModule } from 'src/profesores/profesores.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([Materia,Profesor,Horario]),
      MateriasModule,
      ProfesoresModule,
  ],
  controllers: [HorariosController],
  providers: [HorariosService],
  exports:[HorariosModule, TypeOrmModule]
})
export class HorariosModule {}
