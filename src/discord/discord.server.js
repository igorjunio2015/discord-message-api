const { Client, Intents, MessageActionRow, MessageButton, Interaction } = require("discord.js");
const { userMention } = require("@discordjs/builders");
const logger = require("npmlog");

const client = new Client({
  intents:
    [Intents.FLAGS.GUILDS
      , Intents.FLAGS.GUILD_MESSAGES
      , Intents.FLAGS.GUILD_MESSAGE_REACTIONS
      , "GUILD_MEMBERS"],
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const user = interaction.message.content.split(",")[0].replace(/[^a-z0-9]/gi, "");

  const row = new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('aniversario')
        .setLabel(`Deseje feliz aniversário ao ${(await client.users.fetch(user)).username.split(" ")[0]}.`)
        .setStyle('SUCCESS')
        .setEmoji('🥳'),
    );

  if (interaction.customId === 'aniversario') {
    (await client.users.fetch(user)).send(`O colega **${interaction.user.username}** te deja muitos anos de vida 🥳.`);
    await interaction.update({ components: [row] });
  }

});

async function login() {
  var res = {};
  client.login(process.env.TOKEN)
    .then(() => {
      logger.info("DS LOGIN", `${client.user.tag} is online!`);
      res = { login: true, status: `${client.user.tag} is online!` };
    })
    .catch((err) => {
      logger.error("DS LOGIN", err.message);
      res = { login: false, status: err.message };
    })
  return res;
}

async function sendMessageEveryone(message) {
  var res = {};
  await client.channels.fetch(process.env.CHANNEL_ID).then(async (ch) => {
    await ch.send({ content: `@everyone\n ${message}` })
      .then((message) => {
        logger.info("DS MESSAGE", `Message '${message}', send on channel ${ch}.`);
        res = { message: true, status: `Message '${message}', send on channel ${ch}.` };
      })
      .catch((err) => {
        throw new Error(err);
      });
  }).catch((err) => {
    logger.error("DS MESSAGE", err);
    res = { message: false, status: err.message };
  });
  return res;
}

async function sendMessageBirthday(message, userId) {
  var res = {};
  await client.channels.fetch(process.env.CHANNEL_ID).then(async (ch) => {
    var mentionUser;
    var membroGuilda;

    const guildNw = await client.guilds.fetch(process.env.GUILD_ID);

    await guildNw.members.fetch()
      .then((m) => {
        m.each(member => {
          if (member.user.discriminator == userId) {
            membroGuilda = member;
            mentionUser = userMention(member.user.id);
          }
        })
      })
      .catch((err) => {
        throw new Error(err.message)
      });

    if (mentionUser != undefined || mentionUser != null) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('aniversario')
            .setLabel(`Deseje feliz aniversário ao ${(membroGuilda.user.username).split(" ")[0]}.`)
            .setStyle('SUCCESS')
            .setEmoji('🥳'),
        );

      await ch.send({ content: `${mentionUser}, ${message}`, components: [row] })
        .then((message) => {
          logger.info("DS MESSAGE", `Message 'tag:${userId}, user:${message}', send on channel ${ch}.`);
          res = { message: true, status: `Message 'tag:${userId}, user:${message}', send on channel ${ch}.` };
        })
        .catch((err) => {
          throw new Error(err);
        });
    } else {
      throw new Error("Not exist userId");
    }

  }).catch((err) => {
    logger.error("DS MESSAGE", err);
    res = { message: false, status: err.message };
  });
  return res;
}

module.exports = {
  login,
  sendMessageBirthday,
  sendMessageEveryone
};
