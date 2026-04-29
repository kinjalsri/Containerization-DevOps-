# CI/CD Pipeline using Jenkins, Docker, and GitHub

## Overview

This project demonstrates a complete CI/CD pipeline implementation using Jenkins, Docker, and GitHub. The architecture follows a streamlined workflow where code changes trigger automated builds, testing, and deployment:

**GitHub → Jenkins → Docker → Docker Hub**

- **GitHub**: Hosts the source code repository containing the application (a Flask app) and its Dockerfile.
- **Jenkins**: Acts as the CI/CD server, pulling code from GitHub, building Docker images, and pushing them to Docker Hub.
- **Docker**: Used for containerizing the application and enabling seamless builds.
- **Docker Hub**: Serves as the container registry for storing and distributing built images.

The pipeline automates the process of building, testing, and deploying containerized applications, ensuring consistency and efficiency in software delivery.

## Project Structure

```
lab/exp7/
├── jenkins-setup/
│   ├── docker-compose.yml    # Jenkins container configuration
│   └── README.md             # Jenkins setup instructions
└── jenkins-test/             # External GitHub repository (not included here)
    ├── app.py                # Flask application
    ├── Dockerfile            # Docker image definition
    ├── Jenkinsfile           # Pipeline definition
    └── requirements.txt      # Python dependencies
```

- `jenkins-setup/`: Contains the Docker Compose setup for running Jenkins locally.
- `jenkins-test/`: A separate GitHub repository containing the Flask application, Dockerfile, and Jenkinsfile. This repo is cloned by Jenkins during pipeline execution.

## Prerequisites

Before setting up the pipeline, ensure the following are installed on your system:

- **Docker**: Version 20.10 or later (for running Jenkins and building images).
- **Docker Compose**: Version 1.29 or later.
- **Git**: For cloning repositories.
- **GitHub Account**: To host the source code and trigger webhooks (optional for manual builds).
- **Docker Hub Account**: To store and pull container images.

## Jenkins Setup

Jenkins is run as a Docker container using Docker Compose for easy setup and persistence.

### docker-compose.yml

```yaml
version: "3.8"

services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    restart: always
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    user: root
    privileged: true

volumes:
  jenkins_home:
```

### Steps to Set Up Jenkins

1. Navigate to the `jenkins-setup` directory:

   ```bash
   cd lab/exp7/jenkins-setup
   ```

2. Start Jenkins using Docker Compose:

   ```bash
   docker compose up -d
   ```

3. Access Jenkins at `http://localhost:8080`.

4. Retrieve the initial admin password:

   ```bash
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```

5. Complete the Jenkins setup wizard and install suggested plugins.

6. Install additional plugins if needed (e.g., Docker Pipeline, GitHub Integration).

## Pipeline Explanation

The CI/CD pipeline is defined in the `Jenkinsfile` located in the `jenkins-test` repository. It consists of the following stages:

1. **Checkout**: Clone the GitHub repository containing the source code.
2. **Build**: Build the Docker image using the provided Dockerfile.
3. **Test**: Run any tests (e.g., unit tests for the Flask app).
4. **Push to Docker Hub**: Log in to Docker Hub and push the built image.

### Jenkinsfile (Generic Example)

```groovy
pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO = '<DOCKER_HUB_USERNAME>/<REPO_NAME>'
        DOCKER_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/<GITHUB_USERNAME>/jenkins-test.git'
            }
        }

        stage('Build') {
            steps {
                script {
                    dockerImage = docker.build("${DOCKER_HUB_REPO}:${DOCKER_TAG}")
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    dockerImage.inside {
                        sh 'python -m pytest tests/'  // Example test command
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'docker-hub-credentials') {
                        dockerImage.push("${DOCKER_TAG}")
                    }
                }
            }
        }
    }

    post {
        always {
            sh 'docker rmi ${DOCKER_HUB_REPO}:${DOCKER_TAG} || true'
        }
    }
}
```

- Replace `<DOCKER_HUB_USERNAME>`, `<REPO_NAME>`, and `<GITHUB_USERNAME>` with actual values.
- The pipeline uses Jenkins' Docker plugin for building and pushing images.

## Credentials Handling

Jenkins securely manages sensitive information like Docker Hub credentials using the `withCredentials` step:

- **Docker Hub Credentials**: Stored in Jenkins as a username/password credential pair (ID: `docker-hub-credentials`).
- **GitHub Token**: If using webhooks, store a personal access token for repository access.

To add credentials in Jenkins:

1. Go to **Manage Jenkins > Manage Credentials**.
2. Add a new credential of type "Username with password".
3. Use the ID `docker-hub-credentials` for Docker Hub login.

The `withCredentials` block in the Jenkinsfile securely injects these credentials during the pipeline run without exposing them in logs.

## How to Run the Project

1. **Set Up Jenkins**: Follow the Jenkins Setup section above.

2. **Create a Pipeline Job**:
   - In Jenkins, create a new "Pipeline" job.
   - Configure the pipeline to use the `Jenkinsfile` from SCM (Git).
   - Set the repository URL to your `jenkins-test` GitHub repo.

3. **Add Credentials**: Ensure Docker Hub credentials are configured in Jenkins.

4. **Trigger the Build**:
   - Manually build the job or set up a GitHub webhook for automatic triggers on push events.

5. **Monitor the Pipeline**: View the console output for each stage.

## Execution Flow

1. **Code Push**: Developer pushes changes to the `jenkins-test` GitHub repository.
2. **Webhook Trigger**: GitHub sends a webhook to Jenkins (if configured).
3. **Pipeline Start**: Jenkins clones the repository.
4. **Build Stage**: Docker image is built from the Dockerfile.
5. **Test Stage**: Application tests are executed inside the container.
6. **Push Stage**: Image is pushed to Docker Hub using stored credentials.
7. **Cleanup**: Temporary images are removed.

## Screenshots

- ![Jenkins Dashboard](./images/Screenshot%202026-04-18%20at%2011.14.03 PM.png)
- ![Jenkins Dashboard](./images/Screenshot%202026-04-18%20at%2011.14.35 PM.png)
- ![Jenkins Dashboard](./images/Screenshot%202026-04-18%20at%2011.14.58 PM.png)

## Key Learnings

- **Automation**: CI/CD pipelines automate repetitive tasks, reducing manual errors and improving efficiency.
- **Containerization**: Docker enables consistent environments across development, testing, and production.
- **Security**: Proper credential management prevents exposure of sensitive information.
- **Integration**: Combining Jenkins, GitHub, and Docker Hub creates a robust DevOps workflow.
- **Scalability**: Containerized applications can be easily deployed and scaled using orchestration tools like Kubernetes.

This setup provides a solid foundation for understanding modern software delivery practices and can be extended with additional stages like deployment to cloud platforms.
