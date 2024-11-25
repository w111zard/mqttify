import Client from "../interfaces/client";
import mqtt from "mqtt";

class MqttClient implements Client {
    private readonly client: mqtt.MqttClient;

    constructor(
        private readonly protocol: 'mqtt' | 'ws',
        private readonly host: string,
        private readonly port: number,
    ) {
        this.client = mqtt.connect(`${protocol}://${host}:${port}`);
    }

    async connect(): Promise<void> {
        return new Promise((resolve) => {
            this.client.on('connect', () => {
                resolve();
            });
        });
    }

    publish(topic: string, data: object): void {
        this.client.publish(topic, JSON.stringify(data));
    }
}

export default MqttClient;