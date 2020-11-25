const express = require("express");
const router = express.Router();

const MyMongoLib = require("../MyMongoLib");
const myMongoLib = MyMongoLib();

router.post("/login", async (req, res) => {
  let userId = req.body.user;
  let password = req.body.password;
  try {
    let usuario = await myMongoLib.findAgente(userId);
    console.log(usuario);

    let autenticado = usuario.password === password;
    if (autenticado && usuario.logged === "false") {
      myMongoLib.login(userId);
      res.send({
        nombre: usuario.name,
        id: usuario.cedula,
      });
    } else if (!autenticado) {
      res.send({
        error: "credenciales invalidas",
      });
    } else {
      res.send({
        error: "ya has iniciado sesión en otro dispositivo",
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/logout/:user", (req, res) => {
  let userId = req.params.user;
  myMongoLib.logout(userId);
  res.send("OK");
});

module.exports = router;
