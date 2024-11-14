const mqtt = require('mqtt');

class MqttClient {
  constructor(url) {
    this.url = url;
    this.client = mqtt.connect(this.url);
  }

  async connect() {
    return new Promise((resolve) => {
      this.client.on('connect', () => {
        resolve();
      });
    });
  }

  publish(topic, message) {
    this.client.publish(topic, JSON.stringify(message));
  }
}

module.exports = MqttClient;