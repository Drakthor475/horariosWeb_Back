import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FormularioGenerar.css";

export function FormularioHorario() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      semestre: 1,
      materiasObligatorias: [],
      profesoresPreferidos: {},
      bloquesLibres: [],
      horaInicio: undefined,
      horaFin: undefined,
    },
  });

  const [materias, setMaterias] = useState([]);
  const [profesoresPorMateria, setProfesoresPorMateria] = useState({});
  const semestreSeleccionado = watch("semestre");
  const materiasSeleccionadas = watch("materiasObligatorias");

  const { fields: bloquesLibresFields, append: appendBloqueLibre } =
    useFieldArray({
      control,
      name: "bloquesLibres",
    });

  const toggleMateriaSeleccionada = (id) => {
    const actuales = watch("materiasObligatorias") || [];
    if (actuales.includes(id)) {
      setValue(
        "materiasObligatorias",
        actuales.filter((m) => m !== id)
      );
    } else {
      setValue("materiasObligatorias", [...actuales, id]);
    }
  };

  useEffect(() => {
    if (semestreSeleccionado) {
      setValue("materiasObligatorias", []);
      setValue("profesoresPreferidos", {});
      setProfesoresPorMateria({});

      axios
        .post("http://localhost:3000/materias/findBySemestre", {
          semestreMateria: parseInt(semestreSeleccionado),
        })
        .then((response) => setMaterias(response.data))
        .catch((error) =>
          console.error("Error al obtener materias:", error)
        );
    }
  }, [semestreSeleccionado]);

  useEffect(() => {
    const obtenerProfesores = async () => {
      const nuevosProfesores = {};
      for (const idMateria of materiasSeleccionadas || []) {
        if (!profesoresPorMateria[idMateria]) {
          try {
            const res = await axios.get(
              `http://localhost:3000/horarios/materias-profesores/${idMateria}`
            );
            const entrada = Array.isArray(res.data) ? res.data[0] : res.data;
            nuevosProfesores[idMateria] = entrada?.profesores || [];
          } catch (err) {
            console.error(
              `Error al obtener profesores para materia ${idMateria}:`,
              err
            );
            nuevosProfesores[idMateria] = [];
          }
        }
      }
      setProfesoresPorMateria((prev) => ({ ...prev, ...nuevosProfesores }));
    };

    obtenerProfesores();
  }, [materiasSeleccionadas]);

  const onSubmit = (data, e) => {
    e.preventDefault();

    const filtros = {
      semestre: Number(data.semestre),
      materiasObligatorias: data.materiasObligatorias.map(Number),
      profesoresPreferidos: Object.fromEntries(
        Object.entries(data.profesoresPreferidos).map(([key, value]) => [
          Number(key),
          value.map(Number),
        ])
      ),
      bloquesLibres: data.bloquesLibres.map((bloque) => ({
        dia: bloque.dia,
        inicio: Number(bloque.inicio),
        fin: Number(bloque.fin),
      })),
      horaInicio: data.horaInicio ? Number(data.horaInicio) : undefined,
      horaFin: data.horaFin ? Number(data.horaFin) : undefined,
    };

    navigate("/GeneradorHorarios", { state: { filtros } });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="tabla-formulario">
      <h2>Formulario de Horarios</h2>

      <div>
        <label>Semestre:</label>
        <select {...register("semestre", { required: true })}>
          <option value="">Seleccionar</option>
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Materias obligatorias:</label>
        {Array.isArray(materias) &&
          materias.map((materia) => (
            <div key={materia.id_materia} style={{ marginBottom: "1rem" }}>
             <strong style={{ color: "black" }}>{materia.nombre}</strong>
              <div>
                <input
                  type="checkbox"
                  checked={
                    materiasSeleccionadas?.includes(materia.id_materia) || false
                  }
                  onChange={() => toggleMateriaSeleccionada(materia.id_materia)}
                />
              </div>
            </div>
          ))}
      </div>

      {materiasSeleccionadas?.map((id) => {
        const materia = materias.find((m) => m.id_materia === parseInt(id));
        const profesores = profesoresPorMateria[id] || [];

        return (
          <div key={id}>
            <label>Profesores preferidos para {materia?.nombre}:</label>
            <select multiple {...register(`profesoresPreferidos.${id}`)}>
              {profesores.length > 0 ? (
                profesores.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nombre}
                  </option>
                ))
              ) : (
                <option disabled>No hay profesores disponibles</option>
              )}
            </select>
          </div>
        );
      })}

      <div>
        <label>Bloques libres:</label>
        {bloquesLibresFields.map((field, index) => (
          <div key={field.id} className="fila-bloque">
            <select
              {...register(`bloquesLibres.${index}.dia`)}
              defaultValue=""
            >
              <option value="" disabled>Selecciona un día</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
            </select>
            <input
              type="number"
              placeholder="Inicio (7-22)"
              min="7"
              max="22"
              {...register(`bloquesLibres.${index}.inicio`)}
            />
            <input
              type="number"
              placeholder="Fin (7-22)"
              min="7"
              max="22"
              {...register(`bloquesLibres.${index}.fin`)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => appendBloqueLibre({ dia: "", inicio: 7, fin: 9 })}
        >
          Añadir bloque libre
        </button>
      </div>

      <div>
        <label>Hora inicio (global):</label>
        <input
          type="number"
          min="7"
          max="22"
          placeholder="Hora inicio"
          {...register("horaInicio", { required: true })}
        />
      </div>

      <div>
        <label>Hora fin (global):</label>
        <input
          type="number"
          min="7"
          max="22"
          placeholder="Hora fin"
          {...register("horaFin", { required: true })}
        />
      </div>

      <button type="submit" className="btn-primary">Enviar</button>
    </form>
  );
}
