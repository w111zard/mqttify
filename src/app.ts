import fs from 'fs/promises';
import path from 'path';
import prompts from 'prompts';
import Client from "./interfaces/client";
import RequestGroup from "./utils/requests-group";

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
        const dir = '_test';

        const files = await fs.readdir('_test');
        const jsonFiles = files.filter(file => file.endsWith('.json'));


        const filesRawData = await Promise.all(jsonFiles.map(file => fs.readFile(path.join(dir, file), 'utf-8')));
        const groups = filesRawData.map(data => JSON.parse(data));

        for (const group of groups) {
            const requestGroup = new RequestGroup(group.name);
            for (const request of group.requests) {
                requestGroup.addRequest(request);
            }
            this.groups.push(requestGroup);
        }
    }

    private async showGroups() {
        const choices = this.groups.map(g => ({ title: g.name, value: g }));

        const selected = await prompts({
            type: 'select',
            name: 'value',
            message: 'Pick a group',
            choices
        });

        console.log(selected);
    }
}

export default App;