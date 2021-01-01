const express = require("express");
const router = express.Router();
var fetch = require("node-fetch");

const MyMongoLib = require("../MyMongoLib");
const myMongoLib = MyMongoLib();

const MyAtenderLib = require("../MyAtenderLib");
const myAtenderLib = MyAtenderLib();

const MyGupshupLib = require("../MyGupshupLib");
const myGupshupLib = MyGupshupLib();

const { v1 } = require("uuid");
const { text } = require("express");

router.post("/sms", async (req, res) => {
  const notType = req.body.type;
  const notPayloadType = req.body.payload.type;

  if (notType === "message") {
    //user-event|message-event|message
    //req.body.payload.type === "text"
    switch (notPayloadType) {
      case "text":
        const newMessage = req.body.payload.payload.text;
        //const newName = req.body.payload.sender.name.substr(0, str.indexOf(" "));
        const newName = req.body.payload.sender.name;
        let usrPhoneNumberGupshup = req.body.payload.source;
        let usrPhoneNumber = "whatsapp:+" + req.body.payload.source;
        /*let indicativoCountry = req.body.payload.source.substr(0, 2);*/
        var indicativoCountry = "57";

        if (req.body.payload.source.substr(0, 2) === "54") {
          indicativoCountry = "54";
        }

        if (req.body.payload.source.substr(0, 3) === "501") {
          indicativoCountry = "501";
        }

        if (req.body.payload.source.substr(0, 3) === "591") {
          indicativoCountry = "591";
        }

        if (req.body.payload.source.substr(0, 2) === "56") {
          indicativoCountry = "56";
        }

        if (req.body.payload.source.substr(0, 3) === "506") {
          indicativoCountry = "506";
        }

        if (req.body.payload.source.substr(0, 3) === "593") {
          indicativoCountry = "593";
        }

        if (req.body.payload.source.substr(0, 3) === "503") {
          indicativoCountry = "503";
        }

        if (req.body.payload.source.substr(0, 3) === "502") {
          indicativoCountry = "502";
        }

        if (req.body.payload.source.substr(0, 3) === "504") {
          indicativoCountry = "504";
        }

        if (req.body.payload.source.substr(0, 2) === "52") {
          indicativoCountry = "52";
        }

        if (req.body.payload.source.substr(0, 3) === "505") {
          indicativoCountry = "505";
        }

        if (req.body.payload.source.substr(0, 3) === "507") {
          indicativoCountry = "507";
        }

        if (req.body.payload.source.substr(0, 3) === "595") {
          indicativoCountry = "595";
        }

        if (req.body.payload.source.substr(0, 2) === "51") {
          indicativoCountry = "51";
        }

        if (req.body.payload.source.substr(0, 3) === "598") {
          indicativoCountry = "598";
        }

        if (req.body.payload.source.substr(0, 1) === "1") {
          indicativoCountry = "1";
        }

        if (req.body.payload.source.substr(0, 2) === "58") {
          indicativoCountry = "58";
        }

        let conversacion = {};
        let usuario = {};

        try {
          [usuario, conversacion] = await Promise.all([
            myMongoLib.postUsuario(usrPhoneNumber, newName),
            myMongoLib.postConversacion(usrPhoneNumber, newName),
          ]);
        } catch (e) {
          console.log(e);
        }

        if (conversacion.sessionQueue.length === 0) {
          conversacion = await myMongoLib.postConversacionMensaje(
            v1() + "gupshupA",
            usrPhoneNumber,
            newMessage,
            myMongoLib.fuentes.USUARIO,
            ""
          );
        }

        let respuesta = await myAtenderLib.atender(
          usrPhoneNumber,
          usrPhoneNumberGupshup,
          conversacion.sessionQueue,
          newMessage,
          newName,
          indicativoCountry
        );

        conversacion = await myMongoLib.getConversacion(usrPhoneNumber);

        if (conversacion.sessionQueue.length === 0) {
          await myMongoLib.postConversacionMensaje(
            v1() + "gupshupB",
            usrPhoneNumber,
            respuesta,
            myMongoLib.fuentes.BOT,
            ""
          );
        }
        res.send(respuesta);
        break;
      case "location":
        res.send(
          req.body.payload.payload.latitude +
            " " +
            req.body.payload.payload.longitude +
            " " +
            req.body.payload.sender.name
        );
        break;
      default:
        break;
    }
  } else {
    res.send(notType);
  }
  //res.send(usrPhoneNumber);
  // res.send("Wellcome Brother " + xxx);
});

/*router.post(
  "/sendfile4/:type/:texttosend/:source/:destination/:url/:caption/:filename",*/
