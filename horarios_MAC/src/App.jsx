import { Routes, Route } from "react-router-dom";
import { Firstpage } from "./Firstpage";
import { Horarios } from "./horariosweb";
import { HorarioSemestre } from "./horariosSemestre";
import {  FormularioHorario } from "./Formulario";
import { MuestraHorarios } from "./GeneradorHorarios";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Firstpage />} />
      <Route path="/firstpage" element={<Firstpage />} />
      <Route path="/horariosweb" element={<Horarios />} />
      <Route path="/HorariosSemestre" element={<HorarioSemestre/>}/>
      <Route path="/Formulario" element={<FormularioHorario/>}/>
      <Route path="/GeneradorHorarios" element={<MuestraHorarios/>}/>
    </Routes>
  );
  
}