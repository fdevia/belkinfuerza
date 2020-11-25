import React from "react";
import "./ConversacionActual.css";
import TituloConversacion from "../TituloConversacion/TituloConversacion";
import InputMensaje from "../InputMensaje/InputMensaje";
import Logo from "./ChatCenterLogo.svg";
import Mensajes from "../Mensajes/Mensajes";

function ConversacionActual(props) {
  return (
    <div className="fondoGris">
      {props.selected && (
        <React.Fragment>
          <TituloConversacion
            selected={props.selected}
            currentUser={props.currentUser}
            handleBack={props.handleBack}
            handleTerminarConversacion={props.handleTerminarConversacion}
            historial={props.historial}
            handleTransferir={props.handleTransferir}
            setSelected={props.setSelected}
            setConversaciones={props.setConversaciones}
            esperando={props.esperando}
            setEsperando={props.setEsperando}
          />
          <Mensajes selected={props.selected} historial={props.historial} />
          {!props.historial && (
            <InputMensaje
              selected={props.selected}
              sendMessage={props.sendMessage}
              usuario={props.currentUser.nombre}
              esperando={props.esperando}
              setEsperando={props.setEsperando}
            />
          )}
        </React.Fragment>
      )}
      {!props.selected && (
        <div className="contenedorBienvenida">
          <img src={Logo} alt="Chat Center Logo" className="logo" />
          <h1 className="tituloSeleccionaAlgo">
            ¡Bienvenido {props.currentUser.nombre}!
          </h1>
          <p>Escoge una conversación para empezar a chatear.</p>
        </div>
      )}
    </div>
  );
}

export default ConversacionActual;
