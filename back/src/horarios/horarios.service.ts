import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Horario } from './entities/horario.entity';
import { Materia } from 'src/materias/entities/materia.entity';

import { CreateHorarioDto } from './dto/create-horario.dto';
import { FiltrosHorariosDto } from './dto/filtros-horario.dto';
import { MateriasService } from 'src/materias/materias.service';
import { ProfesoresService } from 'src/profesores/profesores.service';
import { Profesor } from 'src/profesores/entities/profesore.entity';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Profesor)
    private readonly profesorRepository: Repository<Profesor>,
    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,
    private readonly materiaService: MateriasService,
    private readonly profesorService: ProfesoresService,
  ) {}

  async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
    const horario = this.horarioRepository.create(createHorarioDto);
    horario.materia = await this.materiaService.findById(createHorarioDto.id_Materia);
    horario.profesor = await this.profesorService.findByid(createHorarioDto.id_Profesor);

    return await this.horarioRepository.save(horario);
  }

  async obtenerMateriasYProfesoresPorProfesor(idProfesor: number) {
    const horariosProfesor = await this.horarioRepository.find({
      where: {
        profesor: { id_profesor: idProfesor }
      },
      relations: ['materia'],
    });


    const materiasUnicas = new Map<number, string>();

    for (const horario of horariosProfesor) {
      if (horario.materia) {
        materiasUnicas.set(horario.materia.id_materia, horario.materia.nombre);
      }
    }

    const resultado: {
      materia: string;
      profesores: { id: number; nombre: string }[];
    }[] = [];

    for (const [idMateria, nombreMateria] of materiasUnicas.entries()) {
      const horariosMateria = await this.horarioRepository.find({
        where: {
          materia: { id_materia: idMateria }
        },
        relations: ['profesor'],
      });

      const profesoresSet = new Map<number, string>();

      for (const horario of horariosMateria) {
        if (horario.profesor) {
          profesoresSet.set(horario.profesor.id_profesor, horario.profesor.nombre);
        }
      }

      const profesoresArray = Array.from(profesoresSet.entries()).map(
        ([id, nombre]) => ({ id, nombre })
      );

      resultado.push({
        materia: nombreMateria,
        profesores: profesoresArray,
      });
    }

    return resultado;
  }

  async buscarPorSemestre(semestre: number): Promise<Horario[]> {
    return await this.horarioRepository.find({
      where: {
        materia: {
          semestre: semestre,
        },
      },
      relations: ['materia', 'profesor'],
    });
  }

  async delete() {
    return await this.horarioRepository.delete({});
  }

  async findAll(): Promise<Horario[]> {
    return this.horarioRepository.find({
      relations: ['materia', 'profesor'],
    });
  }

  async generarHorarios(filtros: FiltrosHorariosDto): Promise<Horario[][]> {
    const horarios = await this.horarioRepository.find({
      where: { materia: { semestre: filtros.semestre } },
      relations: ['materia', 'profesor'],
    });

    const materias = filtros.materiasObligatorias ?? [];

    const opcionesPorMateria = materias.map((id) =>
      horarios.filter(
        (h) =>
          h.materia?.id_materia === id &&
          (
            !filtros.profesoresPreferidos?.[id]?.length ||
            filtros.profesoresPreferidos[id].includes(h.profesor.id_profesor)
          )
      )
    );

    // Logs de depuración
    materias.forEach((id, idx) => {
      console.log(`Materia ID ${id} tiene ${opcionesPorMateria[idx].length} opciones`);
    });

    console.log(`Total de combinaciones posibles a revisar: ${opcionesPorMateria.reduce((acc, cur) => acc * cur.length, 1)}`);

    if (opcionesPorMateria.some((opciones) => opciones.length === 0)) {
      console.log('Al menos una materia no tiene opciones disponibles.');
      return [];
    }

    const resultados: Horario[][] = [];
    const ocupacion: Record<string, Set<number>> = {
      lunes: new Set(),
      martes: new Set(),
      miercoles: new Set(),
      jueves: new Set(),
      viernes: new Set(),
    };

    const backtrack = (nivel: number, camino: Horario[]) => {
      if (nivel === opcionesPorMateria.length) {
        resultados.push([...camino]);
        return;
      }

      for (const opcion of opcionesPorMateria[nivel]) {
        if (this.puedeAgregar(opcion, ocupacion, filtros)) {
          this.agregar(opcion, ocupacion);
          camino.push(opcion);

          backtrack(nivel + 1, camino);

          camino.pop();
          this.quitar(opcion, ocupacion);
        }
      }
    };

    backtrack(0, []);
    return resultados;
  }

  private puedeAgregar(horario: Horario, ocupacion: Record<string, Set<number>>, filtros: FiltrosHorariosDto): boolean {
    for (const dia of ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']) {
      const hora = horario[dia];
      if (hora && hora !== 0) {
        console.log(`${dia}: ${hora}`);

        if (
          ocupacion[dia].has(hora) ||
          ocupacion[dia].has(hora + 1)
        ) {
          console.log(`→ Conflicto con ocupación en ${dia} a las ${hora}`);
          return false;
        }

        if (
          filtros.bloquesLibres?.some(
            (b) => b.dia === dia && hora >= b.inicio && hora < b.fin
          )
        ) {
          console.log(`→ Conflicto con bloque libre en ${dia} a las ${hora}`);
          return false;
        }

        if (filtros.horaInicio && hora < filtros.horaInicio) {
          console.log(`→ Rechazado por ser antes de horaInicio (${filtros.horaInicio})`);
          return false;
        }

        if (filtros.horaFin && hora + 1 > filtros.horaFin) {
          console.log(`→ Rechazado por ser después de horaFin (${filtros.horaFin})`);
          return false;
        }
      }
    }
    return true;
  }

  private agregar(horario: Horario, ocupacion: Record<string, Set<number>>) {
    for (const dia of ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']) {
      const hora = horario[dia];
      if (hora && hora !== 0) {
        ocupacion[dia].add(hora);
        ocupacion[dia].add(hora + 1);
      }
    }
  }

  private quitar(horario: Horario, ocupacion: Record<string, Set<number>>) {
    for (const dia of ['lunes', 'martes', 'miercoles', 'jueves', 'viernes']) {
      const hora = horario[dia];
      if (hora && hora !== 0) {
        ocupacion[dia].delete(hora);
        ocupacion[dia].delete(hora + 1);
      }
    }
  }
}
