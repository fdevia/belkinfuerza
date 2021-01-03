const MyMongoLib = require("./MyMongoLib");
const myMongoLib = MyMongoLib();
const urlExistSync = require("url-exist-sync");

//const MyTwilioLib = require("./MyTwilioLib");
//const myTwilioLib = MyTwilioLib();

const MyGupshupLib = require("./MyGupshupLib");
const myGupshupLib = MyGupshupLib();

//const MyChatkitLib = require("./MyChatkitLib");
//const myChatkitLib = MyChatkitLib();

const fetch = require("node-fetch");
const { v1 } = require("uuid");
//let currentResponse = "";
/*
let mainMenu =
  "Bienvenido a _*Linksys*_" +
  "\n" +
  "*Escribe el numero de la opción deseada*" +
  "\n\n" +
  "*1* - Comprar " +
  String.fromCodePoint(0xe21c) +
  " - Campaña Actual " +
  String.fromCodePoint(0x1f6d2) +
  "\n" +
  String.fromCodePoint(0xe21d) +
  " - Solicitar Ficha Tecnica " +
  String.fromCodePoint(0x1f4c4) +
  "\n" +
  String.fromCodePoint(0xe21e) +
  " - Precio Especial " +
  String.fromCodePoint(0x1f64b) +
  "\n" +
  String.fromCodePoint(0xe21f) +
  " - Enviar Factura " +
  String.fromCodePoint(0x1f5e3) +
  "\n" +
  String.fromCodePoint(0xe220) +
  " - Comunicarme Mesa Control " +
  String.fromCodePoint(0x1f935) +
  "\n" +
  String.fromCodePoint(0xe221) +
  " - Agendar llamada Mesa Control " +
  String.fromCodePoint(0x1f4de);
  */
/*  
let mainMenu =
  //"              *Aseguradora Solidaria de Colombia*" +
  //"Bienvenido a _*SERV*_" +
  "Bienvenido a _*ChatCenter*_" +
  " " +
  String.fromCodePoint(0x000ae) +
  "\n\n" +
  "*Escribe el numero de la opción deseada*" +
  "\n" +
  "*1* - Realizar su Pedido " +
  String.fromCodePoint(0x1f9f9) +
  //String.fromCodePoint(0x1f6d2) +
  "\n" +
  "*5* - Comunicarme con un asesor " +
  String.fromCodePoint(0x1f935);
*/

