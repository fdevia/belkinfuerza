import React from "react";
import "./MensajeRecibido.css";

let parseFecha = (fecha) => {
  let partes = fecha.split("-");
  let ano = partes[0].substring(2, 5);
  let mes = partes[1];
  let final = partes[2];
  let dia = final.substring(0, 2);
  let hora = final.substring(3, 8);
  return `${dia}/${mes}/${ano} ${hora}`;
};

function MensajeRecibido(props) {
  return (
    <div className="mensajeRecibido">
      {props.mensaje.parts && (
        <React.Fragment>
          <p className="texto">{props.mensaje.texto}</p>
          <p className="fechaMensaje">{parseFecha(props.mensaje.fecha)}</p>
        </React.Fragment>
      )}
      {!props.mensaje.parts && (
        <React.Fragment>
          <p className="texto">{props.mensaje.texto}</p>
          <p className="fechaMensaje">{parseFecha(props.mensaje.fecha)}</p>
        </React.Fragment>
      )}
    </div>
  );
}

export default MensajeRecibido;
