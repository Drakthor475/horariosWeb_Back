import React from "react";
import styled from "styled-components";
export function Tarjeta ({titulo,children,boton}) {
  const StyleCard= styled.div`
  .form{
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-left: 2em;
    padding-right: 2em;
    padding-bottom: 0.4em;
    background-color: #171717;
    border-radius: 25px;
    transition: 0.4s ease-in-out;
    width: 200px;
    height: 350px;  
  }
  
  .card {
    background-image: linear-gradient(163deg, #00ff75 0%, #3700ff 100%);
    border-radius: 10px;
    width: 250px;
    height: 350px;
    transition: all 0.3s;
    margin-left: 100px;
    margin-top: 120px;
  
  }
  
  .card2 {
    border-radius: 0;
    transition: all 0.2s;
  }
  
  .card2:hover {
    transform: scale(0.98);
    border-radius: 20px;
  }
  
  .card:hover {
    box-shadow: 0px 0px 30px 1px rgba(0, 255, 117, 0.3);
  }
  
   #heading {
    
    margin: 1.0em;
    color: rgb(255, 255, 255);
    font-size: 1.9em;
    width: 10px;
    
  }
  .form label {
    color: white;
    font-size: 1.6em;
    margin-top:-40px ;
  }
  /* From Uiverse.io by nima-mollazadeh */ 
  .button {
    position: relative;
    text-decoration: none;
    color: #fff;
    background: linear-gradient(45deg, #0ce39a, #69007f, #fc0987);
    padding: 14px 25px;
    border-radius: 10px;
    font-size: 1.25em;
    cursor: pointer;
  margin-top: 10px;
  }
  
  .button span {
    position: relative;
    z-index: 1;
  }
  
  .button::before {
    content: "";
    position: absolute;
    inset: 1px;
    background: #272727;
    border-radius: 9px;
    transition: 0.5s;
  }
  
  .button:hover::before {
    opacity: 0.7;
  }
  
  .button::after {
    content: "";
    position: absolute;
    inset: 0px;
    background: linear-gradient(45deg, #0ce39a, #69007f, #fc0987);
    border-radius: 9px;
    transition: 0.5s;
    opacity: 0;
    filter: blur(20px);
  }
  
  .button:hover:after {
    opacity: 1;
  };`
    return(
      <StyleCard>
         <div className="card">
        <div className="card2">
          <div className="form">
            <h2 id="heading">{titulo}</h2>
            {children}
            <button className="button">
             <span>{boton}</span>
            </button>
          </div>
        </div>
      </div>
    

      </StyleCard>
   );

}