const express = require("express");
const logger = require("npmlog");
const discordbot = require("./discord/discord.server");
const messageRoute = require("./routes/message.route");
require("./utils/logger.config");

const app = express();
app.use(express.json());
discordbot.login();

/**
 * @ROUTES
 */

app.use(messageRoute);

app.all("*", (req, res) => {
  return res.status(400).json({ message: "Route or method not allowed ." })
})

/**
 * @CONFIG
 */

var port = process.env.PORT || 3333;

app.listen(port, () => {
  logger.http("SERVER", "is started");
});
