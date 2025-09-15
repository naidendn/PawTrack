# PawTrack

Java Spring Boot application to collect sensor data (temperature & humidity) from ESP32 devices and store it in AWS DynamoDB.

---

## Environment Variables

Create a `.env` file or set these in your deployment environment:

```
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
DYNAMODB_TABLE=
```

---

## Docker Deployment

```bash
# Build Docker image
docker build -t pawtrack:latest .

# Tag for your registry (replace <YOUR_REGISTRY> with your private registry)
docker tag pawtrack:latest <YOUR_REGISTRY>/pawtrack:latest

# Push to private registry
docker push <YOUR_REGISTRY>/pawtrack:latest
```

**Docker Compose example:**

```yaml
version: "3.9"
services:
  pawtrack:
    image: <YOUR_REGISTRY>/pawtrack:latest
    container_name: pawtrack
    ports:
      - "8080:8080"
    environment:
      AWS_REGION: ${AWS_REGION}
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      DYNAMODB_TABLE: ${DYNAMODB_TABLE}
    restart: unless-stopped
```

---

## API Endpoints

- `POST /api/sensor/data` – Submit sensor readings

**Example JSON:**
```json
{
  "room_id": "bedroom",
  "temperature": 26.8,
  "humidity": 60.0
}
```

- `GET /api/sensor/latest/{roomId}` – Get latest reading for a room

**Example response JSON:**
```json
{
  "room_id": "bedroom",
  "temperature": 24.3,
  "humidity": 54.2,
  "timestamp": "2025-09-14T21:48:52.043767853Z"
}
```
