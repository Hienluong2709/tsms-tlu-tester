FROM eclipse-temurin:21-jdk-alpine

# Tạo thư mục app
WORKDIR /app

# Copy file JAR vào container
COPY target/*.jar app.jar

# Chạy ứng dụng Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
