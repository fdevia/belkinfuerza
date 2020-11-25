import React, { useRef } from "react";
import "./InputMensaje.css";
import sendIcon from "./sendIcon.svg";
import quickImage from "./quickMessages.svg";
import { useState } from "react";

function InputMensaje(props) {
  const inputRef = useRef();
  const [mensajesRapidos, setMensajesRapidos] = useState(false);

  let handleSend = () => {
    props.sendMessage(inputRef.current.value, props.selected.numTelUsr);
    inputRef.current.value = "";
  };

  let handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  let handleMensajes = () => {
    setMensajesRapidos(!mensajesRapidos);
  };

  let handleSetQuickMessage = (message) => {
    inputRef.current.value = message;
    setMensajesRapidos(false);
  };

  return (
    <div className="myInputContainer">
      <div className="row">
        {!props.esperando && (
          <input
            className="myInput"
            type="text"
            disabled={props.esperando}
            ref={inputRef}
            onKeyPress={handleKeyPress}
          />
        )}
        {props.esperando && (
          <input
            className="myDisabledInput"
            type="text"
            disabled={props.esperando}
            ref={inputRef}
            value="Enviando Mensaje, porfavor espere..."
          />
        )}
        <button
          onClick={handleSend}
          disabled={props.esperando}
          className="sendButton"
        >
          <img src={sendIcon} alt="Boton Enviar" className="iconoEnviar" />
        </button>
        <div className="fondoBotonRapido">
          <button onClick={handleMensajes} className="quickSendContainer">
            <img className="quickSend" src={quickImage} alt="" />
          </button>
        </div>
        {mensajesRapidos && (
          <div className="contenedorMensajesRapidos">
            <div
              onClick={() =>
                handleSetQuickMessage(
                  `Buenos Días, mi nombre es ${props.usuario} de Serv. ¿En que puedo ayudarlo el día de hoy?`
                )
              }
              class="mensajeRapido"
            >
              Buenos Días, mi nombre es {props.usuario} de Serv. ¿En que puedo
              ayudarlo el día de hoy?
            </div>
            <div>
              <div
                onClick={() =>
                  handleSetQuickMessage("¿Puedo ayudarlo con alguien más?")
                }
                class="mensajeRapido"
              >
                ¿Puedo ayudarlo con alguien más?
              </div>
            </div>
            <div>
              <div
                onClick={() =>
                  handleSetQuickMessage(
                    "Ha sido un placer atenderlo el día de hoy. Hasta luego."
                  )
                }
                class="mensajeRapido"
              >
                Ha sido un placer atenderlo el día de hoy. Hasta luego.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InputMensaje;
