const mqtt = require('mqtt');
const WebSocket = require('ws');

// MQTT konekcija
const mqttClient = mqtt.connect('mqtt://192.168.0.186:1883');

// WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  mqttClient.subscribe('test/topic');
});

mqttClient.on('message', (topic, message) => {
  console.log(`Received message: ${message.toString()}`);
  
  // Emitiraj poruku svim web klijentima
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message.toString());
    }
  });
});

console.log('WebSocket server started on ws://localhost:8080');
