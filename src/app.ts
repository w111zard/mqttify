import Client from "./interfaces/client";
import RequestGroup from "./utils/requests-group";
import System from "./utils/system";
import Graphics from "./utils/graphics";
import Operation from "./utils/operation";
import Request from "./utils/request";

class App {
    private readonly groups: RequestGroup[];
    private readonly history: Operation[];

    constructor(
        private readonly client: Client,
    ) {
        this.groups = [];
        this.history = [];
    }

    async start(): Promise<void> {
        await this.client.connect();
        await this.loadAll();

        const g = new Graphics(this.groups, this.history);
        g.on('send', this.sendRequest.bind(this));
        g.renderMainScreen();
    }

    private async loadAll() {
        const jsonFilesRawData = await System.readFiles(process.cwd(), file => file.endsWith('.json'));
        const jsonFilesData = jsonFilesRawData.map(file => JSON.parse(file));

        const requestGroups = jsonFilesData.filter(data => RequestGroup.isRequestGroup(data));
        if (!requestGroups.length) {
            return await this.stop('No files with requests');
        }

        for (const group of requestGroups) {
            const requestGroup = new RequestGroup(group.name);
            for (const request of group.requests) {
                requestGroup.addRequest(request);
            }
            this.groups.push(requestGroup);
        }
    }

    async sendRequest(request: Request) {
        this.client.publish(request.topic, request.data);
    }

    async stop(message?: string) {
        console.clear();
        if (message) console.log(message);
        console.log('Bye bye');
        await this.client.disconnect();
        process.exit(0);
    }
}

export default App;