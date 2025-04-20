import React from "react";
import { Tarjeta } from "./Tarjeta"; // asegúrate de tener bien la ruta

export function Horarios() {
  return (
    <div className="container">

    
    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <Tarjeta titulo="Consultar materias y maestros:" boton="Buscar">
        <label htmlFor="semestre">Semestre</label>
        <select style={{ width: "200px", height: "50px", fontSize: "20px" }}>
          <option value="">-- Selecciona --</option>
          <option value="1">--1° Semestre</option>
          <option value="2">--2° Semestre</option>
          <option value="3">--3° Semestre</option>
          <option value="4">--4° Semestre</option>
          <option value="5">--5° Semestre</option>
          <option value="6">--6° Semestre</option>
          <option value="7">--7° Semestre</option>
          <option value="8">--8° Semestre</option>
        </select>
       
      </Tarjeta>

      <Tarjeta titulo="Genera un horario" boton="Generar">
        

      </Tarjeta>
      <Tarjeta titulo="Imprime tu horario" boton="Imprimir">
        

      </Tarjeta>
      </div>

    </div>
  );
}
