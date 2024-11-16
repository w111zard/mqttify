#!/usr/bin/env node

const { Command } = require('commander');

async function start() {
  const program = new Command();

  program
    .name('mqttify')
    .description('Send MQTT messages interactively')
    .version('1.0.0');

  program
    .option('-h, --host <string>', 'hostname')
    .option('-p, --port <number>', 'port')
    .option('-P, --protocol <string>', 'protocol')
    .option('-u, --username <string>', 'username')
    .option('-a, --password <string>', 'password');

  program.parse();
  const options = program.opts();
  console.log(program.args);
  console.log(options);
}

start();