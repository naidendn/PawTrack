package org.nayden;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;
import software.amazon.awssdk.services.dynamodb.model.PutItemRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryRequest;
import software.amazon.awssdk.services.dynamodb.model.QueryResponse;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@RestController
public class SensorApp {

    @Value("${AWS_REGION:us-central-1}")
    private String awsRegion;

    @Value("${DYNAMODB_TABLE:sensor_data}")
    private String dynamoTable;

    private DynamoDbClient dynamoDB;
    private final RestTemplate restTemplate = new RestTemplate();

    public static void main(String[] args) {
        SpringApplication.run(SensorApp.class, args);
    }

    private DynamoDbClient getDynamoDB() {
        if (dynamoDB == null) {
            dynamoDB = DynamoDbClient.builder()
                    .region(Region.of(awsRegion))
                    .build();
        }
        return dynamoDB;
    }

    // ESP32 posts sensor data here
    @PostMapping("/api/sensor/data")
    public ResponseEntity<String> receiveSensorData(@RequestBody Map<String, Object> data) {
        try {
            String roomId = (String) data.get("room_id");
            double temperature = ((Number) data.get("temperature")).doubleValue();
            double humidity = ((Number) data.get("humidity")).doubleValue();
            String timestamp = OffsetDateTime.now().toString();

            // Save to DynamoDB
            Map<String, AttributeValue> item = new HashMap<>();
            item.put("room_id", AttributeValue.builder().s(roomId).build());
            item.put("timestamp", AttributeValue.builder().s(timestamp).build());
            item.put("temperature", AttributeValue.builder().n(Double.toString(temperature)).build());
            item.put("humidity", AttributeValue.builder().n(Double.toString(humidity)).build());

            PutItemRequest request = PutItemRequest.builder()
                    .tableName(dynamoTable)
                    .item(item)
                    .build();

            getDynamoDB().putItem(request);

            System.out.println("Saved: " + roomId + " - " + temperature + "°C, " + humidity + "%");
            return ResponseEntity.ok("OK");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    // Get latest reading for a room
    @GetMapping("/api/sensor/latest/{roomId}")
    public ResponseEntity<Map<String, Object>> getLatest(@PathVariable String roomId) {
        try {
            QueryRequest request = QueryRequest.builder()
                    .tableName(dynamoTable)
                    .keyConditionExpression("room_id = :roomId")
                    .expressionAttributeValues(Map.of(":roomId", AttributeValue.builder().s(roomId).build()))
                    .scanIndexForward(false)
                    .limit(1)
                    .build();

            QueryResponse response = getDynamoDB().query(request);

            if (response.items().isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Map<String, AttributeValue> item = response.items().get(0);
            Map<String, Object> result = new HashMap<>();
            result.put("room_id", item.get("room_id").s());
            result.put("timestamp", item.get("timestamp").s());
            result.put("temperature", Double.parseDouble(item.get("temperature").n()));
            result.put("humidity", Double.parseDouble(item.get("humidity").n()));

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

}