import React from "react";
import "./MensajeServidor.css";

let parseFecha = (fecha) => {
  let partes = fecha.split("-");
  let ano = partes[0].substring(2, 5);
  let mes = partes[1];
  let final = partes[2];
  let dia = final.substring(0, 2);
  let hora = final.substring(3, 8);
  return `${dia}/${mes}/${ano} ${hora}`;
};

function MensajeServidor(props) {
  return (
    <div className="mensajeServidor">
      <h6 className="textoServidor">{props.mensaje.texto}</h6>
      <p className="fechaMensajeServidor">{parseFecha(props.mensaje.fecha)}</p>
    </div>
  );
}

export default MensajeServidor;
