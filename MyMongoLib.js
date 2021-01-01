const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const assert = require("assert");

const request = require("request");

const createOptions = (phone) => {
  phone = phone.substring(12, 22);
  const options = {
    method: "POST",
    url: "https://api.hubapi.com/contacts/v1/contact/",
    qs: { hapikey: "3323612d-6f7d-46c9-a0d4-253cc518822d" },
    headers: {
      "Content-Type": "application/json",
    },
    body: {
      properties: [
        { property: "email", value: "testingapis@" + phone + ".com" },
        { property: "firstname", value: "test" + phone },
        { property: "lastname", value: "testerson" + phone },
        { property: "website", value: "https://" + phone + "com" },
        { property: "company", value: "HubSpot" },
        { property: "phone", value: phone },
        { property: "address", value: "25 First Street" },
        { property: "city", value: "Cambridge" },
        { property: "state", value: "MA" },
        /*{ property: "ownerId", value: 45536923 },*/
        { property: "zip", value: "02139" },
      ],
    },
    json: true,
  };
  return options;
};

let url =
  //process.env.PROD_MONGODB + "&w=majority" ||
  "mongodb+srv://fdevia:Colombia123@chatcenterdb-rinjl.mongodb.net/test?retryWrites=true&w=majority";
const dbName = "linksysFuerzaDB";

