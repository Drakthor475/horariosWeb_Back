import React, { useState, useEffect } from "react";
import { Tarjeta } from "./Tarjeta"; 
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { HorarioSemestre } from "./horariosSemestre";
import { FormularioHorario } from "./Formulario";

export function Horarios() {
  const navigate = useNavigate();
  const [semestre, setSemestre] = useState('');
  const [horarios, setHorarios] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const obtenerHorarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/horarios/findAll');
      console.log(response.data);
      setHorarios(response.data);
    } catch (error) {
      console.error('Error al obtener horarios:', error);
    }
  };

  const handleBuscar = async () => {
    const semestreNum = parseInt(semestre);
  
    if (isNaN(semestreNum)) {
      const mensaje = "Selecciona un semestre válido.";
      alert(mensaje);
      setMensaje(mensaje);
      setHorarios([]);
      return;
    }
  
    if (semestreNum % 2 !== 0) {
      const mensaje = 'No hay horarios disponibles para semestres impares.';
      alert(mensaje);
      setMensaje(mensaje);
      setHorarios([]);
      return;
    }
  
    setMensaje('');
  
    try {
      const response = await axios.get(`http://localhost:3000/horarios/por-semestre/${semestreNum}`);
      setHorarios(response.data);
    
      if (response.data.length > 0) {
        navigate('/HorariosSemestre', { state: { horarios: response.data } }); // ✅ Pasamos el estado aquí
      }
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      setMensaje('No se pudieron obtener los horarios.');
      alert('No se pudieron obtener los horarios.');
    }
  };

  useEffect(() => {
    obtenerHorarios();
  }, []);
  
  const handleGenerar= async () => {
    
    navigate("/Formulario")
  }
  
  return (
    <div className="container">
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <Tarjeta titulo="Consultar materias y maestros:" onClick={handleBuscar} textoBoton="Buscar">
          <label htmlFor="semestre">Semestre</label>
          <select 
            value={semestre}
            onChange={(e) => setSemestre(e.target.value)}
            style={{ width: "200px", height: "50px", fontSize: "20px" }}
          >
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

        <Tarjeta titulo="Genera un horario" onClick={(handleGenerar)} textoBoton="Generar" />
        <Tarjeta titulo="Imprime tu horario" onClick={() => {}} textoBoton="Imprimir" />
      </div>
    </div>
  );
}
