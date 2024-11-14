const MqttClient = require('./utils/mqtt-client');
const InputHandler = require('./utils/input-handler');
const FileSystem = require('./utils/file-system');

function validateCommands(commands) {
  if (!Array.isArray(commands)) {
    throw new Error('Commands must be in an array');
  }

  if (!commands.length) {
    throw new Error('There is no commands in file');
  }

  for (const command of commands) {
    const keys = Object.keys(command);
    if (keys.length !== 2) {
      throw new Error('Invalid commands format');
    }
    if (!command.topic || !command.message) {
      throw new Error('Invalid commands format');
    }
  }
}

function publishNextCommand(commands, client) {
  console.log('Publishing next command...');
  const nextCommand = commands.shift();
  client.publish(nextCommand.topic, nextCommand.message);
}


async function start(file) {
  if (!file) {
    console.log('Use: mqttfiy <file>');
    process.exit(1);
  }

  const client = new MqttClient('mqtt://localhost');
  const input = new InputHandler();

  try {
    await client.connect();

    const commands = await FileSystem.readFile(file);
    validateCommands(commands);

    const onKeypress = (chunk, key) => {
      if (key === 'q' || !commands.length) {
        console.log('Exiting...');
        return process.exit(0);
      }

      publishNextCommand(commands, client);
    };

    input.setHandler(onKeypress);

    publishNextCommand(commands, client);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}

start(process.argv[2]);
