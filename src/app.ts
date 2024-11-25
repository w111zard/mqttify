import Config from "./interfaces/config";
import Client from "./interfaces/client";

class App {
    constructor(
        private readonly client: Client,
    ) {}

    async start(): Promise<void> {
        await this.client.connect();
        console.log('Connected');
    }
}

export default App;