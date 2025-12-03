FROM openjdk:26-ea-17-slim

# Install Maven and curl
RUN apt-get update && \
    apt-get install -y maven curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

EXPOSE 8080
CMD ["java", "-jar", "target/sensor-app-1.0.0.jar"]