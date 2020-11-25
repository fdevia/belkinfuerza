import React from "react";
import "./Conversaciones.css";
import Conversacion from "../Conversacion/Conversacion";

function Conversaciones(props) {
  return (
    <div className="independentScroll">
      <div className="margenLista">
        {props.historial && <div className="espacioEnBlanco" />}
        {props.conversaciones.map((conversacion) => {
          return (
            <Conversacion
              key={conversacion._id}
              selected={props.selected}
              conversacion={conversacion}
              handleClick={props.handleClick}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Conversaciones;
