import React, { useEffect } from "react";
import MensajeRecibido from "../MensajeRecibido/MensajeRecibido";
import MensajeEnviado from "../MensajeEnviado/MensajeEnviado";
import "./Mensajes.css";
import { useRef } from "react";
import MensajeServidor from "../MensajeServidor/MensajeServidor";

function Mensajes(props) {
  const bottomRef = useRef();
  const containerRef = useRef();
  useEffect(() => {
    let d = document.getElementById("div");
    d.scrollTop = d.scrollHeight;

    if (props.selected.mensajeBuscado) {
      let a = document.getElementById(props.selected.mensajeBuscado.mensajeid);
      a.scrollIntoView();
      d.scrollTop = d.scrollTop - 63;
    }
  });
  let renderMensaje = (mensaje) => {
    if (mensaje.recibido || mensaje.fuente === "bot") {
      return <MensajeServidor mensaje={mensaje} />;
    } else if (mensaje.recibido || mensaje.fuente === "usuario") {
      return <MensajeRecibido mensaje={mensaje} />;
    } else {
      return <MensajeEnviado mensaje={mensaje} />;
    }
  };

  return (
    <div id="div" className="containerMessages" ref={containerRef}>
      {props.selected.mensajes.map((mensaje, key) => (
        <div key={key}>{renderMensaje(mensaje)}</div>
      ))}
      <div id="bottom" ref={bottomRef}></div>
    </div>
  );
}

export default Mensajes;
