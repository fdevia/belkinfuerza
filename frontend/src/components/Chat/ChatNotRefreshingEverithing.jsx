import React, { Component } from "react";
import Conversaciones from "../Conversaciones/Conversaciones";
import ConversacionActual from "../ConversacionActual/ConversacionActual";
import "./Chat.css";
import HeaderConversaciones from "../HeaderConversaciones/HeaderConversaciones";
import sendMessage from "./sendMessage.mp3";
import newMessage from "./newMessage.mp3";
import newMessageAbierto from "./newMessageAbierto.mp3";
import newConversacion from "./newConversacion.mp3";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

let cargo = false;

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      principal: true,
      selectedConv: undefined,
      windowDimensions: getWindowDimensions(),
      conversaciones: []
    };
  }

  handleResize = () => {
    this.setState({ windowDimensions: getWindowDimensions() });
  };

  handleTerminarConversacion = conversacion => {
    let currentUser = this.props.chatkit.chatkit.currentUser;
    currentUser
      .leaveRoom({ roomId: conversacion.id })
      .then(room => {
        console.log(`Left room with ID: ${room.id}`);
      })
      .catch(err => {
        console.log(`Error leaving room ${conversacion.id}: ${err}`);
      });
  };

  componentDidMount() {
    // Tamaño de la pantalla ----------------------------------------------------------------------
    window.addEventListener("resize", this.handleResize);
    // --------------------------------------------------------------------------------------------

    // Chatkit ------------------------------------------------------------------------------------
    let chatManager = this.props.chatkit.chatkit.chatManager;
    let currentUser = this.props.chatkit.chatkit.currentUser;

    let lastPromise = undefined;
    // apenas se carga la pagina
    let newConversaciones = { ...currentUser.rooms };
    newConversaciones = Object.values(newConversaciones);
    for (let i in newConversaciones) {
      newConversaciones[i].mensajes = [];
      lastPromise = currentUser.subscribeToRoomMultipart({
        roomId: newConversaciones[i].id,
        hooks: {
          onMessage: message => {
            this.addMessageToConversacion(message, newConversaciones[i].id);
            this.playMessageSound(message);
          }
        }
      });
    }
    lastPromise.then(data => {
      cargo = true;
    });

    this.setState({ conversaciones: newConversaciones });

    //Evento de que durante la sesion agregan nuevas conversaciones
    chatManager.connect({
      onAddedToRoom: room => {
        document.getElementById("newConversacionSound").play();
        let conversacion = this.state.conversaciones.find(
          conv => conv.id === room.id
        );
        if (!conversacion) {
          let newConversacion = { ...room };
          newConversacion.mensajes = [];
          this.setState({
            conversaciones: [...this.state.conversaciones, newConversacion]
          });
        }
        cargo = false;
        let suscribePromise = currentUser.subscribeToRoomMultipart({
          roomId: room.id,
          hooks: {
            onMessage: message => {
              this.addMessageToConversacion(message, room.id);
              this.playMessageSound(message);
            }
          }
        });
        suscribePromise.then(data => {
          cargo = true;
        });
      }
    });
    // --------------------------------------------------------------------------------------------
  }

  playMessageSound = message => {
    if (cargo) {
      console.log(message);
      if (message.senderId === "1018505033") {
        document.getElementById("sendMessageSound").play();
      } else if (
        this.state.selectedConv &&
        message.roomId === this.state.selectedConv.id
      ) {
        document.getElementById("newMessageAbiertoSound").play();
      } else {
        document.getElementById("newMessageSound").play();
      }
    }
  };

  addMessageToConversacion = (message, roomId) => {
    let newMensaje = { ...message };

    if (message.senderId.substring(0, 8) === "whatsapp") {
      newMensaje.recibido = true;
    } else if (message.senderId.substring(0, 10) === "0000000000") {
      newMensaje.recibido = true;
      newMensaje.servidor = true;
    } else {
      newMensaje.recibido = false;
    }
    let newConversaciones = [...this.state.conversaciones];

    for (let i in newConversaciones) {
      if (newConversaciones[i].id === roomId) {
        newConversaciones[i].mensajes.push(newMensaje);
        break;
      }
    }
    this.setState({ conversaciones: newConversaciones });
  };

  sendMessage = (message, roomId) => {
    this.props.chatkit.chatkit.currentUser
      .sendMultipartMessage({
        roomId: roomId,
        parts: [
          {
            type: "text/plain",
            content: message
          },
          {
            type: "text/plain",
            content: "Mateo"
          }
        ]
      })
      .then(messageId => {})
      .catch(err => {
        console.log(`Error sending message ${message}: ${err}`);
      });
  };

  renderChiquito = () => {
    return (
      <div className="row fullHeight">
        {this.state.principal && (
          <div className="col-12 noPadding">
            <HeaderConversaciones />
            <Conversaciones
              selected={this.state.selectedConv}
              conversaciones={this.state.conversaciones}
              handleClick={this.handleClick}
            />
          </div>
        )}
        {!this.state.principal && (
          <div className="col-12 noPadding">
            <ConversacionActual
              selected={this.state.selectedConv}
              handleBack={this.handleBack}
              handleTerminarConversacion={this.handleTerminarConversacion}
              sendMessage={this.sendMessage}
            />
          </div>
        )}
      </div>
    );
  };

  renderGrande = () => {
    return (
      <div className="row fullHeight">
        <div className="col-3 noPadding">
          <HeaderConversaciones />
          <Conversaciones
            selected={this.state.selectedConv}
            conversaciones={this.state.conversaciones}
            handleClick={this.handleClick}
          />
        </div>
        <div className="col-9 noPadding">
          <ConversacionActual
            selected={this.state.selectedConv}
            handleBack={this.handleBack}
            handleTerminarConversacion={this.handleTerminarConversacion}
            sendMessage={this.sendMessage}
          />
        </div>
      </div>
    );
  };

  handleClick = selected => {
    console.log(selected);

    if (this.state.windowDimensions.width > 750) {
      this.setState({ selectedConv: selected });
    } else {
      this.setState({ selectedConv: selected });
      this.setState({ principal: false });
    }
  };

  handleBack = () => {
    this.setState({ principal: true });
    this.setState({ selectedConv: undefined });
  };

  render() {
    return (
      <div>
        <audio id="sendMessageSound" src={sendMessage} preload></audio>
        <audio id="newMessageSound" src={newMessage} preload></audio>
        <audio id="newConversacionSound" src={newConversacion} preload></audio>
        <audio
          id="newMessageAbiertoSound"
          src={newMessageAbierto}
          preload
        ></audio>
        <div className="container-fluid fullScreen">
          {this.state.windowDimensions.width > 750 && this.renderGrande()}
          {this.state.windowDimensions.width <= 750 && this.renderChiquito()}
        </div>
      </div>
    );
  }
}

export default Chat;
