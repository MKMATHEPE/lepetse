FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /build
COPY backend/pom.xml backend/pom.xml
RUN mvn -B -f backend/pom.xml dependency:go-offline
COPY backend/src backend/src
COPY dist dist
RUN mvn -B -f backend/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre-jammy
RUN groupadd --system lepetse && useradd --system --gid lepetse lepetse \
    && mkdir -p /var/data/rfq-files && chown -R lepetse:lepetse /var/data
WORKDIR /app
COPY --from=build /build/backend/target/lepetse-backend-0.0.1-SNAPSHOT.jar /app/server.jar
USER lepetse
ENV SERVER_ADDRESS=0.0.0.0 PORT=8080 RFQ_STORAGE_DIRECTORY=/var/data/rfq-files SESSION_COOKIE_SECURE=true
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=70", "-jar", "/app/server.jar"]
