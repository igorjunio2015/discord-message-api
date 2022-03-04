const { Client, Intents, MessageActionRow, MessageButton, Interaction, MessageAttachment } = require("discord.js");
const { userMention } = require("@discordjs/builders");
const logger = require("npmlog");

const emojiAniversario = '<a:niver:908728918767439903>';

const client = new Client({
  intents:
    [Intents.FLAGS.GUILDS
      , Intents.FLAGS.GUILD_MESSAGES
      , Intents.FLAGS.GUILD_MESSAGE_REACTIONS
      , "GUILD_MEMBERS"],
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  try {
    const message = interaction.message.content//.split(",")[0].replace(/[^a-z0-9]/gi, "");
    var regex = /(\<@)(.*)(\>)/;
    var user = regex.exec(message)[2];

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('aniversario')
          .setLabel(`Mande seus parabéns a ${(await client.users.fetch(user)).username.split(" ")[0]}.`)
          .setStyle('SUCCESS')
          .setEmoji(emojiAniversario),
      );

    if (interaction.customId === 'aniversario') {
      (await client.users.fetch(user)).send(`O colega **${interaction.user.username}** te deseja muitos anos de vida 🥳.`);
      await interaction.update({ components: [row] });
    }
  } catch (err) {
    await interaction.update({ components: [] });
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
    await ch.send({ content: `> @everyone\n ${message}` })
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

async function sendMessageEndomarketing(message, channelId) {
  var res = {};
  await client.channels.fetch(channelId || process.env.CHANNEL_ID_ENDO).then(async (ch) => {

    const guildNw = await client.guilds.fetch(process.env.GUILD_ID);
    var mensagemModificada = message;
    var regex = /(\$)(.*)(\$)/;
    var retirado = regex.exec(message);
    var mentionUser;

    while (retirado) {
      await guildNw.members.fetch()
        .then((m) => {
          m.each(member => {
            if (member.user.discriminator == retirado[2]) {
              mentionUser = userMention(member.user.id);
            }
          })
        })
        .catch((err) => { console.log(err.message) });

      mensagemModificada = mensagemModificada.replace(retirado[0], mentionUser)

      retirado = regex.exec(mensagemModificada);
    }

    await ch.send({ content: `> @everyone\n> ${mensagemModificada}` })
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

async function sendMessageEndomarketingImage(message, channelId, imageUrl) {
  var res = {};
  await client.channels.fetch(channelId || process.env.CHANNEL_ID_ENDO).then(async (ch) => {

    const guildNw = await client.guilds.fetch(process.env.GUILD_ID);
    var mensagemModificada = message;
    var regex = /(\$)(.*)(\$)/;
    var retirado = regex.exec(message);
    var mentionUser;

    while (retirado) {
      await guildNw.members.fetch()
        .then((m) => {
          m.each(member => {
            if (member.user.discriminator == retirado[2]) {
              mentionUser = userMention(member.user.id);
            }
          })
        })
        .catch((err) => { console.log(err.message) });

      mensagemModificada = mensagemModificada.replace(retirado[0], mentionUser)

      retirado = regex.exec(mensagemModificada);
    }

    const attachment = new MessageAttachment(imageUrl);
    
    await ch.send({ content: `> @everyone\n> ${mensagemModificada}`, files: [attachment] })
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

// https://media.discordapp.net/attachments/865222721842970644/949308657533878352/2022-03-03-life-dia-da-mulher-digitais_convite-lives.png?width=1040&height=1039

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

    message = message.replace("$USER", mentionUser);

    if (mentionUser != undefined || mentionUser != null) {
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('aniversario')
            .setLabel(`Mande seus parabéns a ${(membroGuilda.user.username).split(" ")[0]}.`)
            .setStyle('SUCCESS')
            .setEmoji(emojiAniversario),
        );

      await ch.send({ content: `*Olá @everyone, hoje é dia de festa!* \n\n> ${message}`, components: [row] })
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
  sendMessageEveryone,
  sendMessageEndomarketing,
  sendMessageEndomarketingImage
};