const MyMongoLib = function () {
  /*
    Cliente: 1- xxx = new MyMongoLib();
    new initiate, this = objeto vacio {}
    2- xxx = MyMongoLib()
    this = undefined
    si el this exist use this else use {}}
    */
  const exports = this || {};
  exports.fuentes = {
    USUARIO: "usuario",
    BOT: "bot",
    AGENTE: "agente",
  };

  exports.getConversacion = async (usrtelnum) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const conversacionesCollection = db.collection("conversaciones");
      let conversacionTmp = await conversacionesCollection.findOne({
        numTelUsr: usrtelnum,
      });
      if (conversacionTmp) {
        client.close();
        return conversacionTmp;
      } else {
        client.close();
        return "Conversacion no existe";
      }
    } catch (e) {
      return "hubo un error";
    }
  };

  exports.getConversacionByAgent = async (cedula) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const conversacionesCollection = db.collection("conversaciones");
      let conversacionTmp = await conversacionesCollection.find({
        currentagent: cedula,
      });
      if (conversacionTmp) {
        let response = await conversacionTmp.toArray();
        client.close();
        return response;
      } else {
        client.close();
        return "Conversacion no existe";
      }
    } catch (e) {
      return "hubo un error";
    }
  };

  exports.getConversacionByAgentHistorial = async (cedula) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const conversacionesCollection = db.collection("conversaciones");
      let conversacionTmp = await conversacionesCollection.find({
        agentes: cedula,
      });
      if (conversacionTmp) {
        let response = await conversacionTmp.toArray();
        client.close();
        return response;
      } else {
        client.close();
        return "Conversacion no existe";
      }
    } catch (e) {
      return "hubo un error";
    }
  };

  exports.getConversaciones = () =>
    new Promise((resolve, reject) => {
      console.log("se va a conectar al cliente");
      const client = new MongoClient(url);
      client.connect(function (err, client) {
        if (err !== null) {
          reject(err);
          return;
        }

        console.log("Connected correctly to server");
        const db = client.db(dbName);
        // Insert a single document
        const testCol = db.collection("conversaciones");
        return testCol
          .find({})
          .toArray()
          .then((data) => {
            client.close();
            resolve(data);
          })
          .catch((err) => reject(err));
      });
    });

  exports.getConversacionesSearchText = async (cedula, texttofind) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const agentesCollection = db.collection("agentes");
      let agente = await agentesCollection.findOne({ cedula: cedula });
      // si se quiere buscar sobre todo toca que mensajes sea la
      //lista de todos los mensajes de todos los usuarios,
      //no solo de 1
      let mensajes = agente.mensajes;

      let mensajesFiltered = mensajes.filter((mensaje) =>
        mensaje.texto.includes(texttofind)
      );

      return mensajesFiltered;
    } catch (e) {
      console.log(e);

      return "hubo un error";
    }
  };

  exports.postUsuario = async (numtel, name) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const usrCollection = db.collection("usuarios");
      let usrTmp = await usrCollection.findOne({ numTelUsr: numtel });
      if (usrTmp) {
        client.close();
        return usrTmp;
      } else {
        usrTmp = await usrCollection.insertOne({
          numTelUsr: numtel,
          nameUsr: name,
          cedula: "",
          passwd: "",
        });
        client.close();
        let options = createOptions(numtel);
        request(options, function (error, response, body) {
          if (error) {
            throw new Error(error);
          } else {
            console.log("lo mando ok");
          }
        });
        return usrTmp;
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.postAdministrador = async (
    email,
    nameusr,
    numtelusr,
    cedula,
    password,
    type
  ) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const adminCollection = db.collection("administradores");
      let adminTmp = await adminCollection.findOne({ email: email });
      if (adminTmp) {
        client.close();
        return adminTmp;
      } else {
        adminTmp = await adminCollection.insertOne({
          email: email,
          numTelUsr: numtelusr,
          nameUsr: nameusr,
          cedula: cedula,
          passwd: password,
          type: type,
        });
        client.close();
        return adminTmp.ops[0];
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.postAgente = async (cedula, name, grupo, password, wanumber) => {
    console.log("cedula " + cedula);
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const agentesCollection = db.collection("agentes");
      let agenteTmp = await agentesCollection.findOne({ cedula: cedula });
      if (agenteTmp) {
        client.close();
        return agenteTmp;
      } else {
        console.log("KKKK");
        agenteTmp = await agentesCollection.insertOne({
          cedula: cedula,
          name: name,
          grupo: grupo,
          password: password,
          numconv: 0,
          logged: "false",
          wanumber: wanumber,
          currentusrtelnum: "",
          mensajes: [],
        });
        client.close();
        return agenteTmp.ops[0];
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.postConversacion = async (numtel, name) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const conversacionCollection = db.collection("conversaciones");
      let conversacionTmp = await conversacionCollection.findOne({
        numTelUsr: numtel,
      });
      if (conversacionTmp) {
        client.close();
        return conversacionTmp;
      } else {
        conversacionTmp = await conversacionCollection.insertOne({
          numTelUsr: numtel,
          nameUsr: name,
          createdAt: new Date(),
          empresa: "",
          sessionQueue: [],
          mensajes: [],
          currentagent: null,
          agentes: [],
        });
        client.close();
        return conversacionTmp.ops[0];
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.postConversacionCurrentAgent = async (numtelusr, cedula) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const conversacionCollection = db.collection("conversaciones");
      let conversacionTmp = await conversacionCollection.findOne({
        numTelUsr: numtelusr,
      });
      if (conversacionTmp) {
        conversacionTmp = await conversacionCollection.findOneAndUpdate(
          { numTelUsr: numtelusr },
          { $set: { currentagent: cedula } },
          { returnOriginal: false }
        );
        client.close();
        return conversacionTmp.value;
      } else {
        client.close();
        return "Conversacion no existe";
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.postConversacionAgente = async (numtelusr, cedula) => {
    try {
      console.log("postConversacionAgente " + cedula);
      console.log("postConversacionAgente " + numtelusr);
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const conversacionCollection = db.collection("conversaciones");

      let conversacionTmp = await conversacionCollection.findOne({
        numTelUsr: numtelusr,
        agentes: { $exists: true, $ne: [] },
      });

      if (conversacionTmp !== null) {
        let agentes = conversacionTmp.agentes;
        var stripped = [];

        let agenteFiltered = agentes.filter((agente) =>
          agente.includes(cedula)
        );
        if (agenteFiltered.length === 0) {
          conversacionTmp = await conversacionCollection.updateOne(
            { numTelUsr: numtelusr },
            {
              $push: {
                agentes: cedula,
              },
            },
            { upsert: true }
          );
        } else {
          console.log("Agente ya existe");
        }
      } else {
        await conversacionCollection.updateOne(
          { numTelUsr: numtelusr },
          {
            $push: {
              agentes: cedula,
            },
          },
          { upsert: true }
        );
        console.log("Insertar primer agente");
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.postConversacionMensaje = async (
    message_id,
    numTelUsr,
    message,
    fuente,
    agente,
    urlMedia,
    mimetype
  ) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const conversacionCollection = db.collection("conversaciones");
      let conversacionTmp = await conversacionCollection.findOne({
        numTelUsr: numTelUsr,
      });

      if (conversacionTmp) {
        conversacionTmp = await conversacionCollection.findOneAndUpdate(
          { numTelUsr: numTelUsr },
          {
            $push: {
              mensajes: {
                mensajeid: message_id,
                texto: message,
                fuente: fuente,
                fecha: new Date(),
                agente: agente,
                url: urlMedia,
                mimetype: mimetype,
              },
            },
          },
          { returnOriginal: false }
        );
        client.close();
        return conversacionTmp.value;
      } else {
        client.close();
        return "Conversacion no existe";
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.postAgenteMensaje = async (
    message_id,
    numTelUsr,
    message,
    fuente,
    agente,
    urlMedia,
    mimetype
  ) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const agentesCollection = db.collection("agentes");
      let agenteTmp = await agentesCollection.findOne({
        cedula: agente,
      });

      if (agenteTmp) {
        agenteTmp = await agentesCollection.findOneAndUpdate(
          { cedula: agente },
          {
            $push: {
              mensajes: {
                mensajeid: message_id,
                fecha: new Date(),
                texto: message,
                fuente: fuente,
                usrtelnum: numTelUsr,
                url: urlMedia,
                mimetype: mimetype,
              },
            },
          },
          { returnOriginal: false }
        );
        client.close();

        return agenteTmp.value;
      } else {
        client.close();
        return "Conversacion no existe";
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.postConversacionSessionQueue = async (numtelusr, sessionqueue) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const conversacionCollection = db.collection("conversaciones");
      let conversacionTmp = await conversacionCollection.findOne({
        numTelUsr: numtelusr,
      });
      if (conversacionTmp) {
        conversacionTmp = await conversacionCollection.findOneAndUpdate(
          { numTelUsr: numtelusr },
          { $set: { sessionQueue: sessionqueue } },
          { returnOriginal: false }
        );
        client.close();
        return conversacionTmp.value;
      } else {
        client.close();
        return "Conversacion no existe";
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.postConversacionEmptyQueue = async (numtelusr) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const conversacionCollection = db.collection("conversaciones");
      let conversacionTmp = await conversacionCollection.findOne({
        numTelUsr: numtelusr,
      });
      if (conversacionTmp) {
        conversacionTmp = await conversacionCollection.findOneAndUpdate(
          { numTelUsr: numtelusr },
          { $set: { sessionQueue: [], currentagent: null } },
          { returnOriginal: false }
        );
        client.close();
        return conversacionTmp.value;
      } else {
        client.close();
        return "Conversacion no existe";
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.postConversacionActiva = async (numtel, activa) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const conversacionCollection = db.collection("conversaciones");
      let conversacion = await conversacionCollection.findOne({
        numTelUsr: numtel,
      });
      if (conversacion) {
        conversacion = await conversacionCollection.updateOne(
          { numTelUsr: numtel },
          { $set: { activa: activa } }
        );
        client.close();
        return conversacion;
      } else {
        client.close();
        return "Conversacion no existe";
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.findAdministrador = async (email) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const administradorCollection = db.collection("administradores");
      let administrador = await administradorCollection.findOne({
        email: email,
      });
      if (administrador) {
        client.close();
        return administrador;
      } else {
        client.close();
        return { result: "administrador no existe" };
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.findAgente = async (cedula) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const usuarioCollection = db.collection("agentes");
      let usuario = await usuarioCollection.findOne({
        cedula: cedula,
      });
      if (usuario) {
        client.close();
        return usuario;
      } else {
        client.close();
        return "Agente no existe";
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.findAgenteCurrentUsrTelNum = async (usrtelnum) => {
    try {
      console.log(usrtelnum);
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const agentesCollection = db.collection("agentes");
      let agente = await agentesCollection.findOne({
        currentusrtelnum: usrtelnum,
      });
      if (agente) {
        console.log(agente);
        client.close();
        return agente;
      } else {
        client.close();
        return "Agente no existe";
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.getAgentesStatus = async (excludeagent) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const agentesCollection = db.collection("agentes");

      let agentes = agentesCollection
        .find({ cedula: { $nin: [excludeagent] } })
        .project({ _id: 0, name: 1, logged: 1, cedula: 1 })
        .toArray();
      if (agentes) {
        console.log(agentes);
        client.close();
        return agentes;
      } else {
        client.close();
        return "agentesCollection no disponible";
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.getAgenteDisponible = async () => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const agentesCollection = db.collection("agentes");

      let agente = await agentesCollection.findOne({
        $query: { logged: "true" },
        $orderby: { numconv: 1 },
      });
      if (agente) {
        client.close();
        return agente;
      } else {
        client.close();
        return "Agente no disponible";
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.login = async (cedula) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const agentesCollection = db.collection("agentes");
      let agente = await agentesCollection.findOneAndUpdate(
        { cedula: cedula },
        { $set: { logged: "true" } },
        { returnOriginal: false }
      );
      if (agente) {
        client.close();
        return agente;
      } else {
        client.close();
        return "Agente no encontrado";
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.logout = async (cedula) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const agentesCollection = db.collection("agentes");
      let agente = await agentesCollection.findOneAndUpdate(
        { cedula: cedula },
        { $set: { logged: "false" } },
        { returnOriginal: false }
      );
      if (agente) {
        client.close();
        return agente;
      } else {
        client.close();
        return "Agente no encontrado";
      }
    } catch (e) {
      console.log(e);
    }
  };

  exports.addConvAgente = async (cedula) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const agentesCollection = db.collection("agentes");
      agentesCollection.findOneAndUpdate(
        { cedula: cedula },
        {
          $inc: {
            numconv: 1, // Increment by -1
          },
        }
      );
      client.close();
      return "OK";
    } catch (e) {
      console.log(e);
    }
  };

  exports.subConvAgente = async (cedula) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const agentesCollection = db.collection("agentes");
      agentesCollection.findOneAndUpdate(
        { cedula: cedula },
        {
          $inc: {
            numconv: -1, // Increment by -1
          },
        }
      );
      client.close();
      return "OK";
    } catch (e) {
      console.log(e);
    }
  };

  exports.postAgenteCurrentUsrTelNum = async (cedula, usrtelnum) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const agentesCollection = db.collection("agentes");
      agentesCollection.findOneAndUpdate(
        { cedula: cedula },
        { $set: { currentusrtelnum: usrtelnum } },
        { returnOriginal: false }
      );
      client.close();
      return "OK";
    } catch (e) {
      console.log(e);
    }
  };

  exports.removeConvAgente = async (cedula) => {
    try {
      const client = new MongoClient(url);
      await client.connect();
      const db = client.db(dbName);
      const agentesCollection = db.collection("agentes");
      agentesCollection.findOneAndUpdate(
        { cedula: cedula },
        {
          $inc: {
            numconv: -1, // Increment by -1
          },
        }
      );
      client.close();
      return "OK";
    } catch (e) {
      console.log(e);
    }
  };

  return exports;
};

module.exports = MyMongoLib;
