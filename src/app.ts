import prompts from 'prompts';
import Client from "./interfaces/client";
import RequestGroup from "./utils/requests-group";
import RequestsGroup from "./utils/requests-group";
import System from "./utils/system";

class App {
    private readonly groups: RequestGroup[];

    constructor(
        private readonly client: Client,
    ) {
        this.groups = [];
    }

    async start(): Promise<void> {
        await this.client.connect();
        await this.loadAll();

        await this.showGroups();

        await this.client.disconnect();
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

    private async showGroups() {
        const choices = this.groups.map(g => ({ title: g.name, value: g }));

        console.clear();
        const selected = await prompts({
            type: 'select',
            name: 'value',
            message: 'Pick a group',
            choices
        }, {
            onCancel: async () => {
                return await this.stop();
            }
        });

        await this.showRequests(selected.value);
    }

    private async showRequests(group: RequestsGroup, index: number = 0): Promise<void> {
        console.clear();

        const choices = group.requests.map(r => ({ title: r.name, value: r }));

        const selected = await prompts({
            type: 'select',
            name: 'value',
            message: 'Pick a request',
            choices,
            initial: index,
        }, {
            onCancel: async () => {
                return await this.showGroups();
            }
        });

        const request = selected.value;
        this.client.publish(request.topic, request.data);

        const nextIndex = index + 1 < group.requests.length ? index + 1 : 0;
        return await this.showRequests(group, nextIndex);
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