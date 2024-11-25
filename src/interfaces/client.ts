interface Client {
    connect(): Promise<void>;
    publish(topic: string, data: object): void;
}

export default Client;