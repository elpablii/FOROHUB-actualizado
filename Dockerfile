# Etapa de compilación
FROM maven:3.8.4-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa de ejecución
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Variables de entorno por defecto
ENV DB_FOROHUB=forohub_db
ENV MYSQL_USER=root
ENV MYSQL_PASS=root
ENV JWT_SECRET=jrg666

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
