interface Client {
    connect(): Promise<void>;
    publish(topic: string, data: object): void;
    disconnect(): Promise<void>;
}

export default Client;