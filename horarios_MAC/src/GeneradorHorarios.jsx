import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./MostrarHorarios.css";

export function MuestraHorarios() {
  const location = useLocation();
  const filtros = location.state?.filtros;
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!filtros) {
      setError("No se proporcionaron filtros.");
      setLoading(false);
      return;
    }
    console.log("Filtros enviados:", filtros);
    axios
      .post("http://localhost:3000/horarios/generar-horarios", filtros)
      .then((response) => {
        console.log("Respuesta de la API:", response.data);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setHorarios(response.data); // Usamos toda la respuesta como horarios
        } else {
          setError("Formato de respuesta inválido.");
        } 
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al generar horarios:", error);
        setError("Hubo un problema al obtener los horarios.");
        setLoading(false);
      });
  }, [filtros]);

  // 👉 Función para guardar todos los horarios generados
  const guardarTodosLosHorarios = async () => {
    try {
      // Flatten para juntar todos los arreglos de clases en uno solo
      const todos = horarios.flat();
      const response = await axios.post("http://localhost:3000/horarios/guardarTodo", todos);
      alert("Todos los horarios fueron guardados correctamente.");
      console.log("Guardado:", response.data);
    } catch (error) {
      console.error("Error al guardar los horarios:", error);
      alert("Error al guardar los horarios.");
    }
  };

  if (loading) return <p>Cargando horarios...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="contenedor-horarios">
      <h1>Horarios Generados</h1>

      {horarios.length > 0 && (
        <button onClick={guardarTodosLosHorarios} className="boton-guardar-todos">
          Guardar todos los horarios
        </button>
      )}

      {horarios.length === 0 ? (
        <p>No se han generado horarios para los filtros seleccionados.</p>
      ) : (
        horarios.map((horario, index) => (
          <div key={index} className="horario-card">
            <h2>Horario {index + 1}</h2>
            <table className="tabla-horario">
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Grupo</th>
                  <th>Profesor</th>
                  <th>Lunes</th>
                  <th>Martes</th>
                  <th>Miércoles</th>
                  <th>Jueves</th>
                  <th>Viernes</th>
                </tr>
              </thead>
              <tbody>
                {/* Verifica si el objeto horario tiene clases asignadas */}
                {horario.map((clase) => (
                  <tr key={clase.id_horario}>
                    <td>{clase.materia?.nombre || "Sin materia"}</td>
                    <td>{clase.grupo || "Sin grupo"}</td>
                    <td>{clase.profesor?.nombre || "Sin profesor"}</td>
                    <td>{clase.lunes === 0 ? "-" : `${clase.lunes}:00 - ${clase.lunes + 2}:00`}</td>
                    <td>{clase.martes === 0 ? "-" : `${clase.martes}:00 - ${clase.martes + 2}:00`}</td>
                    <td>{clase.miercoles === 0 ? "-" : `${clase.miercoles}:00 - ${clase.miercoles + 2}:00`}</td>
                    <td>{clase.jueves === 0 ? "-" : `${clase.jueves}:00 - ${clase.jueves + 2}:00`}</td>
                    <td>{clase.viernes === 0 ? "-" : `${clase.viernes}:00 - ${clase.viernes + 2}:00`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}
