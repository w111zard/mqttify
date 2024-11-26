#!/usr/bin/env node

import path from 'path';
import App from './app';
import FileConfig from "./utils/file-config";
import MqttClient from "./utils/mqtt-client";

async function bootstrap() {
    const config = new FileConfig(path.join(process.cwd(), '.mqttify.json'));
    await config.load();

    const client = new MqttClient(config.protocol, config.host, config.port);

    const app = new App(client);
    await app.start();
}

bootstrap();