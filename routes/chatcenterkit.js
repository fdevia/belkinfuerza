const express = require("express");
const fileUpload = require("express-fileupload");
const router = express.Router();

const MyMongoLib = require("../MyMongoLib");
const myMongoLib = MyMongoLib();
const fetch = require("node-fetch");

const MyGupshupLib = require("../MyGupshupLib");
const myGupshupLib = MyGupshupLib();

const { v1 } = require("uuid");
const cloudinary = require("cloudinary");

router.use(
  fileUpload({
    useTempFiles: true,
  })
);

/*Mateo
cloudinary.config({
  cloud_name: "drfggfn8f",
  api_key: "694159519369718",
  api_secret: "jwkPS4klzsaEHd-eNf8HIiPkHW8",
});
*/
//FDC
cloudinary.config({
  cloud_name: "https-tracktogo-co",
  api_key: "438311768677242",
  api_secret: "mQ2vOmnpG6irGPktMC8LhmRmorg",
});

router.post("/agentmessage", async function (req, res) {
  console.log("ssss");

  let mensaje = "";
  let usrtelnum = "";
  let cedula = "";
  let messageId = v1();

  if (req.files) {
    usrtelnum = req.query.usrtelnum.replace(" ", "+");
    cedula = req.query.cedula;

    let file = req.files.file;
    console.log(file.mimetype);
    cloudinary.v2.uploader.upload(
      file.tempFilePath,
      {
        folder: "/chatcenter",
      },
      async (err, res2) => {
        if (err) {
          console.log(err);
        }
        try {
          let myurlOk = res2.url.replace("http", "https");
          let myurl =
            "https://www.buildquickbots.com/whatsapp/media/sample/pdf/sample01.pdf";

          await myGupshupLib.sendMessageToUser(
            "file",
            "na",
            "917834811114",
            usrtelnum.substr(10, 22),
            myurl,
            "SampleChatCenter.pdf",
            "CaptionChatCenter"
          );
          /*let twilioRes = await myTwilioLib.sendFile(usrtelnum, myurl);
          let messageSid = twilioRes.sid;*/
          await myMongoLib.postConversacionMensaje(
            messageId + "Agent",
            usrtelnum,
            "",
            myMongoLib.fuentes.AGENTE,
            cedula,
            myurlOk,
            file.mimetype
          );

          await myMongoLib.postAgenteMensaje(
            messageId + "Agent",
            usrtelnum,
            "",
            myMongoLib.fuentes.AGENTE,
            cedula,
            myurlOk,
            file.mimetype
          );
          let response = await myMongoLib.getConversacionByAgent(cedula);
          res.send(response);
        } catch (err2) {
          console.log("Error al enviar archivo a twilio: ", err2);
        }
      }
    );
  } else {
    mensaje = req.body.mensaje;
    usrtelnum = req.body.to;
    cedula = req.body.from;

    await myGupshupLib.sendMessageToUser(
      "text",
      mensaje,
      "917834811114",
      usrtelnum.substr(10, 22),
      "na",
      "na",
      "na"
    );

    await myMongoLib.postConversacionMensaje(
      messageId + "Agent",
      usrtelnum,
      mensaje,
      myMongoLib.fuentes.AGENTE,
      cedula
    );

    await myMongoLib.postAgenteMensaje(
      messageId + "Agentxx",
      usrtelnum.substr(10, 22),
      mensaje,
      myMongoLib.fuentes.AGENTE,
      cedula
    );
    let response = await myMongoLib.getConversacionByAgent(cedula);
    console.log(response + "eeeeee");
    res.send(response);
  }
});

router.post(
  "/transferiragente/:cedulaold/:cedulanew/:numtelusr",
  async function (req, res) {
    let cedulaold = req.params.cedulaold;
    let cedulanew = req.params.cedulanew;
    let numtelusr = req.params.numtelusr;

    console.log(cedulaold);
    console.log(cedulanew);
    console.log(numtelusr);

    await myMongoLib.postConversacionCurrentAgent(numtelusr, cedulanew);
    myMongoLib.postConversacionAgente(numtelusr, cedulanew);
    myMongoLib.addConvAgente(cedulanew);
    myMongoLib.subConvAgente(cedulaold);
    myMongoLib.postAgenteCurrentUsrTelNum(cedulanew, numtelusr);

    fetch(
      "https://my-chat-kit.herokuapp.com/newConversation/" +
        cedulanew +
        "/" +
        numtelusr,
      { method: "POST" }
    );
    res.send("ok");
  }
);
module.exports = router;
