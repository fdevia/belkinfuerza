import React, { useState } from "react";
import "./TituloConversacion.css";
import backArrow from "./backArrow.svg";
import options from "./options.svg";
import ModalAgentes from "../ModalAgentes/ModalAgentes";
import axios from "axios";

function TituloConversacion(props) {
  let [menuAbierto, setMenuAbierto] = useState(false);
  let [showAgents, setShowAgents] = useState(false);
  let [agentes, setAgentes] = useState([]);

  let handleClick = () => {
    setMenuAbierto(!menuAbierto);
  };

  let handleFileSumbit = (e) => {
    setMenuAbierto(false);
    props.setEsperando(true);
    let archivoSeleccionado = e.target.files.item(0);
    const fd = new FormData();
    fd.append("name", "mateo");
    debugger;
    fd.append("file", archivoSeleccionado);
    axios
      .post(
        `/chatcenterkit/agentmessage?usrtelnum=${props.selected.numTelUsr}&cedula=${props.currentUser.id}`,
        fd,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((response) => {
        debugger;
        let data = response.data;
        let buscada = data.find(
          (conv) => conv.numTelUsr === props.selected.numTelUsr
        );
        props.setConversaciones(data);
        props.setSelected(buscada);
        document.getElementById("sendMessageSound").play();
        props.setEsperando(false);
      })
      .catch((err) => console.log(err));
  };

  let handleModal = () => {
    fetch(`/mongo/agentesstatus/${props.currentUser.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((agentes) => setAgentes(agentes));
    });
    setShowAgents(!showAgents);
    setMenuAbierto(false);
  };

  return (
    <React.Fragment>
      <div className="contenedorTitulo">
        <div className="fondoBlanco d-flex bd-highlight">
          <button
            className="backButton bd-highlight"
            onClick={props.handleBack}
          >
            <img src={backArrow} alt="" className="backArrow" />
          </button>
          <h1 className="title bd-highlight">
            {props.selected.createdByUserId || props.selected.nameUsr}
          </h1>
          {!props.historial && (
            <React.Fragment>
              <button
                className="opcionesButton ml-auto bd-highlight"
                onClick={handleClick}
              >
                <img
                  src={options}
                  alt="options"
                  className="opcionesConversacion"
                />
              </button>
              {menuAbierto && (
                <div className="menuConv">
                  <input
                    className="inputfile"
                    type="file"
                    name="file"
                    id="file"
                    onChange={handleFileSumbit}
                  />
                  {!props.esperando && (
                    <label className="menuTitleConv" for="file">
                      Adjuntar Archivo
                    </label>
                  )}
                  {props.esperando && (
                    <label className="menuTitleConvEsperando">
                      Enviando archivo...
                    </label>
                  )}
                  <div onClick={handleModal} className="menuTitleConv">
                    Transferir Conversación
                  </div>
                  <div
                    onClick={() =>
                      props.handleTerminarConversacion(props.selected)
                    }
                    id="terminarConv"
                    className="menuTitleConv"
                  >
                    Terminar Conversacion
                  </div>
                </div>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
      {showAgents && (
        <ModalAgentes
          handleClose={handleModal}
          agentes={agentes}
          handleTransferir={props.handleTransferir}
          selected={props.selected}
        />
      )}
    </React.Fragment>
  );
}

export default TituloConversacion;
