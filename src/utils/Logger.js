const fs = require('fs');
const dayjs = require("dayjs");
const format = "{tstamp} {tag} {txt}\n";

async function error(content) {
  await write(content, "black", "bgRed", "ERROR", true);
}

async function warn(content) {
  await write(content, "black", "bgYellow", "WARN", false);
}

async function typo(content) {
  await write(content, "black", "bgCyan", "TYPO", false);
}

async function command(content) {
  await write(content, "black", "bgMagenta", "CMD", false);
}

async function scmd(content) {
  await write(content, "black", "bgRed", "SCMD", false);
}

async function event(content) {
  await write(content, "black", "bgGreen", "EVT", false);
}

async function client(content) {
  await write(content, "black", "bgBlue", "CLIENT", false);
}

async function logs(content) {
  await write(content, "black", "bgWhite", "LOG", false);
}

async function write(content, tagColor, bgTagColor, tag, error = false) {
  const chalk = (await import("chalk")).default;
  const timestamp = `[${dayjs().format("DD/MM - HH:mm:ss")}]`;
  const logTag = `[${tag}]`;
  const stream = error ? process.stderr : process.stdout;

  const item = format
    .replace("tstamp", chalk.gray(timestamp))
    .replace("{tag}", chalk[bgTagColor][tagColor](logTag))
    .replace("{txt}", chalk.white(content));
  appendToFile(item);
  stream.write(item);
}

module.exports = { error, warn, typo, command, scmd, event, client, logs };
function appendToFile(content) {
  const filePath = "core/logs/log.txt";
  if (!content) {
    console.error('Le contenu est vide ou non défini.');
    return;
  }

  const strippedContent = content.replace(/\x1B\[[0-9;]*[mK]/g, '');

  const fileExists = fs.existsSync(filePath);
  if (!fileExists) {
    fs.writeFileSync(filePath, '', { flag: 'wx' });
  }

  const lines = strippedContent.split('\n');
  fs.appendFileSync(filePath, lines.join('\n'));
}