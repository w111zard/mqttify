export default interface Config {
    protocol: 'mqtt' | 'ws';
    host: string;
    port: number;
    username?: string;
    password?: string;

    load(): Promise<void>;
}