#!/usr/bin/env node

import App from './app';

async function bootstrap() {
    const app = new App();
    await app.start();
}

bootstrap();