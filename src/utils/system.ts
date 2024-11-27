import fs from 'fs/promises';
import path from 'path';
import {FilterFunction} from "../common/types";

export default class System {
    static async getFilesList(directory: string) {
        return await fs.readdir(directory);
    }

    static async readFiles(directory: string, filter?: FilterFunction<string>) {
        let files = await System.getFilesList(directory);
        if (filter) {
            files = files.filter(filter);
        }
        return await Promise.all(files.map(file => fs.readFile(file, 'utf-8')));
    }
}

async function start() {
    const r = await System.readFiles(process.cwd(), (file) => file.endsWith('.json'));
}

start();