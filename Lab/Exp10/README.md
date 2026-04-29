# SonarQube Code Quality Lab (Exp10)

## Overview

This experiment demonstrates how to set up and use SonarQube for automated code quality analysis in a containerized environment. SonarQube is a powerful platform for continuous inspection of code quality, detecting bugs, vulnerabilities, and code smells in your projects.

The lab uses Docker Compose to run SonarQube and its PostgreSQL database, and analyzes a sample Java application using the SonarQube scanner.

---

## Architecture

- **SonarQube**: Runs in a Docker container, accessible via web UI on port 9000.
- **PostgreSQL**: Provides persistent storage for SonarQube data.
- **Sample Java App**: A Maven-based Java project with intentional bugs and code smells for demonstration.

```
Sample Java App → Sonar Scanner → SonarQube (Docker) → PostgreSQL (Docker)
```

---

## Project Structure

```
Exp10/
├── docker-compose.yml         # SonarQube + PostgreSQL setup
├── sample-java-app/           # Java project to be analyzed
│   ├── pom.xml
│   └── src/
└── images/                    # (Optional) Screenshots
```

---

## Prerequisites

- Docker & Docker Compose
- Java 11+ and Maven (for running the sample app and scanner)

---

## SonarQube Setup (docker-compose.yml)

```yaml
version: "3.8"

services:
  sonar-db:
    image: postgres:13
    container_name: sonar-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: sonar
      POSTGRES_PASSWORD: sonar
      POSTGRES_DB: sonarqube
    volumes:
      - sonar-db-data:/var/lib/postgresql/data
    networks:
      - sonarqube-lab

  sonarqube:
    image: sonarqube:lts-community
    container_name: sonarqube
    restart: unless-stopped
    ports:
      - "9000:9000"
    environment:
      SONAR_JDBC_URL: jdbc:postgresql://sonar-db:5432/sonarqube
      SONAR_JDBC_USERNAME: sonar
      SONAR_JDBC_PASSWORD: sonar
    volumes:
      - sonar-data:/opt/sonarqube/data
      - sonar-extensions:/opt/sonarqube/extensions
    depends_on:
      - sonar-db
    networks:
      - sonarqube-lab

volumes:
  sonar-db-data:
  sonar-data:
  sonar-extensions:

networks:
  sonarqube-lab:
    driver: bridge
```

---

## How to Run the Lab

1. **Start SonarQube and PostgreSQL:**

   ```bash
   docker compose up -d
   ```

   Wait a few minutes for SonarQube to initialize.

2. **Access SonarQube UI:**
   - Open [http://localhost:9000](http://localhost:9000)
   - Default credentials: `admin` / `admin`

3. **Analyze the Sample Java App:**
   - Open a terminal in `sample-java-app/`
   - Run the SonarQube scanner (replace `<SONAR_TOKEN>` with your generated token):
     ```bash
     mvn clean verify sonar:sonar \
       -Dsonar.projectKey=sample-java-app \
       -Dsonar.host.url=http://localhost:9000 \
       -Dsonar.login=<SONAR_TOKEN>
     ```
   - Alternatively, use the SonarQube CLI scanner or Dockerized scanner.

4. **View Results:**
   - Go to the SonarQube dashboard and select your project to see detected bugs, code smells, and vulnerabilities.

---

## Sample Java App (Overview)

- Located in `sample-java-app/`
- Contains intentional issues (e.g., division by zero, unused variables, SQL injection risk) for SonarQube to detect.
- Built with Maven (`pom.xml` includes SonarQube plugin).

---

## Pipeline/Scanner Example

```xml
<!-- pom.xml snippet for SonarQube plugin -->
<plugin>
  <groupId>org.sonarsource.scanner.maven</groupId>
  <artifactId>sonar-maven-plugin</artifactId>
  <version>3.9.1.2184</version>
</plugin>
```

---

## Screenshots

- ![SonarQube Dashboard](images/sonarqube-dashboard.png)
- ![Sample Java App Issues](images/sonarqube-issues.png)

---

## Key Learnings

- How to set up SonarQube with Docker Compose for local code quality analysis
- Integrating SonarQube with Java/Maven projects
- Detecting bugs, vulnerabilities, and code smells automatically
- Using SonarQube tokens and secure authentication for analysis
- Interpreting SonarQube reports to improve code quality

---

## Cleanup

To stop and remove all containers and volumes:

```bash
docker compose down -v
```
