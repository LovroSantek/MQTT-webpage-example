# ESP32 + MQTT

This project demonstrates basic MQTT communication using an ESP32, a local Mosquitto MQTT broker, a Node.js WebSocket server, and a real-time web dashboard.

The goal is to provide a simple, ready-to-use example for understanding how IoT devices can send data to a web application using MQTT and WebSockets.

## Requirements

Before starting, you need the following tools installed:

- [ESP-IDF](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/index.html) (ESP32 development framework)
- [Mosquitto MQTT Broker](https://mosquitto.org/download/) (local MQTT server)
- [Node.js](https://nodejs.org/en/download) (to run the WebSocket server)

You also need an **ESP32 development board**.

---

## Setup Instructions

### 1. ESP32 Configuration

Open the `main/main.c` file and update your Wi-Fi and MQTT broker settings:

```c
#define WIFI_SSID "YourWiFiName"
#define WIFI_PASS "YourWiFiPassword"
#define MQTT_BROKER_URI "mqtt://YourComputerIPv4:1883"
```

Open the `esp32-mqtt-web/server.js` file and update IPv4 adress:
```c
const mqttClient = mqtt.connect('mqtt://YourComputerIPv4:1883');
```


- Replace `"YourWiFiName"` and `"YourWiFiPassword"` with your Wi-Fi credentials.
- Replace `"YourComputerIPv4"` with the IPv4 address of your computer where Mosquitto is running.

You can find your IPv4 address using:

```bash
ipconfig
```
(on Windows, under Wireless LAN adapter Wi-Fi)

After updating, build and flash your ESP32:

```bash
idf.py build
idf.py -p COMx flash
idf.py monitor
```

*(Replace `COMx` with your actual COM port.)*

---

### 2. Running Mosquitto Broker

Start Mosquitto manually:

```bash
mosquitto -v
```

Make sure port 1883 is allowed through your Windows Firewall (Inbound rule for TCP port 1883).

Verify Mosquitto is listening:

```bash
netstat -ano | findstr :1883
```

If Mosquitto is running, you should see an output like this:


`TCP    0.0.0.0:1883           0.0.0.0:0              LISTENING`

---
### MQTT Topic Subscription

The Node.js server subscribes to a specific MQTT topic to receive messages published by the ESP32.

- **Subscribed Topic:** `test/topic`
- **Expected Messages:** `"correct"`, `"incorrect"`, or other text payloads.

The server listens for incoming MQTT messages and immediately forwards them via WebSocket to any connected web clients.

If you want to change the MQTT topic, edit the subscription line in `esp32-mqtt-web/server.js`:

```javascript
mqttClient.subscribe('test/topic', function (err) {
    if (!err) {
        console.log('Subscribed to topic: test/topic');
    }
});
```
and the line inside `mqtt_event_handler` in `main/main.c`:
```c
esp_mqtt_client_publish(event->client, "test/topic", "incorrect", 0, 1, 0);
```

---

### 3. Running the Node.js Server

Navigate to the project directory:

```bash
cd path/to/your/project
```

Install dependencies:

```bash
npm install mqtt ws
```

Run the server:

```bash
node server.js
```

You should see:

```
Connected to MQTT broker
WebSocket server started on ws://localhost:8080
```

---

### 4. Opening the Web Dashboard

Simply open `index.html` in your browser.

The page will automatically connect to the WebSocket server and display exercise form feedback ("correct" or "incorrect") in real-time.

---

## Updating Wi-Fi or IP Address Later

Whenever you change your network:

- Update `WIFI_SSID` and `WIFI_PASS` in your ESP32 code (`main/main.c`).
- Update `MQTT_BROKER_URI` with the new computer IPv4 address (`mian/main.c` and `esp32-mqtt-web/server.js`).
- Rebuild and reflash your ESP32.

To check your new IP address:

```bash
ipconfig
```

---

## Project Structure

```plaintext
/mqtt-motion-tracker
├── index.html         # Web page with real-time feedback
├── server.js          # Node.js server (MQTT + WebSocket)
├── /main              # ESP32 main application
│   └── main.c
├── package.json       # Node.js dependencies
└── README.md          # Project documentation
```

---

## Summary

| Component | Function |
|:---|:---|
| ESP32 | Publishes messages via MQTT |
| Mosquitto | Local MQTT broker |
| Node.js Server | Receives MQTT and broadcasts to WebSocket clients |
| Web Page | Receives real-time updates and displays feedback |

---

## Notes

- This project is intended for **local network** usage.

---

## Author

Lovro Šantek, April 2025