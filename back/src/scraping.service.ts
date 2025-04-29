import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { ProfesoresService } from './profesores/profesores.service';
import { MateriasService } from './materias/materias.service';
import { HorariosService } from './horarios/horarios.service';

@Injectable()
export class ScrapingService {
  private readonly url = 'https://escolares.acatlan.unam.mx/HISTORIA/ProcesoGRUpoSISaturacionORDINArioAlumno.asp';
  private readonly headers = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    "Accept-Language": "es-ES,es;q=0.5",
    "Cache-Control": "max-age=0",
    "Upgrade-Insecure-Requests": "1"
  };
  private readonly cookies= 'ASPSESSIONIDAUCQBAAB=JIHFJGCDHANPNEGEALLOMFDN; ASPSESSIONIDSEASDDDD=KLECICPDMIALHEMOFPJEDBPM; ASPSESSIONIDAUBSADAA=KEDIKGDAALGGIFFKCHPAEADA; ASPSESSIONIDQGBTDCCD=KGLOKCABHKHBLJLOHOLABDNL; ASPSESSIONIDCUDTDABA=KLHJJOMBHHKCLAPNKMOOOGEM; ASPSESSIONIDAWBRBDAA=PIDOFFADPEECMCNBFGDMAOJG; ASPSESSIONIDQGQBDAAB=OJPLILDAGHGKLBPHIINKMLFI';


  constructor(
    private readonly profesorService: ProfesoresService,
    private readonly materiaService: MateriasService,
    private readonly horarioService: HorariosService,
  ) {}

  async executeScrapingAndSave(): Promise<void> {
    try {
      const response = await axios.get(this.url, {
        headers: {
          ...this.headers,
          Cookie: this.cookies,
        }
      });

      const $ = cheerio.load(response.data);
      const rows = $('table tr');
      const scrapedData: any[] = [];
      let currentSemestre = 0;
      let currentGrupo = '';

      // Primera pasada: recolectar todos los datos
      rows.each((i, row) => {
        const cells = $(row).find('td, th');
        const values = cells.map((_, el) => $(el).text().trim()).get();

        if (values.length > 0) {
          scrapedData.push(values);
        }
      });

      // Segunda pasada: procesar los datos
      for (const item of scrapedData) {
        // Procesar información de semestre y grupo
        if (item.length === 3 && item[1].startsWith('SEMESTRE:')) {
          currentSemestre = parseInt(item[1].split(':')[1].trim());
          currentGrupo = item[2].split(':')[1].trim();
          continue;
        }

        // Procesar información de materia, horario y profesor
        if (item.length >= 6 && item[0] === '' && !isNaN(parseInt(item[1]))) {
          const idMateria = parseInt(item[1]);
          const nombreMateria = item[2];
          const horarioStr = item[3];
          const nombreProfesor = item[4];

          // Extraer información del profesor
          const profesorId = await this.processProfesor(nombreProfesor);
          
          // Extraer información de la materia
          const materiaId = await this.processMateria(idMateria, nombreMateria, currentSemestre);
          
          // Extraer información del horario
          await this.processHorario(horarioStr, currentGrupo, materiaId, profesorId.id);
        }
      }

      console.log('Scraping y guardado completados exitosamente');
    } catch (error) {
      console.error('Error en el scraping:', error.message);
      throw new Error('Error al realizar el scraping');
    }
  }

  private async processProfesor(nombreCompleto: string): Promise<{id: number, isNew: boolean}> {
    // Limpiar el nombre (eliminar títulos y espacios extras)
    const nombreLimpio = nombreCompleto
      .replace(/INF\.en JEFA\./i, '') // Eliminar título profesional
      .trim() // Eliminar espacios al inicio y final
      .replace(/\s+/g, ' '); // Reemplazar múltiples espacios por uno solo

    // Buscar profesor existente por nombre COMPLETO exacto
    const profesores = await this.profesorService.findAll();
    const profesorExistente = profesores.find(p => 
      p.nombre.trim().toLowerCase() === nombreLimpio.toLowerCase()
    );

    if (profesorExistente) {
      return { id: profesorExistente.id_profesor, isNew: false };
    }

    // Crear nuevo profesor si no existe
    const nuevoId = await this.generateNewId('profesor');
    await this.profesorService.create({
      id_profesor: nuevoId,
      nombre: nombreLimpio // Guardamos el nombre normalizado
    });

    return { id: nuevoId, isNew: true };
}

  private async processMateria(idMateria: number, nombreMateria: string, semestre: number): Promise<number> {
    // Verificar si la materia ya existe
    try {
      const materiaExistente = await this.materiaService.findById(idMateria);
      return materiaExistente.id_materia;
    } catch (e) {
      // Materia no existe, crearla
      const nuevaMateria = await this.materiaService.create({
        id_materia: idMateria,
        nombre: nombreMateria,
        semestre: semestre
      });
      
      return nuevaMateria.id_materia;
    }
  }

  private async processHorario(horarioStr: string, grupo: string, materiaId: number, profesorId: number): Promise<void> {
    const horarioData = this.parseHorario(horarioStr);
    
    await this.horarioService.create({
      id_horario: await this.generateNewId('horario'),
      lunes: horarioData.lunes,
      martes: horarioData.martes,
      miercoles: horarioData.miercoles,
      jueves: horarioData.jueves,
      viernes: horarioData.viernes,
      grupo: grupo,
      id_Materia: materiaId,
      id_Profesor: profesorId
    });
  }

  private parseHorario(horarioStr: string): any {
    const horario = {
        lunes: 0,
        martes: 0,
        miercoles: 0,
        jueves: 0,
        viernes: 0
    };

    // Dividir por la conjunción "y" para manejar múltiples bloques horarios
    const bloques = horarioStr.split(' y ');
    
    for (const bloque of bloques) {
        const partes = bloque.split(' ');
        
        // Extraer días y hora
        const diasStr = partes[0];
        const horaInicio = parseInt(partes[1].split(':')[0]);
        
        // Separar días individuales (pueden venir como "LU" o "MI,VI")
        const dias = diasStr.split(',');
        
        for (const dia of dias) {
            switch (dia) {
                case 'LU':
                    if (horario.lunes === 0) horario.lunes = horaInicio;
                    break;
                case 'MA':
                    if (horario.martes === 0) horario.martes = horaInicio;
                    break;
                case 'MI':
                    if (horario.miercoles === 0) horario.miercoles = horaInicio;
                    break;
                case 'JU':
                    if (horario.jueves === 0) horario.jueves = horaInicio;
                    break;
                case 'VI':
                    if (horario.viernes === 0) horario.viernes = horaInicio;
                    break;
            }
        }
    }
    
    return horario;
}

  private async generateNewId(tipo: 'profesor' | 'horario'): Promise<number> {
    // Implementación básica - deberías mejorarla según tu necesidad
    if (tipo === 'profesor') {
      const profesores = await this.profesorService.findAll();
      return profesores.length > 0 ? Math.max(...profesores.map(p => p.id_profesor)) + 1 : 1;
    } else {
      const horarios = await this.horarioService.findAll();
      return horarios.length > 0 ? Math.max(...horarios.map(h => h.id_horario)) + 1 : 1;
    }
  }
}