let MyAtender = () => {
  let myExports = this || {};
  myExports.atender = async (
    numtelusr,
    numtelusrGupshup,
    sessionqueue,
    newmessage,
    newName,
    indicativoCountry
  ) => {
    var bandera = "";
    var pais = "";
    switch (indicativoCountry) {
      case "54":
        bandera = "AR";
        pais = "Argentina ";
        break;
      case "501":
        bandera = "BZ";
        pais = "Belice ";
        break;
      case "591":
        bandera = "BO";
        pais = "Bolivia ";
        break;
      case "56":
        bandera = "CL";
        pais = "Chile ";
        break;
      case "57":
        bandera = "CO";
        pais = "Colombia ";
        break;
      case "506":
        bandera = "CR";
        pais = "Costa Rica ";
        break;
      case "593":
        bandera = "EC";
        pais = "Ecuador ";
        break;
      case "503":
        bandera = "SV";
        pais = "El Salvador ";
        break;
      case "502":
        bandera = "GT";
        pais = "Guatemala ";
        break;
      case "504":
        bandera = "HN";
        pais = "Honduras ";
        break;
      case "52":
        bandera = "MX";
        pais = "Mexico ";
        break;
      case "505":
        bandera = "NI";
        pais = "Nicaragua ";
        break;
      case "507":
        bandera = "PA";
        pais = "Panama ";
        break;
      case "595":
        bandera = "PY";
        pais = "Paraguay ";
        break;
      case "51":
        bandera = "PE";
        pais = "Perú ";
        break;
      case "598":
        bandera = "UY";
        pais = "Uruguay ";
        break;
      case "1":
        bandera = "US";
        pais = "USA ";
        break;
      case "58":
        bandera = "VE";
        pais = "Venezuela ";
        break;
    }
    let mainMenu =
      "Bienvenido a *Linksys*" +
      " " +
      pais +
      bandera
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        ) +
      " " +
      "\n" +
      "*Escribe el número de la opción deseada*" +
      "\n\n" +
      String.fromCodePoint(0xe21c) +
      " - Buscar por tipo de producto " +
      //String.fromCodePoint(0x1f6d2) +
      String.fromCodePoint(0x1f50d) +
      "\n" +
      String.fromCodePoint(0xe21d) +
      " - Ayuda conseguir equipo ideal " +
      String.fromCodePoint(0x1f64b) +
      //String.fromCodePoint(0x1f4c4)
      "\n" +
      String.fromCodePoint(0xe21e) +
      " - Ficha técnica " +
      String.fromCodePoint(0x1f4d6) +
      //String.fromCodePoint(0x1f4c4)
      "\n" +
      String.fromCodePoint(0xe21f) +
      " - Calendario de eventos / Webinar " +
      String.fromCodePoint(0x1f4cd) +
      "\n" +
      String.fromCodePoint(0xe220) +
      " - Precio especial/Reserva de Oportunidad" +
      String.fromCodePoint(0x1f4c4) +
      //String.fromCodePoint(0x1f50d) +
      //String.fromCodePoint(0x1f5e3) +
      "\n" +
      String.fromCodePoint(0xe221) +
      " - Ultimas Tecnologías Linksys" +
      //String.fromCodePoint(0x1f4de);
      String.fromCodePoint(0x1f6e0) +
      "\n" +
      String.fromCodePoint(0xe222) +
      " - Soporte técnico" +
      //String.fromCodePoint(0x1f4de);
      String.fromCodePoint(0x1f393);

    /* let mainMenu =
      "Bienvenido a *Keralty*" +
      " " +
      pais +
      bandera
        .toUpperCase()
        .replace(/./g, (char) =>
          String.fromCodePoint(char.charCodeAt(0) + 127397)
        ) +
      " " +
      "\n" +
      "*Escribe el numero de la opción deseada*" +
      "\n\n" +
      String.fromCodePoint(0xe21c) +
      " - Comprar Monturas " +
      //String.fromCodePoint(0x1f6d2) +
      String.fromCodePoint(0x1f453) +
      "\n" +
      String.fromCodePoint(0xe21d) +
      " - Descargar Resultado " +
      String.fromCodePoint(0x1f4c7) +
      //String.fromCodePoint(0x1f4c4)
      "\n" +
      String.fromCodePoint(0xe21e) +
      " - Contactar Operador " +
      String.fromCodePoint(0x1f4de);
    */
    mainMenu = "Hola " + newName + "\n" + mainMenu;
    //mainMenu = newName;
    let palabras = newmessage.split(" ");
    let currentResponse = "";
    /*
    if (palabras[0].length > 1) {
      palabras[0] = palabras[0].substring(0, 1);
    }
    */
    let subMenuOpcion1 =
      "     " +
      "*Selecióne Tipo de Producto*" +
      "\n\n" +
      "     " +
      String.fromCodePoint(0xe21c) +
      " - Routers" +
      "\n" +
      "     " +
      String.fromCodePoint(0xe21d) +
      " - Sistemas Wifi Mesh" +
      "\n" +
      "     " +
      String.fromCodePoint(0xe21e) +
      " - Repetidor/Extensor" +
      "\n" +
      "     " +
      String.fromCodePoint(0xe21f) +
      " - Adaptadores Wifi" +
      "\n" +
      "     " +
      String.fromCodePoint(0xe220) +
      " - Switch" +
      "\n" +
      "     " +
      String.fromCodePoint(0xe221) +
      " - Access Point" +
      "\n" +
      "     " +
      String.fromCodePoint(0xe222) +
      " - Menú Anterior";
    switch (sessionqueue.length) {
      case 0: //sessionqueue.length
        switch (parseInt(palabras[0])) {
          case 1:
            sessionqueue.push(palabras[0]);
            try {
              await myMongoLib.postConversacionSessionQueue(
                numtelusr,
                sessionqueue
              );
            } catch (e) {
              console.log(e);
            }
            //console.log("llego");
            //https://form.jotform.com/200147101262033
            //currentResponse = "https://form.jotform.com/200147101262033";
            //currentResponse = "https://form.jotformz.com/93186700022651";
            currentResponse = subMenuOpcion1;
            break;
          case 2:
            currentResponse = "https://configurador.ecoweb.com.mx";
            /*
              sessionqueue.push(palabras[0]);
              //console.log("ingreso 2");
              //res.send(userphonenumber);
              try {
                await myMongoLib.postConversacionSessionQueue(
                  numtelusr,
                  sessionqueue
                );
              } catch (e) {
                console.log(e);
              }
              currentResponse = "*Digita Numero de Cedula :* ";
              */
            break;
          case 3:
            sessionqueue.push(palabras[0]);
            //console.log("ingreso 2");
            //res.send(userphonenumber);
            try {
              await myMongoLib.postConversacionSessionQueue(
                numtelusr,
                sessionqueue
              );
            } catch (e) {
              console.log(e);
            }
            currentResponse = "*Digita el número de parte :* ";
            break;
          /*

            await myGupshupLib.sendMessageToUser(
              "file",
              "na",
              "573046636936",
              numtelusrGupshup,
              //"573004654173",
              //
              //  "https://www.buildquickbots.com/whatsapp/media/sample/pdf/sample01.pdf",
              //  "My Caption",
              //  "Sampleq.pdf"
              "https://res.cloudinary.com/https-tracktogo-co/image/upload/v1606492454/WhatsAppImage2020-11-27_lhmv0a.jpg",
              "Linksys News",
              "Linksys News.jpg"
            );
            await myMongoLib.postConversacionEmptyQueue(numtelusr);
            currentResponse = "*Archivo enviado*";
            //currentResponse = "https://appstogoecommerce.herokuapp.com/";
            //currentResponse = "https://form.jotformeu.com/93195970337366";
            break;
            */
          case 4:
            switch (bandera) {
              case "MX":
                currentResponse = "https://form.jotform.com/202775700733050";
                break;
              case "CL":
                currentResponse = "https://form.jotform.com/202775700733050";
                break;
              case "CO":
                currentResponse = "https://form.jotform.com/202775700733050";
                break;
              case "GT":
                currentResponse = "https://form.jotform.com/202775700733050";
                break;
              case "CR":
                currentResponse = "https://form.jotform.com/202775700733050";
                break;
              case "PA":
                currentResponse = "https://form.jotform.com/202775700733050";
                break;
            }
            break;

          /*
            case 5:
              sessionqueue.push(palabras[0]);
              console.log(numtelusr + " " + palabras[0]);
              try {
                let myAgente = await myMongoLib.getAgenteDisponible();
                if (myAgente !== "Agente no disponible") {
                  myMongoLib.postConversacionSessionQueue(
                    numtelusr,
                    sessionqueue
                  );
  
                  myMongoLib.postConversacionCurrentAgent(
                    numtelusr,
                    myAgente.cedula
                  );
  
                  myMongoLib.postConversacionAgente(numtelusr, myAgente.cedula);
  
                  await myMongoLib.addConvAgente(myAgente.cedula);
  
                  await myMongoLib.postAgenteCurrentUsrTelNum(
                    myAgente.cedula,
                    numtelusr
                  );
  
                  //await myChatkitLib.addUserToRoom(numtelusr, "1018505033");
                  currentResponse =
                    "En un momento " + myAgente.name + " Le Atendera";
  
                  let messageId = v1();
  
                  await myMongoLib.postConversacionMensaje(
                    messageId + "5Init",
                    numtelusr,
                    currentResponse,
                    myMongoLib.fuentes.BOT,
                    myAgente.cedula
                  );
                  //let agente = await MyMongoLib.findAgenteCurrentUsrTelNum(numtelusr);
                  await myMongoLib.postAgenteMensaje(
                    messageId + "5Init",
                    numtelusr,
                    currentResponse,
                    myMongoLib.fuentes.BOT,
                    myAgente.cedula
                  );
  
                  fetch(
                    "https://my-chat-kit.herokuapp.com/newConversation/" +
                      myAgente.cedula +
                      "/" +
                      numtelusr,
                    { method: "POST" }
                  );
                } else {
                  myMongoLib.postConversacionEmptyQueue(numtelusr);
                  currentResponse = "Lo sentimos no hay Agente disponible";
                }
              } catch (e) {
                console.log(e);
              }
              break;
              */
          case 5:
            switch (bandera) {
              case "MX":
                currentResponse = "https://form.jotformz.com/93186536587674";
                break;
              case "CL":
                currentResponse = "https://form.jotformz.com/93186536587674";
                break;
              case "CO":
                currentResponse = "https://form.jotformz.com/93186536587674";
                break;
              case "GT":
                currentResponse = "https://form.jotformz.com/93186536587674";
                break;
              case "CR":
                currentResponse = "https://form.jotformz.com/93186536587674";
                break;
              case "PA":
                currentResponse = "https://form.jotformz.com/93186536587674";
                break;
            }
            break;
          case 6:
            if (
              urlExistSync(
                "https://res.cloudinary.com/https-tracktogo-co/image/upload/linksysfichas/Solucion_Mesh_Linksys.pdf"
              )
            ) {
              await myGupshupLib.sendMessageToUser(
                "file",
                "na",
                "573046636936",
                numtelusrGupshup,
                "https://res.cloudinary.com/https-tracktogo-co/image/upload/linksysfichas/Solucion_Mesh_Linksys.pdf",
                "Solucion_Mesh_Linksys",
                "Solucion_Mesh_Linksys.pdf"
              );
              await myMongoLib.postConversacionEmptyQueue(numtelusr);
              currentResponse = "*Documento enviado*";
            } else {
              currentResponse = "Documento no Encontrado " + "\n" + mainMenu;
              console.log(currentResponse);
              try {
                await myMongoLib.postConversacionEmptyQueue(numtelusr);
              } catch (e) {
                console.log(e);
              }
            }
            break;
          case 7:
            switch (bandera) {
              case "MX":
                currentResponse = "https://www.linksys.com/mx/support/";
                break;
              case "CL":
                currentResponse = "https://www.linksys.com/cl/support/";
                break;
              case "CO":
                currentResponse = "https://www.linksys.com/co/support/";
                break;
              case "GT":
                currentResponse = "https://www.linksys.com/gt/support/";
                break;
              case "CR":
                currentResponse = "https://www.linksys.com/cr/support/";
                break;
              case "PA":
                currentResponse = "https://www.linksys.com/pa/support/";
                break;
            }
            break;
          default:
            currentResponse = mainMenu;
            //currenResponse = "Lo siento opcion no reconocida";
            break;
        }
        break;
      case 1: //sessionqueue.length
        /*
          switch (parseInt(sessionqueue[0])) {
            case 1:
              switch (palabras[0]) {
                case "a":
                  currentResponse =
                    palabras[0] + "https://configurador.ecoweb.com.mx";
                  break;
                default:
                  break;
              }
            default:
              break;
          }
          */
        switch (parseInt(sessionqueue[0])) {
          case 1:
            switch (palabras[0]) {
              case "1":
                switch (bandera) {
                  case "MX":
                    currentResponse =
                      "https://www.linksys.com/mx/c/routers-inalambricos";
                    break;
                  case "CL":
                    currentResponse =
                      "https://www.linksys.com/cl/c/routers-inalambricos";
                    break;
                  case "CO":
                    currentResponse =
                      "https://www.linksys.com/co/c/routers-inalambricos";
                    break;
                  case "GT":
                    currentResponse =
                      "https://www.linksys.com/gt/c/routers-inalambricos";
                    break;
                  case "CR":
                    currentResponse =
                      "https://www.linksys.com/cr/c/routers-inalambricos";
                    break;
                  case "PA":
                    currentResponse =
                      "https://www.linksys.com/pa/c/routers-inalambricos";
                    break;
                }
                break;
              case "2":
                switch (bandera) {
                  case "MX":
                    currentResponse =
                      "https://www.linksys.com/mx/c/sistema-wi-fi-de-malla";
                    break;
                  case "CL":
                    currentResponse =
                      "https://www.linksys.com/cl/c/sistema-wi-fi-de-malla";
                    break;
                  case "CO":
                    currentResponse =
                      "https://www.linksys.com/co/c/sistema-wi-fi-de-malla";
                    break;
                  case "GT":
                    currentResponse =
                      "https://www.linksys.com/gt/c/sistema-wi-fi-de-malla";
                    break;
                  case "CR":
                    currentResponse =
                      "https://www.linksys.com/cr/c/sistema-wi-fi-de-malla";
                    break;
                  case "PA":
                    currentResponse =
                      "https://www.linksys.com/pa/c/sistema-wi-fi-de-malla";
                    break;
                }
                break;
              case "3":
                switch (bandera) {
                  case "MX":
                    currentResponse =
                      "https://www.linksys.com/mx/c/extensor-de-alcance";
                    break;
                  case "CL":
                    currentResponse =
                      "https://www.linksys.com/cl/c/extensor-de-alcance";
                    break;
                  case "CO":
                    currentResponse =
                      "https://www.linksys.com/co/c/extensor-de-alcance";
                    break;
                  case "GT":
                    currentResponse =
                      "https://www.linksys.com/gt/c/extensor-de-alcance";
                    break;
                  case "CR":
                    currentResponse =
                      "https://www.linksys.com/cr/c/extensor-de-alcance";
                    break;
                  case "PA":
                    currentResponse =
                      "https://www.linksys.com/pa/c/extensor-de-alcance";
                    break;
                }
                break;
              case "4":
                switch (bandera) {
                  case "MX":
                    currentResponse =
                      "https://www.linksys.com/mx/c/adaptadores-de-red-usb-inalambricos";
                    break;
                  case "CL":
                    currentResponse =
                      "https://www.linksys.com/cl/c/adaptadores-de-red-usb-inalambricos";
                    break;
                  case "CO":
                    currentResponse =
                      "https://www.linksys.com/co/c/adaptadores-de-red-usb-inalambricos";
                    break;
                  case "GT":
                    currentResponse =
                      "https://www.linksys.com/gt/c/adaptadores-de-red-usb-inalambricos";
                    break;
                  case "CR":
                    currentResponse =
                      "https://www.linksys.com/cr/c/adaptadores-de-red-usb-inalambricos";
                    break;
                  case "PA":
                    currentResponse =
                      "https://www.linksys.com/pa/c/adaptadores-de-red-usb-inalambricos";
                    break;
                }
                break;
              case "5":
                switch (bandera) {
                  case "MX":
                    currentResponse =
                      "https://www.linksys.com/mx/c/conmutadores-de-red";
                    break;
                  case "CL":
                    currentResponse =
                      "https://www.linksys.com/cl/c/conmutadores-de-red";
                    break;
                  case "CO":
                    currentResponse =
                      "https://www.linksys.com/co/c/conmutadores-de-red";
                    break;
                  case "GT":
                    currentResponse =
                      "https://www.linksys.com/gt/c/conmutadores-de-red";
                    break;
                  case "CR":
                    currentResponse =
                      "https://www.linksys.com/cr/c/conmutadores-de-red";
                    break;
                  case "PA":
                    currentResponse =
                      "https://www.linksys.com/pa/c/conmutadores-de-red";
                    break;
                }
                break;
              case "6":
                switch (bandera) {
                  case "MX":
                    currentResponse =
                      "https://www.linksys.com/mx/c/conmutadores-de-red";
                    break;
                  case "CL":
                    currentResponse =
                      "https://www.linksys.com/cl/c/conmutadores-de-red";
                    break;
                  case "CO":
                    currentResponse =
                      "https://www.linksys.com/co/c/conmutadores-de-red";
                    break;
                  case "GT":
                    currentResponse =
                      "https://www.linksys.com/gt/c/conmutadores-de-red";
                    break;
                  case "CR":
                    currentResponse =
                      "https://www.linksys.com/cr/c/conmutadores-de-red";
                    break;
                  case "PA":
                    currentResponse =
                      "https://www.linksys.com/pa/c/conmutadores-de-red";
                    break;
                }
                break;
              case "7":
                currentResponse = mainMenu;
                try {
                  await myMongoLib.postConversacionEmptyQueue(numtelusr);
                } catch (e) {
                  console.log(e);
                }
                break;
              default:
                currentResponse = mainMenu;
                try {
                  await myMongoLib.postConversacionEmptyQueue(numtelusr);
                } catch (e) {
                  console.log(e);
                }
                break;
            }
            break;
          case 3:
            if (
              urlExistSync(
                "https://res.cloudinary.com/https-tracktogo-co/image/upload/linksysfichas/" +
                  palabras[0] +
                  ".pdf"
              )
            ) {
              await myGupshupLib.sendMessageToUser(
                "file",
                "na",
                "573046636936",
                numtelusrGupshup,
                "https://res.cloudinary.com/https-tracktogo-co/image/upload/linksysfichas/" +
                  palabras[0] +
                  ".pdf",
                palabras[0],
                palabras[0] + ".pdf"
              );
              await myMongoLib.postConversacionEmptyQueue(numtelusr);
              currentResponse = "*Archivo enviado*";
            } else {
              currentResponse =
                "Número de parte no encontrado, intente de nuevo opcion 3" +
                "\n" +
                mainMenu;
              console.log(currentResponse);
              try {
                await myMongoLib.postConversacionEmptyQueue(numtelusr);
              } catch (e) {
                console.log(e);
              }
            }
            break;
          default:
            currentResponse = currentResponse + " default " + mainMenu;
            break;
        }
    }
    return currentResponse;
  };
  return myExports;
};

module.exports = MyAtender;
