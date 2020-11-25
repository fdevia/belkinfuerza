var fetch = require("node-fetch");

const MyGupshupLib = function () {
  const myExports = this || {};
  myExports.sendMessageToUser = async (
    type,
    texttosend,
    source,
    destination,
    url,
    caption,
    filename
  ) => {
    console.log(
      "MyGupshupLib " +
        type +
        " " +
        texttosend +
        " " +
        source +
        " " +
        destination +
        " " +
        url +
        " " +
        caption +
        " " +
        filename
    );

    let respuesta = "OK";
    let myChannel = "";
    if (
      typeof type === undefined ||
      typeof texttosend === undefined ||
      typeof source === undefined ||
      typeof destination === undefined ||
      typeof url === undefined ||
      typeof caption === undefined ||
      typeof filename === undefined
    ) {
      respuesta = "Expected param missing";
    }

    console.log("MyGupshupLib " + respuesta + " " + type);

    if (respuesta === "OK") {
      switch (type) {
        case "text":
          myChannel =
            "whatsapp&source=" +
            source +
            "&destination=" +
            destination +
            "&message=%7B%22type%22:%22text%22,%22text%22:%22" +
            texttosend.replace(/ /g, "%20") +
            "%22%7D&src.name=ChatCenter";
          console.log(myChannel);
          break;
        case "image":
          myChannel =
            "whatsapp&source=" +
            source +
            "&destination=" +
            destination +
            "&message=%7B%22type%22:%22image%22,%22previewUrl%22:%22" +
            url +
            "%22,%22originalUrl%22:%22" +
            url +
            "%22,%22caption%22:%22%22,%22filename%22:%22" +
            filename +
            "%22%7D&src.name=ChatCenter";
          console.log(myChannel);
          break;
        case "file":
          myChannel =
            "whatsapp&source=" +
            source +
            "&destination=" +
            destination +
            "&message=%7B%22type%22:%22file%22,%22url%22:%22" +
            url +
            "%22,%22caption%22:%22" +
            "%22,%22filename%22:%22" +
            filename +
            "%22%7D&src.name=ChatCenter";
          console.log("MyGupshupLib " + myChannel);
          break;
        case "audio":
          myChannel =
            "whatsapp&source=" +
            source +
            "&destination=" +
            destination +
            "&message=%7B%22type%22:%22audio%22,%22url%22:%22" +
            url +
            "%22,%22caption%22:%22" +
            caption +
            "%22,%22filename%22:%22" +
            filename +
            "%22%7D&src.name=ChatCenter";
          console.log(myChannel);
          break;
        case "video":
          myChannel =
            "whatsapp&source=" +
            source +
            "&destination=" +
            destination +
            "&message=%7B%22type%22:%22video%22,%22url%22:%22" +
            url +
            "%22,%22caption%22:%22" +
            caption +
            "%22,%22filename%22:%22" +
            filename +
            "%22%7D&src.name=ChatCenter";
          console.log(myChannel);
          break;
        default:
          myChannel = "";
          break;
      }
    }

    console.log("ch " + myChannel);

    await fetch("https://api.gupshup.io/sm/api/v1/msg", {
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
    });
    return respuesta;
    /*
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        res.json(json);
      });
    res.send(respuesta);
    */
  };
  return myExports;
};

module.exports = MyGupshupLib;
