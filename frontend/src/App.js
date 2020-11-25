import React, { useEffect, useState } from "react";
import Chat from "./components/Chat/Chat";
import Login from "./components/Login/Login";
/*FDC import logo from "./logo.svg" */ import "./App.css";

let getSession = () => {
  if (sessionStorage.id) {
    return {
      id: sessionStorage.id,
      nombre: sessionStorage.nombre,
    };
  } else {
    return undefined;
  }
};

function App() {
  const [currentUser, setCurrentUser] = useState(getSession());

  useEffect(() => {
    /**
    socket.on("connect", function () {
      console.log("Main socket opnened");
      // Envia mensaje con identificacion para que el servidor le cree una room
      socket.emit("identificacion", "1018505033");
    });

    //le llega una nueva conversacion
    socket.on("newConversation", function (clientId) {
      // se suscribe al room de ese cliente
      socket.emit("suscribeTo", clientId);
    });

    socket.on("newMessage", function (clientId) {
      //
    });
    */
    /** EJEMPLO DE COMO ABRIR OTRO SOCKET CON OTRO DE LOS ENDPOINTS DEL SERVIDOR
    const socket2 = socketIOClient("http://localhost:3001/client");
    */
  }, []);

  return (
    <div>
      {currentUser && (
        <Chat currentUser={currentUser} logout={setCurrentUser} />
      )}
      {!currentUser && <Login setUser={setCurrentUser} />}
    </div>
  );
}

export default App;
