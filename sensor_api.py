from flask import Flask, request, jsonify
from datetime import datetime, timezone

class SensorAPI:
    def __init__(self):
        self.app = Flask(__name__)
        self.setup_routes()

    def setup_routes(self):
        @self.app.route('/sensor', methods=['POST'])
        def sensor_data():
            data = request.get_json()
            temperature = data.get('temperature')
            humidity = data.get('humidity')
            timestamp = datetime.now(timezone.utc).isoformat()
            return f"temperature: {temperature} and humidity: {humidity} on timestamp: {timestamp}", 200

    def run(self, debug=True):
        self.app.run(debug=debug)