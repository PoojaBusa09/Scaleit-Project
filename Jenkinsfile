pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/PoojaBusa09/Scaleit-Project.git'
            }
        }

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

        stage('Deploy') {
            steps {
                echo 'Deploying...'
            }
        }
    }
}