# ---------- Build stage ----------
FROM eclipse-temurin:25-jdk AS build
WORKDIR /app

# Install Maven
ARG MAVEN_VERSION=3.9.9
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates \
    && curl -fsSL https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
       -o /tmp/maven.tar.gz \
    && tar -xzf /tmp/maven.tar.gz -C /opt \
    && ln -s /opt/apache-maven-${MAVEN_VERSION}/bin/mvn /usr/local/bin/mvn \
    && rm /tmp/maven.tar.gz \
    && apt-get purge -y curl ca-certificates \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

RUN java -version && mvn -version

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build the jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# ---------- Runtime stage ----------
FROM eclipse-temurin:25-jre
WORKDIR /app

RUN groupadd -r app && useradd -r -g app app

COPY --from=build /app/target/*.jar app.jar

RUN mkdir -p /app/data /app/uploads && chown -R app:app /app
USER app

EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseZGC", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]