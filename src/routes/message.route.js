const { Router } = require("express");
const route = new Router();

const discordClient = require("../discord/discord.server");

/**
 * @ROUTES
 */

route.get("/v1/send", (req, res) => {
  return res.status(200).json({
    message: "Get success",
  });
});

route.post("/v1/message/sendMessageBirthday", checkMessageTextExists, checkUserIdExists, async (req, res) => {
  const { message, userId } = req.body;
  const retorno = await discordClient.sendMessageBirthday(message, userId);

  return res.status(200).json(retorno);
});

route.post("/v1/message/sendMessageEveryone", checkMessageTextExists, async (req, res) => {
  const { message } = req.body;
  const retorno = await discordClient.sendMessageEveryone(message);

  return res.status(200).json(retorno);
})

route.post("/v1/message/sendEndomarketing", checkMessageTextExists, async (req, res) => {
  const { message, channelId } = req.body;
  const retorno = await discordClient.sendMessageEndomarketing(message, channelId);

  return res.status(200).json(retorno);
})

route.post("/v1/message/sendEndomarketingImage", checkMessageTextExists, checkLinkImageExists, async (req, res) => {
  const { message, channelId, image } = req.body;
  const retorno = await discordClient.sendMessageEndomarketingImage(message, channelId, image);

  return res.status(200).json(retorno);
})

route.get("/v1/status", (req, res) => {
  return res.status(200).json({ message: "Mantendo API online." })
})

function checkMessageTextExists(req, res, next) {
  const { message } = req.body;

  if (!message)
    return res.status(400).json({ message: "message not exists on body.", });

  next();
}

function checkUserIdExists(req, res, next) {
  const { userId } = req.body;

  if (!userId)
    return res.status(400).json({ message: "userId not exists on body." })

  next();
}

function checkLinkImageExists(req, res, next) {
  const { image } = req.body;

  if (!userId)
    return res.status(400).json({ message: "image not exists on body." })

  next();
}

module.exports = route;
