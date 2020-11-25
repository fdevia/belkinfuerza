import React, { useState, useEffect } from "react";
import Conversaciones from "../Conversaciones/Conversaciones";
import ConversacionActual from "../ConversacionActual/ConversacionActual";
import "./Chat.css";
import HeaderConversaciones from "../HeaderConversaciones/HeaderConversaciones";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

function Chat(props) {
  const [principal, setPrincipal] = useState(true);
  const [selectedConv, setSelectedConv] = useState(undefined);
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const [conversaciones, setConversaciones] = useState([]);

  useEffect(() => {
    // Tamaño de la pantalla ----------------------------------------------------------------------
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }
    window.addEventListener("resize", handleResize);
    // --------------------------------------------------------------------------------------------

    // Chatkit ------------------------------------------------------------------------------------
    let chatManager = props.chatkit.chatkit.chatManager;
    let currentUser = props.chatkit.chatkit.currentUser;
    chatManager.connect({
      onAddedToRoom: room => {
        update();
        currentUser.subscribeToRoomMultipart({
          roomId: room.id,
          hooks: {
            onMessage: message => {
              update();
            }
          }
        });
      }
    });

    let newConversaciones = { ...currentUser.rooms };
    newConversaciones = Object.values(newConversaciones);
    for (let i in newConversaciones) {
      newConversaciones[i].mensajes = [];
      currentUser.subscribeToRoomMultipart({
        roomId: newConversaciones[i].id,
        hooks: {
          onMessage: message => {
            let newMensaje = { ...message };

            if (message.senderId.substring(0, 8) === "whatsapp") {
              newMensaje.recibido = true;
            } else {
              newMensaje.recibido = false;
            }
            newConversaciones[i].mensajes.push(newMensaje);
            //setConversaciones(newConversaciones);
            setWindowDimensions(getWindowDimensions());
          }
        }
      });
    }
    setConversaciones(newConversaciones);
    // --------------------------------------------------------------------------------------------
  }, []);

  let update = () => {
    let currentUser = props.chatkit.chatkit.currentUser;
    let newConversaciones = { ...currentUser.rooms };
    newConversaciones = Object.values(newConversaciones);
    for (let i in newConversaciones) {
      newConversaciones[i].mensajes = [];
      currentUser.subscribeToRoomMultipart({
        roomId: newConversaciones[i].id,
        hooks: {
          onMessage: message => {
            let newMensaje = { ...message };

            if (message.senderId.substring(0, 8) === "whatsapp") {
              newMensaje.recibido = true;
            } else {
              newMensaje.recibido = false;
            }
            newConversaciones[i].mensajes.push(newMensaje);
            //setConversaciones(newConversaciones);
            setWindowDimensions(getWindowDimensions());
          }
        }
      });
    }
    setConversaciones(newConversaciones);
  };

  let sendMessage = (message, roomId) => {
    props.chatkit.chatkit.currentUser
      .sendSimpleMessage({
        roomId: roomId,
        text: message
      })
      .then(messageId => {})
      .catch(err => {
        console.log(`Error sending message ${message}: ${err}`);
      });
  };

  let renderChiquito = () => {
    return (
      <div className="row fullHeight">
        {principal && (
          <div className="col-12 noPadding">
            <HeaderConversaciones />
            <Conversaciones
              selected={selectedConv}
              conversaciones={conversaciones}
              handleClick={handleClick}
            />
          </div>
        )}
        {!principal && (
          <div className="col-12 noPadding">
            <ConversacionActual
              selected={selectedConv}
              handleBack={handleBack}
              sendMessage={sendMessage}
            />
          </div>
        )}
      </div>
    );
  };

  let renderGrande = () => {
    return (
      <div className="row fullHeight">
        <div className="col-3 noPadding">
          <HeaderConversaciones />
          <Conversaciones
            selected={selectedConv}
            conversaciones={conversaciones}
            handleClick={handleClick}
          />
        </div>
        <div className="col-9 noPadding">
          <ConversacionActual
            selected={selectedConv}
            handleBack={handleBack}
            sendMessage={sendMessage}
          />
        </div>
      </div>
    );
  };

  let handleClick = selected => {
    if (windowDimensions.width > 750) {
      setSelectedConv(selected);
    } else {
      setSelectedConv(selected);
      setPrincipal(false);
    }
  };

  let handleBack = () => {
    setPrincipal(true);
    setSelectedConv(undefined);
  };

  return (
    <div>
      <div className="container-fluid fullScreen">
        {windowDimensions.width > 750 && renderGrande()}
        {windowDimensions.width <= 750 && renderChiquito()}
      </div>
    </div>
  );
}

export default Chat;
