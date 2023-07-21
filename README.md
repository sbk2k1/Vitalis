# Server Health Monitoring Application

![App Screenshot](screenshots/screenshot.png)

## About

The Server Health Monitoring Application is a full-stack application built using React, Node.js, MongoDB, and Redis. It allows users to monitor the response times of multiple servers in real-time. The application is containerized and orchestrated using Docker Compose, making it easy to deploy and manage.

## File Structure

```
server-health-monitoring/
|-- client/ # React frontend (Client)
|-- server/ # Node.js backend (Server)
|-- redis/ # Redis server configuration
|-- mongodb/ # MongoDB server configuration
|-- docker-compose.yml
|-- README.md
```

## Installation

To run the Server Health Monitoring Application locally, make sure you have Docker and Docker Compose installed on your system. Then, follow these steps:

1. Clone this repository:

```
git clone https://github.com/your-username/server-health-monitoring.git
```

```
cd server-health-monitoring
```

2. Build the Docker images and start the containers:

```
docker-compose up -d
```

3. The application will be available at:
   - Frontend (React) - http://localhost:3000
   - Backend (Node.js) - http://localhost:5000

## Screenshots

![Screenshot 1](screenshots/screenshot1.png)
![Screenshot 2](screenshots/screenshot2.png)

## Author

This Server Health Monitoring Application was created by [@sbk2k1](https://github.com/sbk2k1).

If you have any questions or feedback, feel free to reach out!
