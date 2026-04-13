pipeline {
    agent any

    environment {
        IMAGE_NAME = 'busapooja/my-node-app'
        TAG = 'latest'
        CONTAINER_NAME = 'my-node-container'
    }

    stages {

        stage('Build') {
            steps {
                echo 'Building project...'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%TAG% .'
            }
        }

                        stage('Docker Login') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: 'docker-hub-creds',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
        )]) {
            bat """
            docker login -u %DOCKER_USER% -p %DOCKER_PASS%
            """
        }
    }
}


        stage('Docker Push') {
            steps {
                bat 'docker push %IMAGE_NAME%:%TAG%'
            }
        }

        stage('Remove Old Container') {
            steps {
                bat '''
                docker rm -f %CONTAINER_NAME% >nul 2>&1
                '''
            }
        }

        stage('Deploy') {
            steps {
                bat '''
                docker run -d -p 8081:80 --name %CONTAINER_NAME% %IMAGE_NAME%:%TAG%
                '''
            }
        }
    }
}