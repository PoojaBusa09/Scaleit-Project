🚀 CI/CD Pipeline with Jenkins, Docker & Kubernetes
📌 Project Overview

This project demonstrates a complete CI/CD pipeline using:

GitHub (Source Code)
Jenkins (Automation)
Docker (Containerization)
Kubernetes (Deployment)

🧾 Step 1: Setup GitHub Project

🔹 Create & Push Code to GitHub

Commands (Run in VS Code Terminal / Bash)
=========================================
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <REPO_URL>
git push -u origin main
=========================================
🔁 If Remote Already Exists

git remote -v
git remote set-url origin <REPO_URL>
========================================
⚙️ Step 2: Jenkins Setup

🔹 Open Jenkins

http://localhost:8080

🔹 Create Pipeline Job

Click New Item
Enter Item Name (Example: scaleit-project)
Select Pipeline
Click OK

🔹 Configure Pipeline
Go to Configure

Select:

Pipeline → Pipeline Script from SCM
SCM → Git
Repository URL → Paste GitHub repo URL

Branch:

*/main
Click Save
==================================================
⚙️ Step 3: Jenkins System Configuration (Kubernetes)

🔹 Add Environment Variable

Go to:

Manage Jenkins → System → Global Properties

Enable:

Environment Variables

Add:

Name  : KUBECONFIG
Value : C:\ProgramData\Jenkins\.kube\config
Save
⚙️ Step 4: Setup Kubernetes Config File
🔹 Copy Kube Config

Press:

Win + R → %USERPROFILE%\.kube

Copy:

config file

Paste into:

C:\ProgramData\Jenkins\.kube\
⚙️ Step 5: Restart Jenkins
Win + R → services.msc
Find Jenkins
Restart service

start menu = click cmd -> run as adminstrature 
then

net stop jenkins
net start jenkins

⚙️ Step 6: Verify Kubernetes Setup

kubectl get nodes
kubectl version --client

⚙️ Step 7: Enable Docker & Kubernetes
Open Docker Desktop

Enable:

Kubernetes
=========================================
🔄 Step 8: CI/CD Pipeline Stages
Pipeline Flow:

Build
Test
Docker Build
Docker Login
Docker Push
Remove Old Container
Run Container
Deploy
Verify Kubernetes
Deploy to Kubernetes
=========================================
📦 Environment Variables Used
Variable Name	Description
IMAGE_NAME	Docker image name
TAG	Image tag
CONTAINER_NAME	Docker container name
KUBECONFIG	Kubernetes config path
🐳 Docker Details
Image Name → Docker Hub Repo Name
Tag → Version (e.g., latest)
Container Name → Running container name
🚀 Deployment Steps
🔹 Build Docker Image
docker build -t <IMAGE_NAME>:<TAG> .
🔹 Login to Docker Hub
docker login
🔹 Push Image
docker push <IMAGE_NAME>:<TAG>
☸️ Kubernetes Deployment
🔹 Deploy Application
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
🔹 Verify Deployment
kubectl get pods
kubectl get services
🔍 Troubleshooting
❌ Jenkins Not Starting
Restart Jenkins service
❌ Docker Login Failed
Check credentials in Jenkins
❌ Kubernetes Not Working
Verify KUBECONFIG path

Run:

kubectl get nodes
✅ Final Notes
Ensure Docker Desktop is running
Ensure Kubernetes is enabled
Jenkins must have proper permissions
GitHub repo must be accessible

