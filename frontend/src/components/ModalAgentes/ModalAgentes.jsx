import React from "react";
import "./ModalAgentes.css";
import close from "./close.svg";

function ModalAgentes(props) {
  return (
    <div className="modalAgentes">
      <button className="buttonClose" onClick={props.handleClose}>
        <img className="closeIcon" src={close} alt="" />
      </button>
      {props.agentes.map((agente) => (
        <div className="container-fluid agentesContainer">
          <div
            onClick={() => {
              props.handleTransferir(agente.cedula, props.selected.numTelUsr);
              props.handleClose();
            }}
            className="row agenteContainer"
          >
            <h2 className="nombre">{agente.name}</h2>
            {agente.logged === "true" && (
              <h2 className="estadoConectado">DISPONIBLE</h2>
            )}
            {agente.logged === "false" && (
              <h2 className="estadoDesconectado">DESCONECTADO</h2>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ModalAgentes;
