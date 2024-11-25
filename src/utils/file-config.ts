import fs from 'fs/promises';
import Config from "../interfaces/config";

class FileConfig implements Config {
    private _protocol: 'mqtt' | 'ws';
    private _host: string;
    private _port: number;
    private _username: string | undefined;
    private _password: string | undefined;

    constructor(
        private readonly file: string
    ) {
        this._protocol = 'mqtt';
        this._host = 'localhost';
        this._port = 1833;
    }

    async load() {
        const rawData = await fs.readFile(this.file, 'utf-8');
        const data = JSON.parse(rawData);

        this._protocol = data.protocol;
        this._host = data.host;
        this._port = data.port;
        this._username = data.username;
        this._password = data.password;
    }

    get protocol(): 'mqtt' | 'ws' {
        return this._protocol;
    }

    get host(): string {
        return this._host;
    }

    get port(): number {
        return this._port;
    }

    get username(): string | undefined {
        return this._username;
    }

    get password(): string | undefined {
        return this._password;
    }
}

export default FileConfig;