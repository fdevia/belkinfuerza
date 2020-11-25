import React, { Component } from "react";
import Conversaciones from "../Conversaciones/Conversaciones";
import ConversacionActual from "../ConversacionActual/ConversacionActual";
import "./Chat.css";
import HeaderConversaciones from "../HeaderConversaciones/HeaderConversaciones";
import sendMessage from "./sendMessage.mp3";
import newMessage from "./newMessage.mp3";
import newMessageAbierto from "./newMessageAbierto.mp3";
import newConversacion from "./newConversacion.mp3";
import socketIOClient from "socket.io-client";
// FDC import Conversacion from "../Conversacion/Conversacion";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function compareConversations(conv1, conv2) {
  if (
    conv1.mensajes[conv1.mensajes.length - 1] &&
    conv2.mensajes[conv2.mensajes.length - 1]
  ) {
    let fecha1 = conv1.mensajes[conv1.mensajes.length - 1].fecha;
    let partes1 = fecha1.split("-");
    let ano1 = partes1[0].substring(0, 5);
    let mes1 = partes1[1];
    let final1 = partes1[2];
    let dia1 = final1.substring(0, 2);
    let hora1 = final1.substring(3, 5);
    let minuto1 = final1.substring(6, 8);
    let segundos1 = final1.substring(9, 11);
    let date1 = new Date(
      parseInt(ano1),
      parseInt(mes1) - 1,
      parseInt(dia1),
      parseInt(hora1),
      parseInt(minuto1),
      parseInt(segundos1)
    );

    let fecha2 = conv2.mensajes[conv2.mensajes.length - 1].fecha;
    let partes2 = fecha2.split("-");
    let ano2 = partes2[0].substring(0, 5);
    let mes2 = partes2[1];
    let final2 = partes2[2];
    let dia2 = final2.substring(0, 2);
    let hora2 = final2.substring(3, 5);
    let minuto2 = final2.substring(6, 8);
    let segundos2 = final2.substring(9, 11);
    let date2 = new Date(
      parseInt(ano2),
      parseInt(mes2) - 1,
      parseInt(dia2),
      parseInt(hora2),
      parseInt(minuto2),
      parseInt(segundos2)
    );

    let comparison = "";
    if (date1.getTime() > date2.getTime()) {
      comparison = -1;
    } else if (date1.getTime() < date2.getTime()) {
      comparison = 1;
    } else {
      comparison = 0;
    }

    return comparison;
  } else {
    return 0;
  }
}

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      principal: true,
      selectedConv: undefined,
      windowDimensions: getWindowDimensions(),
      conversaciones: [],
      historial: false,
      esperando: false,
    };
  }

  // Abre el socket principal con el servidor
  socket = socketIOClient("https://my-chat-kit.herokuapp.com/");

  handleResize = () => {
    this.setState({ windowDimensions: getWindowDimensions() });
  };

  handleClose = async (e) => {
    /**
    let response = await fetch("/auth/logout ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: this.props.chatkit.chatkit.currentUser.id
      })
    });
    */
    navigator.sendBeacon(`/auth/logout/${this.props.currentUser.id}`, {});
    e.preventDefault();
  };

  handleTerminarConversacion = (conversacion) => {
    fetch(
      `/mongo/terminarconversacion/${conversacion.numTelUsr}/${this.props.currentUser.id}`,
      {
        method: "POST",
      }
    ).then((response) => {
      this.pedirConversaciones();
    });
    this.setSelected(undefined);
    this.unsuscribeDeConversacion(conversacion.numTelUsr);
  };

  handleTransferir = (agenteNuevo, cliente) => {
    fetch(
      `/chatcenterkit/transferirAgente/${this.props.currentUser.id}/${agenteNuevo}/${cliente}`,
      {
        method: "POST",
      }
    ).then((response) => {
      this.pedirConversaciones();
    });
    this.setSelected(undefined);
    this.unsuscribeDeConversacion(cliente);
  };

  configurarSocket = () => {
    this.socket.on("connect_error", (error) => {
      alert(
        "No se puede conectar con el servidor. Haz click en aceptar para volver a intentar."
      );
    });

    this.socket.on("connect", () => {
      console.log("Main socket opnened");
      // Envia mensaje con identificacion para que el servidor le cree una room
      this.socket.emit("identificacion", this.props.currentUser.id);
      this.pedirConversaciones();
    });

    //le llega una nueva conversacion
    this.socket.on("newConversation", (clientId) => {
      console.log("newConversation");
      document.getElementById("newConversacionSound").play();
      // vuelve a pedir sus conversaciones al servidor
      this.pedirConversaciones();
      // se suscribe al room de ese cliente
      this.suscribirseAConversacion(clientId);
    });

    this.socket.on("newMessage", (clientId) => {
      console.log("newMessage");
      // vuelve a pedir sus conversaciones al servidor
      this.pedirConversaciones();
      this.receiveSound(clientId);
    });

    this.socket.on("disconnect", () => {
      alert(
        "Ups! Se ha perdido la conexión. Haz click en aceptar para volver a intentar."
      );
    });
  };

  pedirConversaciones = () => {
    fetch(`/mongo/getMyConversations/${this.props.currentUser.id}`).then(
      (response) => {
        response.json().then((data) => {
          data.sort(compareConversations);
          this.setState({ conversaciones: data });
          for (let i in data) {
            if (
              this.state.selectedConv &&
              data[i].numTelUsr === this.state.selectedConv.numTelUsr
            ) {
              this.setState({ selectedConv: data[i] });
            }

            this.suscribirseAConversacion(data[i].numTelUsr);
          }
        });
      }
    );
  };

  suscribirseAConversacion = (clientId) => {
    this.socket.emit("suscribeTo", clientId);
    console.log("suscribed to ", clientId);
  };

  unsuscribeDeConversacion = (clientId) => {
    this.socket.emit("unsuscribeFrom", clientId);
    console.log("unsuscribed from ", clientId);
  };

  componentDidMount() {
    // Detectar Cerrar ----------------------------------------------------------------------
    window.addEventListener("beforeunload", this.handleClose);
    // --------------------------------------------------------------------------------------------

    // Tamaño de la pantalla ----------------------------------------------------------------------
    window.addEventListener("resize", this.handleResize);
    // --------------------------------------------------------------------------------------------
    this.configurarSocket();

    setInterval(() => {
      fetch("https://my-chat-kit.herokuapp.com/monitor").then((response) => {
        response.text().then((data) => console.log(data));
      });
    }, 1500000);

    fetch("/auth/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: sessionStorage.id,
        password: sessionStorage.password,
      }),
    });
  }

  firstLoad = () => {
    let currentUser = this.props.chatkit.chatkit.currentUser;

    let newConversaciones = { ...currentUser.rooms };
    newConversaciones = Object.values(newConversaciones);
    for (let i in newConversaciones) {
      newConversaciones[i].mensajes = [];
      currentUser
        .subscribeToRoomMultipart({
          roomId: newConversaciones[i].id,
          hooks: {
            onMessage: (message) => {
              this.addMessageToConversacion(message, newConversaciones[i].id);
              this.playMessageSound(message);
            },
          },
          messageLimit: 0,
        })
        .then(() => {
          currentUser
            .fetchMultipartMessages({
              roomId: newConversaciones[i].id,
              direction: "older",
              limit: 100,
            })
            .then((messages) => {
              for (let j in messages) {
                this.addMessageToConversacion(
                  messages[j],
                  newConversaciones[i].id
                );
              }
            })
            .catch((err) => {
              console.log(`Error fetching messages: ${err}`);
            });
        });
    }
    this.setState({ conversaciones: newConversaciones });
  };

  receiveSound = (client) => {
    if (
      this.state.selectedConv &&
      client === this.state.selectedConv.numTelUsr
    ) {
      document.getElementById("newMessageAbiertoSound").play();
    } else {
      document.getElementById("newMessageSound").play();
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

    newConversaciones.sort(compareConversations);
    this.setState({ conversaciones: newConversaciones });
  };

  sendMessage = (message, clientId) => {
    debugger;
    if (message !== "") {
      this.setEsperando(true);
      console.log(this.props.currentUser.id + " " + message + " " + clientId);
      fetch(`/chatcenterkit/agentmessage`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mensaje: message,
          from: this.props.currentUser.id,
          to: clientId,
          type: "text",
        }),
      })
        .then((response) => {
          response.json().then((data) => {
            let buscada = data.find((conv) => conv.numTelUsr === clientId);
            this.setState({ conversaciones: data, selectedConv: buscada });
            document.getElementById("sendMessageSound").play();
            this.setEsperando(false);
          });
        })
        .catch((err) => console.log(err));
    }
  };

  setConversaciones = (conversaciones) => {
    this.setState({ conversaciones: conversaciones });
  };

  setHistorial = (historial) => {
    if (!historial) {
      this.socket = socketIOClient("https://my-chat-kit.herokuapp.com/");
      this.pedirConversaciones();
      this.configurarSocket();
    }
    this.setState({ historial: historial });
  };

  renderChiquito = () => {
    return (
      <div className="row fullHeight">
        {this.state.principal && (
          <div className="col-12 noPadding">
            <HeaderConversaciones
              currentUser={this.props.currentUser}
              setSelected={this.setSelected}
              logout={this.props.logout}
              setConversaciones={this.setConversaciones}
              setHistorial={this.setHistorial}
              historial={this.state.historial}
            />
            <Conversaciones
              selected={this.state.selectedConv}
              conversaciones={this.state.conversaciones}
              handleClick={this.handleClick}
              historial={this.state.historial}
            />
          </div>
        )}
        {!this.state.principal && (
          <div className="col-12 noPadding">
            <ConversacionActual
              usuario={this.props.currentUser.name}
              currentUser={this.props.currentUser}
              selected={this.state.selectedConv}
              handleBack={this.handleBack}
              handleTerminarConversacion={this.handleTerminarConversacion}
              sendMessage={this.sendMessage}
              historial={this.state.historial}
              handleTransferir={this.handleTransferir}
              setSelected={this.setSelected}
              setConversaciones={this.setConversaciones}
              esperando={this.state.esperando}
              setEsperando={this.setEsperando}
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
          <HeaderConversaciones
            currentUser={this.props.currentUser}
            setSelected={this.setSelected}
            logout={this.props.logout}
            setConversaciones={this.setConversaciones}
            setHistorial={this.setHistorial}
            historial={this.state.historial}
          />
          <Conversaciones
            selected={this.state.selectedConv}
            conversaciones={this.state.conversaciones}
            handleClick={this.handleClick}
            historial={this.state.historial}
          />
        </div>
        <div className="col-9 noPadding">
          <ConversacionActual
            usuario={this.props.currentUser.name}
            currentUser={this.props.currentUser}
            selected={this.state.selectedConv}
            handleBack={this.handleBack}
            handleTerminarConversacion={this.handleTerminarConversacion}
            sendMessage={this.sendMessage}
            historial={this.state.historial}
            handleTransferir={this.handleTransferir}
            setSelected={this.setSelected}
            setConversaciones={this.setConversaciones}
            esperando={this.state.esperando}
            setEsperando={this.setEsperando}
          />
        </div>
      </div>
    );
  };

  handleClick = (selected) => {
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

  setSelected = (selected) => {
    this.setState({ selectedConv: selected });
  };

  setEsperando = (esperando) => {
    this.setState({ esperando: esperando });
  };

  render() {
    return (
      <div>
        <audio id="sendMessageSound" src={sendMessage} preload="true"></audio>
        <audio id="newMessageSound" src={newMessage} preload="true"></audio>
        <audio
          id="newConversacionSound"
          src={newConversacion}
          preload="true"
        ></audio>
        <audio
          id="newMessageAbiertoSound"
          src={newMessageAbierto}
          preload="true"
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
