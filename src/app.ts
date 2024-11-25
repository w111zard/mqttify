import fs from 'fs/promises';
import path from 'path';
import prompts from 'prompts';
import Client from "./interfaces/client";
import RequestGroup from "./utils/requests-group";
import RequestsGroup from "./utils/requests-group";

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

        if (this.isEmptyObject(selected)) {
            return await this.stop();
        }

        await this.showRequests(selected.value);
    }

    private async showRequests(group: RequestsGroup, index: number = 0) {
        console.clear();

        const choices = group.requests.map(r => ({ title: r.name, value: r }));

        const selected = await prompts({
            type: 'select',
            name: 'value',
            message: 'Pick a request',
            choices,
            initial: index
        }, {
            onCancel: prompt => {
                console.log('Canceled');
            },

        });

        if (this.isEmptyObject(selected)) {
            return await this.stop();
        }

        const request = selected.value;
        this.client.publish(request.topic, request.data);

        const nextIndex = index + 1 < group.requests.length ? index + 1 : 0;
        await this.showRequests(group, nextIndex);
    }

    private isEmptyObject(obj: object) {
        return Object.keys(obj).length === 0;
    }

    async stop() {
        // console.clear();
        // console.log('Bye bye');
        // await this.client.disconnect();
        // process.exit(0);
    }
}

export default App;