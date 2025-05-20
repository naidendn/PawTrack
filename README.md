```
# Sensor API Project

A simple Flask-based API for receiving sensor data (temperature and humidity).

## Features

- POST endpoint `/sensor` to receive temperature and humidity data.
- Returns a plain text response with the received values and a timestamp.

## Getting Started

### Prerequisites

- Python 3.7+
- pip

### Installation

1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd <your-repo-directory>
   ```

2. Install dependencies:
   ```
   pip install flask
   ```

### Running the API

```
python app.py
```

### Testing with Postman

Send a POST request to `http://localhost:5000/sensor` with JSON body:
```json
{
  "temperature": 22,
  "humidity": 55
}
```

## Project Structure

- `app.py` - Entry point to run the API.
- `sensor_api.py` - Contains the `SensorAPI` class and route logic.
- `animal.py` - Example class for demonstration.

## License

MIT
```