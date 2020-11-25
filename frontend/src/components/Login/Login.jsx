import React, { useRef } from "react";
import "./Login.css";
import Logo from "./ChatCenterLogo.svg";

function Login(props) {
  const userRef = useRef();
  const passwordRef = useRef();

  const handleEntrar = () => {
    fetch("/auth/login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userRef.current.value,
        password: passwordRef.current.value,
      }),
    }).then((res) => {
      res.json().then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          console.log(data);
          sessionStorage.id = data.id;
          sessionStorage.nombre = data.nombre;
          sessionStorage.password = passwordRef.current.value;
          props.setUser(data);
        }
      });
    });
  };
  return (
    <div className="contenedorLogin">
      <img src={Logo} alt="Chat Center Logo" className="logo" />
      <h1>¡Bienvenido a ChatCenter!</h1>
      <h6>Por favor ingresa tu numero de cedula y contraseña</h6>
      <input
        className="inputLogin"
        type="text"
        ref={userRef}
        placeholder="Cédula"
      />
      <br />
      <input
        className="inputLogin"
        type="text"
        ref={passwordRef}
        placeholder="Contraseña"
      />
      <br />
      <button className="botonLogin" onClick={handleEntrar}>
        Entrar
      </button>
    </div>
  );
}

export default Login;
