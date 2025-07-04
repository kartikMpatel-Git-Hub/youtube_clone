
# 🎥 Stream Vault(YouTube Clone[Old Name]) – Node.js Backend

A fully-featured backend for a YouTube Clone application developed using **Node.js**, following best practices in architecture, security, and modularity. This backend powers essential features such as video streaming, commenting, liking, subscriptions, playlists, and user management.



## 🚀 Live Deployment

View Project : [View](https://streamvaultstreaming.netlify.app/)

Backend API is live on: Render
<br>
Frontend Repository : [View](https://github.com/kartikMpatel-Git-Hub/StreamVault_Frontend)

# 🎬 YouTube Clone Backend

This is the **backend** of a YouTube-inspired video streaming platform built using **Node.js**, **Express.js**, and **MongoDB**. It supports features such as video uploads, playlists, subscriptions, likes/dislikes, comments, user authentication, and more.

## 🚀 Features

- ✅ User authentication & authorization (JWT)
- 📹 Video upload with thumbnail (Cloudinary)
- 💾 MongoDB-based storage & retrieval
- ❤️ Like/Dislike system
- 📁 Playlist creation and management
- 💬 Comments on videos
- 🔔 Subscribe to channels
- 📜 Watch history & recently watched
- 🧾 Video reports
- 👤 Channel info and subscriptions
- 🔐 Secured API routes

## 🛠️ Tech Stack

| Technology | Description |
|-----------|-------------|
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) | JavaScript runtime |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) | Web framework for Node.js |
| ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) | NoSQL Database |
| ![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white) | MongoDB ODM |
| ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white) | Cloud-based media storage |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white) | JSON Web Tokens for auth |
| ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white) | API testing |

## 📂 Project Structure





## 📦 Features

### 👥 User & Auth
- User registration and login with JWT
- Profile update and retrieval
- Password hashing using bcrypt

### 📹 Video Management
- Upload videos and thumbnails via **Multer** and **Cloudinary**
- Fetch, update, and delete videos
- Count views and filter/search by tags or categories

### 💬 Comment System
- Add, edit, and delete comments on videos
- Fetch all comments for a video

### ❤️ Likes
- Like/Unlike videos
- Track total likes and dislikes

### 📃 Playlists
- Create, update, delete playlists
- Add/remove videos from playlists

### 🔔 Subscriptions
- Subscribe/unsubscribe to channels

### 🐦 Tweets (Micro-posts)
- Post short messages (like tweets)
- Timeline of posts for users

### 📊 Dashboard
- Admin-level statistics and insights
- Models and controllers specifically for dashboard analytics

---

## 🔒 Middleware

- **Authentication**: JWT-based secure access
- **Multer**: Handles multipart form data for uploads
- **Cloudinary**: Stores video files and thumbnails securely

---

## 🛠️ Technologies Used

- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **Multer** for file handling
- **Cloudinary** for media hosting
- **Render** for backend deployment

---

## 🧪 API Documentation

Each model is paired with a corresponding controller and router. A full Postman collection or Swagger documentation is recommended to explore available endpoints.

| Model         | Router Path        |
|---------------|--------------------|
| User          | `/api/users`       |
| Video         | `/api/videos`      |
| Comment       | `/api/comments`    |
| Like          | `/api/likes`       |
| Playlist      | `/api/playlists`   |
| Subscriptions | `/api/subs`        |
| Tweet         | `/api/tweets`      |
| Dashboard     | `/api/dashboard`   |

---

## 🧾 Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/kartikMpatel-Git-Hub/youtube_clone.git
cd youtube_clone
````

### 2. Install dependencies

```bash
npm install
```

### 3. Set environment variables

Create a `.env` file in the root directory with the following:

```
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Run the application

```bash
npm start
```

---

## 📂 Deployment

The backend is deployed using **Render**. Configure environment variables and use the start command `npm start` in your Render dashboard.

---

## 🧑‍💻 Author

**Kartik Patel**

📧 Contact: [kartikpatel7892@gmal.com](mailto:kartikpatel7892@gmal.com)

🔗 LinkedIn: [https://www.linkedin.com/in/kartikmpatel/](https://www.linkedin.com/in/kartikmpatel/)

---
