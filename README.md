# PawTrack - Sensor Data API

PawTrack is a simple Flask API for recording and retrieving sensor measurements (temperature, humidity) from multiple rooms.  
It stores data in AWS DynamoDB and is designed for easy local development and future AWS Lambda deployment.

---

## Features

- POST sensor measurements with room ID, temperature, and humidity  
- GET latest or all measurements optionally filtered by room ID  
- Uses AWS DynamoDB for persistent storage  
- Supports AWS SSO login profiles  
- Frontend UI to visualize latest sensor data with dark theme and charts (optional)  

---

## Prerequisites

- Python 3.8+  
- AWS CLI configured with your SSO profile  
- AWS DynamoDB table created (`sensor_data` by default)  
- Flask and boto3 Python packages (`pip install -r requirements.txt`)

---

## Setup

1. Clone this repo  
2. Create `.env` file in project root with:

   ```
   AWS_PROFILE=your_sso_profile_name
   DYNAMODB_TABLE=sensor_data
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Run the API locally:

   ```bash
   python app.py
   ```

---

## API Endpoints

### POST /sensor_data

Submit sensor measurement JSON:

```json
{
  "room_id": "bedroom",
  "temperature": 23.5,
  "humidity": 45.3
}
```

Response: stored data with timestamp.

---

### GET /sensor_data?room_id=bedroom&limit=10

Fetch latest sensor data for a room (optional `limit` param).

Response: JSON array of measurements.

---

## Frontend

- Simple HTML + JS frontend in `webapp/` folder (optional)  
- Visualizes latest sensor data with charts  
- Dark theme with responsive design  

---

## Notes

- Keep `.env` and AWS credentials out of version control  
- DynamoDB table name and AWS profile are loaded from environment variables  
- Designed for learning AWS, Flask API, DynamoDB, and frontend integration  

---

## Future Improvements

- Deploy API as AWS Lambda function with API Gateway  
- Integrate real ESP32+DHT22 sensor data  
- Add authentication and authorization  
- Enhance frontend with weather forecasts and historical charts  

---

## License

MIT License © Your Name Here
