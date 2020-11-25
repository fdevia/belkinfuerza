import React from "react";
import "./Conversacion.css";

let parseFecha = (fecha) => {
  let partes = fecha.split("-");
  let ano = partes[0].substring(2, 5);
  let mes = partes[1];
  let final = partes[2];
  let dia = final.substring(0, 2);
  return `${dia}/${mes}/${ano}`;
};

function Conversacion(props) {
  let renderUltimoMensaje = () => {
    let mensaje =
      props.conversacion.mensajes[props.conversacion.mensajes.length - 1];

    if (props.conversacion.mensajeBuscado) {
      mensaje = props.conversacion.mensajeBuscado;
    }

    if (mensaje) {
      if (mensaje.fuente === "usuario") {
        return <h6 className="ultimoMensaje">{mensaje.texto}</h6>;
      } else if (mensaje.fuente === "bot") {
        return <h6 className="ultimoMensaje">Bot: {mensaje.texto}</h6>;
      } else {
        return <h6 className="ultimoMensaje">Tú: {mensaje.texto}</h6>;
      }
    } else if (mensaje && mensaje.fecha) {
      if (mensaje.agente === "") {
        return <h6 className="ultimoMensaje">{mensaje.texto}</h6>;
      } else {
        return (
          <h6 className="ultimoMensaje">
            {mensaje.agente}: {mensaje.texto}
          </h6>
        );
      }
    } else {
      return <h6 className="ultimoMensaje">Cargando...</h6>;
    }
  };

  let renderPendiente = () => {
    let mensaje =
      props.conversacion.mensajes[props.conversacion.mensajes.length - 1];
    return (
      <React.Fragment>
        {mensaje &&
          (mensaje.fuente === "usuario" || mensaje.fuente === "bot") && (
            <div className="pendiente" />
          )}
      </React.Fragment>
    );
  };

  let renderSelected = () => {
    return (
      <div
        className="conversacion conversacionSeleccionada"
        onClick={() => props.handleClick(props.conversacion)}
      >
        <p className="fecha">
          {parseFecha(
            props.conversacion.mensajes[props.conversacion.mensajes.length - 1]
              .fecha
          )}
        </p>
        {props.conversacion.activa && <div className="activa" />}
        <div className="contenedorNombre">
          <h2 className="tituloConversacion">
            {props.conversacion.createdByUserId || props.conversacion.nameUsr}
          </h2>
        </div>
        {renderUltimoMensaje()}
        {renderPendiente()}
      </div>
    );
  };
  let renderUnselected = () => {
    return (
      <div
        className="conversacion"
        onClick={() => props.handleClick(props.conversacion)}
      >
        <p className="fecha">
          {parseFecha(
            props.conversacion.mensajes[props.conversacion.mensajes.length - 1]
              .fecha
          )}
        </p>
        <div className="contenedorNombre">
          <h2 className="tituloConversacion">
            {props.conversacion.nameUsr || props.conversacion.numTel}
          </h2>
        </div>
        {renderUltimoMensaje()}
        {renderPendiente()}
      </div>
    );
  };
  let renderConversacion = () => {
    return (
      <React.Fragment>
        {((props.conversacion.id &&
          props.conversacion.id === props.selected.id) ||
          (props.conversacion._id &&
            props.conversacion._id === props.selected._id)) &&
          renderSelected()}
        {!(
          (props.conversacion.id &&
            props.conversacion.id === props.selected.id) ||
          (props.conversacion._id &&
            props.conversacion._id === props.selected._id)
        ) && renderUnselected()}
      </React.Fragment>
    );
  };
  return (
    <React.Fragment>
      {props.selected && renderConversacion()}
      {!props.selected && renderUnselected()}
    </React.Fragment>
  );
}

export default Conversacion;
