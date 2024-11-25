import Config from "./interfaces/config";

class App {
    constructor(
        private readonly config: Config
    ) {}

    async start(): Promise<void> {
        await this.config.load();
    }
}

export default App;