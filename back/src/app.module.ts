import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MateriasModule } from './materias/materias.module';
import { ProfesoresModule } from './profesores/profesores.module';
import { HorariosModule } from './horarios/horarios.module';
import { ScrapingService } from './scraping.service';
import { MateriasService } from './materias/materias.service';
import { HorariosService } from './horarios/horarios.service';
import { ProfesoresService } from './profesores/profesores.service';
import { JwtModule } from '@nestjs/jwt';




@Module({
  imports: [

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'sistema_Horarios', // nombre del archivo de SQLite (puedes cambiarlo si quieres)
      synchronize: true,           // sincroniza automáticamente las entidades con la base de datos
      dropSchema: false,           // mantiene los datos al reiniciar (útil durante desarrollo)
      autoLoadEntities: true,      // sigue cargando automáticamente las entidades
      // logging: true,            // puedes descomentar si quieres ver logs SQL
    }),

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }, // opcional
    }),

    UsuariosModule,

    MateriasModule,

    ProfesoresModule,

    HorariosModule,

    
  ],
  controllers: [AppController],
  providers: [AppService, ScrapingService, MateriasService, ProfesoresService, HorariosService],
})
export class AppModule {}