router.post("/sendfile4", async (req, res) => {
  /*console.log(
      req.params.type +
      " " +
      req.params.texttosend +
      " " +
      req.params.source +
      " " +
      req.params.destination +
      " " +
      req.params.url +
      " " +
      req.params.caption +
      " " +
      req.params.filename
  );*/
  await myGupshupLib.sendMessageToUser(
    "file",
    "na",
    "917834811114",
    "573004654173",
    "https://www.buildquickbots.com/whatsapp/media/sample/pdf/sample01.pdf",
    "My Caption",
    "Sampley.pdf"
  );
  res.send("ok");
});

router.post("/sendfile3/:type", async (req, res) => {
  let sdf = await myGupshupLib.sendMessageToUser(
    "file",
    "na",
    "917384811114",
    "573004654173",
    "https://www.buildquickbots.com/whatsapp/media/sample/pdf/sample01.pdf",
    "na",
    "Sample.pdf"
  );
  res.send(sdf);
});

router.post(
  "/sendfile2/:type/:texttosend/:source/:destination/:url/:caption/:filename",
  async (req, res) => {
    console.log("sssssss");
    await myGupshupLib.sendMessageToUser(
      req.params.type,
      req.params.texttosend,
      req.params.source,
      req.params.destination,
      "https://www.buildquickbots.com/whatsapp/media/sample/pdf/sample01.pdf",
      req.params.caption,
      req.params.filename
    );
    res.send("ok");
  }
);

router.post(
  "/sendfile/:type/:texttosend/:source/:destination/:url/:caption/:filename",
  async (req, res) => {
    let respuesta = "OK";
    let myChannel = "";
    if (
      typeof req.params.type === undefined ||
      typeof req.params.texttosend === undefined ||
      typeof req.params.source === undefined ||
      typeof req.params.destination === undefined ||
      typeof req.params.url === undefined ||
      typeof req.params.caption === undefined ||
      typeof req.params.filename === undefined
    ) {
      respuesta = "Expected param missing";
    }
    console.log(respuesta + " " + req.params.type);

    if (respuesta === "OK") {
      switch (req.params.type) {
        case "text":
          myChannel =
            "whatsapp&source=" +
            req.params.source +
            "&destination=" +
            req.params.destination +
            "&message=%7B%22type%22:%22text%22,%22text%22:%22" +
            req.params.texttosend.replace(/ /g, "%20") +
            "%22%7D&src.name=ChatCenter";
          console.log(myChannel);
          break;
        case "image":
          myChannel =
            "whatsapp&source=" +
            req.params.source +
            "&destination=" +
            req.params.destination +
            "&message=%7B%22type%22:%22image%22,%22previewUrl%22:%22" +
            req.params.url.replace(/@/g, "/") +
            "%22,%22originalUrl%22:%22" +
            req.params.url.replace(/@/g, "/") +
            "%22,%22caption%22:%22%22,%22filename%22:%22" +
            req.param.filename +
            "%22%7D&src.name=ChatCenter";
          console.log(myChannel);
          break;
        case "file":
          myChannel =
            "whatsapp&source=" +
            req.params.source +
            "&destination=" +
            req.params.destination +
            "&message=%7B%22type%22:%22file%22,%22url%22:%22" +
            req.params.url.replace(/@/g, "/") +
            "%22,%22caption%22:%22" +
            req.params.caption +
            "%22,%22filename%22:%22" +
            req.params.filename +
            "%22%7D&src.name=ChatCenter";
          console.log(myChannel);
          break;
        case "audio":
          myChannel =
            "whatsapp&source=" +
            req.params.source +
            "&destination=" +
            req.params.destination +
            "&message=%7B%22type%22:%22audio%22,%22url%22:%22" +
            req.params.url.replace(/@/g, "/") +
            "%22,%22caption%22:%22" +
            req.params.caption +
            "%22,%22filename%22:%22" +
            req.params.filename +
            "%22%7D&src.name=ChatCenter";
          console.log(myChannel);
          break;
        case "video":
          myChannel =
            "whatsapp&source=" +
            req.params.source +
            "&destination=" +
            req.params.destination +
            "&message=%7B%22type%22:%22video%22,%22url%22:%22" +
            req.params.url.replace(/@/g, "/") +
            "%22,%22caption%22:%22" +
            req.params.caption +
            "%22,%22filename%22:%22" +
            req.params.filename +
            "%22%7D&src.name=ChatCenter";
          console.log(myChannel);
          break;
        default:
          myChannel = "";
          break;
      }
    }

    fetch("https://api.gupshup.io/sm/api/v1/msg", {
      credentials: "include",
      headers: {
        accept: "application/json, text/plain, */*",
        apikey: "7fb7904d02cc48c0c8b0eb64bbc985b5",
        authorization: "7fb7904d02cc48c0c8b0eb64bbc985b5",
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-mode": "cors",
      },

      body: "channel=" + myChannel,
      method: "POST",
      mode: "cors",
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        res.json(json);
      });

    res.send(respuesta);
  }
);

module.exports = router;
