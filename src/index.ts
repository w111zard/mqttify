#!/usr/bin/env node

import App from './app';
import FileConfig from "./utils/file-config";

async function bootstrap() {
    const config = new FileConfig('.mqttify.json');

    const app = new App(config);
    await app.start();
}

bootstrap();