const express = require("express");
const router = express.Router();
const MyMongoLib = require("../MyMongoLib");
const myMongoLib = MyMongoLib();
//const MyChatkitLib = require("../MyChatkitLib");
//const myChatkitLib = MyChatkitLib();

router.post("/terminarconversacion/:numtel/:agente", function (req, res) {
  let numTel = req.params.numtel;
  let agente = req.params.agente;
  myMongoLib
    .postConversacionEmptyQueue(numTel)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
  myMongoLib.removeConvAgente(agente);
});

router.get("/getMyConversations/:cedula", async function (req, res) {
  let cedula = req.params.cedula;

  try {
    let myConversaciones = await myMongoLib.getConversacionByAgent(cedula);
    //throw new Error("my Generated Exception message");
    res.send(myConversaciones);
  } catch (err) {
    res.send(err);
  }
});

router.get("/getMyConversationsHistorial/:cedula", async function (req, res) {
  let cedula = req.params.cedula;

  try {
    let myConversaciones = await myMongoLib.getConversacionByAgentHistorial(
      cedula
    );
    //throw new Error("my Generated Exception message");
    res.send(myConversaciones);
  } catch (err) {
    res.send(err);
  }
});

router.get("/conversacionesAgente", function (req, res) {
  myMongoLib
    .getConversacionesAgente()
    .then((conversaciones) => {
      res.send(conversaciones);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/conversacionesAgente", function (req, res) {
  myMongoLib
    .getConversacionesAgente()
    .then((conversaciones) => {
      res.send(conversaciones);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/conversaciones", function (req, res) {
  myMongoLib
    .getConversaciones()
    .then((conversaciones) => {
      res.send(conversaciones);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/conversacion/:usrtelnum", function (req, res) {
  let usrtelnum = req.params.usrtelnum;
  myMongoLib
    .getConversacion(usrtelnum)
    .then((conversaciones) => {
      res.send(conversaciones);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/conversacionessearchtext/:cedula/:texttofind", function (
  req,
  res
) {
  let cedula = req.params.cedula;
  let texttofind = req.params.texttofind;

  myMongoLib
    .getConversacionesSearchText(cedula, texttofind)
    .then((conversaciones) => {
      res.send(conversaciones);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/usuarios", function (req, res) {
  myMongoLib
    .getUsuarios()
    .then((usuarios) => {
      res.send(usuarios);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/agentesstatus/:excludeagent", function (req, res) {
  let excludeagent = req.params.excludeagent;
  myMongoLib
    .getAgentesStatus(excludeagent)
    .then((agentes) => {
      res.send(agentes);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/findadministrador/:email", function (req, res) {
  let email = req.params.email;
  myMongoLib
    .findAdministrador(email)
    .then((administrador) => {
      res.send(administrador);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/postusuario/:numtel", function (req, res) {
  let numtel = req.params.numtel;
  myMongoLib
    .postUsuario(numtel)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post(
  "/postadministrador/:email/:nameusr/:numtelusr/:cedula/:password/:type",
  function (req, res) {
    console.log("aca voy");
    console.log(req.params.email);
    let email = req.params.email;
    let nameusr = req.params.nameusr;
    let numtelusr = req.params.numtelusr;
    let cedula = req.params.cedula;
    let password = req.params.password;
    let type = req.params.type;
    myMongoLib
      .postAdministrador(email, nameusr, numtelusr, cedula, password, type)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.send(err);
      });
  }
);

router.get("/findagentecurrentusrtelnum/:numtelusr", function (req, res) {
  let numtelusr = req.params.numtelusr;
  myMongoLib
    .findAgenteCurrentUsrTelNum(numtelusr)
    .then((usuario) => {
      res.send(usuario);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post(
  "/postagente/:cedula/:name/:grupo/:password/:pswadmin/:wanumber",
  function (req, res) {
    let cedula = req.params.cedula;
    let name = req.params.name;
    let grupo = req.params.grupo;
    let password = req.params.password;
    let pswadmin = req.params.pswadmin;
    let wanumber = req.params.wanumber;
    console.log(pswadmin);
    if (pswadmin === "0109@") {
      myMongoLib
        .postAgente(cedula, name, grupo, password, wanumber)
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });

      myChatkitLib
        .createUser(cedula, name)
        .then((response) => {
          res.send(response);
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      res.send("Privilegios insuficiente");
    }
  }
);

router.post("/postagentemensaje/:numtel/:message/:fuente/:agente", function (
  req,
  res
) {
  let numtel = req.params.numtel;
  let message = req.params.message;
  let fuente = req.params.fuente;
  let agente = req.params.agente;
  myMongoLib
    .postAgenteMensaje(numtel, message, fuente, agente)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/postagentecurrentusrtelnum/:cedula/:usrtelnum", function (
  req,
  res
) {
  let cedula = req.params.cedula;
  let usrtelnum = req.params.usrtelnum;
  myMongoLib
    .postAgenteCurrentUsrTelNum(cedula, usrtelnum)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/postconversacion/:numtel", function (req, res) {
  let numtel = req.params.numtel;
  myMongoLib
    .postConversacion(numtel)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/postconversacionmensaje/:numtel/:message", function (req, res) {
  let numtel = req.params.numtel;
  let message = req.params.message;
  myMongoLib
    .postConversacionMensaje(numtel, message)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/postconversacionagente/:numtelusr/:cedula", function (req, res) {
  let numtelusr = req.params.numtelusr;
  let cedula = req.params.cedula;
  myMongoLib
    .postConversacionAgente(numtelusr, cedula)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/postconversacionactiva/:numtel/:activa", function (req, res) {
  let numTel = req.params.numtel;
  let activa = false;
  if (req.params.activa === "1") {
    activa = true;
  }
  console.log(activa);
  myMongoLib
    .postConversacionActiva(numTel, activa)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
});

router.post("/findusuario/:numtel", function (req, res) {
  let numTel = req.params.numtel;
  myMongoLib
    .findUsuario(numTel)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
