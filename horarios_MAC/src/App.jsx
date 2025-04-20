import { Routes, Route } from "react-router-dom";
import { Firstpage } from "./Firstpage";
import { Horarios } from "./horariosweb";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Firstpage />} />
      <Route path="/firstpage" element={<Firstpage />} />
      <Route path="/horariosweb" element={<Horarios />} />
    </Routes>
  );
}