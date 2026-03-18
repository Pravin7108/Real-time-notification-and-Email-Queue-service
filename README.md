# Real-time-notification-and-Email-Queue-service

A Node.js service that processes background email jobs using **Redis + BullMQ** and delivers real-time status updates to connected clients via **Socket.IO WebSockets**.



# Tech Stack

HTTP Framework | ioredis | Express | BullMQ | Socket.IO | Nodemailer 


# Docker - ( To run redis locally )

docker run -d -p 6379:6379 redis:7-alpine


# Setup

.env
npm install
npm run dev

nodemon src/index.ts - run API and worker


## API 

`POST /notifications/email`  

Request

```json
{
    "to":"user@gmail.com",
    "subject":"Welcome",
    "message":"Welcome to the platform"
}
```

Response - 202

```json
{
    "success":true,
    "message":"Email is queued for sending"
}
```


`GET /notifications/queue-status`  

Returns queue counts

Response - 200

```json
{
    "success":true,
    "waiting":1,
    "active":10,
    "completed":3,
    "failed":1
}
```


## Web socket events 

```javascript
const socket = io("http://localhost:3000");


socket.on("notification-status", (data) => {
  console.log(data);
   {
     email: "user@example.com",
     status: "sent", 
     jobId: "1",
     timestamp: "2024-03-15T10:30:00.000Z"
   }
});
