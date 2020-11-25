import React, { useRef } from "react";
import "./HeaderConversaciones.css";
import logo from "./ChatCenterLogo.svg";
import options from "./options.svg";
import { useState } from "react";
import lupa from "./lupa.svg";
/* FDC import Conversacion from "../Conversacion/Conversacion";
import Conversaciones from "../Conversaciones/Conversaciones";
import InputMensaje from "../InputMensaje/InputMensaje"; */

function HeaderConversaciones(props) {
  const inputRef = useRef();

  let [menuAbierto, setMenuAbierto] = useState(false);

  let handleClick = () => {
    setMenuAbierto(!menuAbierto);
  };
  let handleHistorial = () => {
    props.setHistorial(true);
    props.setSelected(undefined);
    props.setConversaciones([]);
    debugger;
    fetch(`/mongo/getMyConversationsHistorial/${props.currentUser.id}`, {
      //fetch(`/mongo/conversacionesAgente`, {
      method: "GET",
    }).then((response) => {
      response.json().then((conversaciones) => {
        props.setConversaciones(conversaciones);
      });
    });
    setMenuAbierto(false);
  };

  let handleInicio = () => {
    props.setHistorial(false);
    setMenuAbierto(false);
    props.setSelected(undefined);
  };

  let handleCerrarSesion = () => {
    fetch(`/auth/logout/${props.currentUser.id}`, {
      method: "POST",
    });
    props.logout(undefined);
    props.setSelected(undefined);
    setMenuAbierto(false);
    sessionStorage.clear();
  };

  let search = () => {
    if (inputRef.current.value === "") {
      handleHistorial();
    } else {
      fetch(
        `/mongo/conversacionessearchtext/${props.currentUser.id}/${inputRef.current.value}`,
        {
          method: "GET",
        }
      ).then((response) => {
        response.json().then(async (mensajes) => {
          console.log(mensajes);
          let newConversaciones = [];
          for (let i in mensajes) {
            let response = await fetch(
              `/mongo/conversacion/${mensajes[i].usrtelnum}`,
              {
                method: "GET",
              }
            );

            let conversacion = await response.json();
            conversacion.mensajeBuscado = mensajes[i];
            newConversaciones.push(conversacion);
          }
          props.setConversaciones(newConversaciones);
        });
      });
    }
  };

  let handleKeyPress = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  return (
    <div className="contenedor">
      <div className="flex-row">
        <img src={logo} alt="Company Logo" className="logoEmpresa" />
        <button className="optionsButton float-right" onClick={handleClick}>
          <img src={options} alt="Options Icon" className="optionsIcon" />
        </button>
        {props.historial && (
          <div className="contenedorBuscar">
            <input
              type="text"
              className="inputBuscar"
              ref={inputRef}
              onKeyPress={handleKeyPress}
            />
            <button onClick={search} className="lupa">
              <img className="lupaIcon" src={lupa} alt="" />
            </button>
          </div>
        )}
        {menuAbierto && (
          <div className="menu">
            {!props.historial && (
              <div className="menuTitle" onClick={handleHistorial}>
                Historial
              </div>
            )}
            {props.historial && (
              <div className="menuTitle" onClick={handleInicio}>
                Inicio
              </div>
            )}
            <div className="menuTitle" onClick={handleCerrarSesion}>
              Cerrar Sesion
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderConversaciones;
