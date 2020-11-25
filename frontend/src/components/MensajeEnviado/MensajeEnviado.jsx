import React from "react";
import "./MensajeEnviado.css";

let parseFecha = (fecha) => {
  let partes = fecha.split("-");
  let ano = partes[0].substring(2, 5);
  let mes = partes[1];
  let final = partes[2];
  let dia = final.substring(0, 2);
  let hora = final.substring(3, 8);
  return `${dia}/${mes}/${ano} ${hora}`;
};

function MensajeEnviado(props) {
  return (
    <div id={props.mensaje.mensajeid} className="mensajeEnviado ml-auto">
      {!props.mensaje.url && (
        <React.Fragment>
          <p className="texto">{props.mensaje.texto}</p>
          <h6 className="agente">{props.mensaje.agente || "Bot"}</h6>
          <p className="fechaMensaje">{parseFecha(props.mensaje.fecha)}</p>
        </React.Fragment>
      )}
      {(props.mensaje.mimetype === "image/jpeg" ||
        props.mensaje.mimetype === "image/gif" ||
        props.mensaje.mimetype === "image/png") && (
        <React.Fragment>
          <img className="imagenAdjunta" src={props.mensaje.url} alt="" />
          <h6 className="agente">{props.mensaje.agente}</h6>
          <p className="fechaMensaje">{parseFecha(props.mensaje.fecha)}</p>
        </React.Fragment>
      )}
      {props.mensaje.mimetype === "application/pdf" && (
        <React.Fragment>
          <iframe
            title="myfrme01FDC"
            className="imagenAdjunta"
            src={props.mensaje.url}
            type="application/pdf"
          />
          <h6 className="agente">{props.mensaje.agente}</h6>
          <p className="fechaMensaje">{parseFecha(props.mensaje.fecha)}</p>
        </React.Fragment>
      )}
      {props.mensaje.parts && props.mensaje.parts[0].partType === "inline" && (
        <React.Fragment>
          <p className="texto">{props.mensaje.parts[0].payload.content}</p>
          <h6 className="agente">{props.mensaje.parts[1].payload.content}</h6>
          <p className="fechaMensaje">{parseFecha(props.mensaje.fecha)}</p>
        </React.Fragment>
      )}
      {props.mensaje.parts &&
        props.mensaje.parts[0].partType === "attachment" &&
        props.mensaje.parts[0].payload.type.substring(0, 5) === "image" && (
          <React.Fragment>
            <img
              className="imagenAdjunta"
              src={props.mensaje.parts[0].payload._downloadURL}
              alt=""
            />
            <h6 className="agente">{props.mensaje.text}</h6>
            <p className="fechaMensaje">{parseFecha(props.mensaje.fecha)}</p>
          </React.Fragment>
        )}
      {props.mensaje.parts &&
        props.mensaje.parts[0].partType === "attachment" &&
        props.mensaje.parts[0].payload.type === "application/pdf" && (
          <React.Fragment>
            <iframe
              title="myfrme02FDC"
              className="imagenAdjunta"
              src={props.mensaje.parts[0].payload._downloadURL}
              type="application/pdf"
            />
            <h6 className="agente">{props.mensaje.texto}</h6>
            <p className="fechaMensaje">{parseFecha(props.mensaje.fecha)}</p>
          </React.Fragment>
        )}
    </div>
  );
}

export default MensajeEnviado;
