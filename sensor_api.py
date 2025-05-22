import os
from datetime import datetime, timezone
from decimal import Decimal

import boto3
from boto3.dynamodb.conditions import Key
from flask import Flask, request, jsonify
from flask_cors import CORS


class SensorAPI:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)
        profile = os.getenv('AWS_PROFILE')
        if profile:
            self.session = boto3.Session(profile_name=profile)
        else:
            self.session = boto3.Session()
        self.dynamodb = boto3.resource('dynamodb', region_name='eu-central-1')
        self.table_name = os.getenv("TABLE_NAME", "sensor_data")
        self.table = self.dynamodb.Table(self.table_name)
        self.setup_routes()

    def setup_routes(self):
        @self.app.route('/sensor_data', methods=['POST'])
        def sensor_data():
            data = request.get_json()
            room_id = data.get('room_id')
            temperature = Decimal(str(data.get('temperature')))
            humidity = Decimal(str(data.get('humidity')))
            timestamp = datetime.now(timezone.utc).isoformat()

            if not room_id or temperature is None or humidity is None:
                return jsonify({"error": "Invalid input"}), 400

            self.table.put_item(
                Item={
                    'room_id': room_id,
                    'timestamp': timestamp,
                    'temperature': temperature,
                    'humidity': humidity
                }
            )

            return jsonify(
                {
                    "room_id": room_id,
                    "timestamp": timestamp,
                    "temperature": temperature,
                    "humidity": humidity
                }
            ), 200

        @self.app.route('/sensor_data', methods=['GET'])
        def get_sensor_data():
            room_id = request.args.get('room_id')
            limit = request.args.get('limit', default=10, type=int)

            if room_id:
                response = self.table.query(
                    KeyConditionExpression=Key('room_id').eq(room_id),
                    ScanIndexForward=False,
                    Limit=limit
                )
                items = response.get('Items', [])
            else:
                response = self.table.scan()
                items = response.get('Items', [])
                items.sort(key=lambda x: x['timestamp'], reverse=True)
                items = items[:limit]

            return jsonify(items), 200

    def run(self, debug=True):
        self.app.run(debug=debug)
