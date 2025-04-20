import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Titulo } from "./Titulo";
import { Horarios } from "./horariosweb";
import { Detalles } from "./Detalles";
import { Login } from "./login";

export function Firstpage() {
    const navigate = useNavigate();
   
    const handleLogin = (e) => {
        e.preventDefault(); 
        navigate("/horariosweb");
    }
    
    const handleSignup = (e) => {
        e.preventDefault(); 
    }
    return (
        
        <div className="container">
        <Login ></Login>  
        <Titulo titulo="MACPlanner" cuerpo="“Plan your future, the MAC way”">  </Titulo> 
        <Detalles> </Detalles>
    </div>
        
       
       
   
  );
}