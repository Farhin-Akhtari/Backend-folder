# Backend series

# 🎥 YouTube Backend Clone

A feature-rich YouTube-inspired backend built using **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**. This project provides secure authentication, video management, likes, comments, subscriptions, playlists, tweets, and dashboard analytics using MongoDB Aggregation Pipelines.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- User Registration
- User Login & Logout
- JWT Authentication
- Refresh Token Support
- Change Password
- Update Account Details
- Upload Avatar & Cover Image
- Get Current User Profile

---

### 📹 Video Management
- Upload Video
- Update Video
- Delete Video
- Publish/Unpublish Video
- Get Video by ID
- Get All Videos
- Search Videos
- Sort Videos
- Pagination
- View Count Tracking

---

### ❤️ Likes
- Like/Unlike Videos
- Like/Unlike Comments
- Like/Unlike Tweets
- Get Liked Videos

---

### 💬 Comments
- Add Comment
- Update Comment
- Delete Comment
- Get Video Comments
- Pagination Support

---

### 👥 Subscriptions
- Subscribe to Channel
- Unsubscribe from Channel
- Get Subscriber List
- Get Subscribed Channels

---

### 📝 Tweets
- Create Tweet
- Update Tweet
- Delete Tweet
- Get Tweet by ID
- Get All Tweets
- Like Tweets

---

### 📂 Playlists
- Create Playlist
- Update Playlist
- Delete Playlist
- Get Playlist by ID
- Get User Playlists
- Add Video to Playlist
- Remove Video from Playlist

---

### 📊 Dashboard
- Total Uploaded Videos
- Total Video Views
- Total Subscribers
- Total Comments
- Total Likes
- Aggregated Channel Statistics

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT (Access Token & Refresh Token)
- bcrypt

### File Upload
- Multer
- Cloudinary

### Utilities
- Async Handler
- Custom API Response
- Custom API Error
- Aggregation Pipelines

---

## 📁 Project Structure

```
src/
│── controllers/
│── models/
│── routes/
│── middlewares/
│── utils/
│── db/
│── app.js
│── index.js
```

---

## 📌 Aggregation Pipelines Used

This project makes extensive use of MongoDB Aggregation Framework.

Used stages include:

- `$match`
- `$lookup`
- `$group`
- `$project`
- `$addFields`
- `$sort`
- `$skip`
- `$limit`
- `$size`
- `$sum`
- `$in`
- `$first`
- `$ifNull`

---

## 🔒 Security Features

- JWT Authentication
- Protected Routes
- Owner Authorization
- Input Validation
- MongoDB ObjectId Validation
- Secure Password Hashing
- Refresh Token Mechanism

---

## 📡 API Features

- RESTful API Design
- Pagination
- Searching
- Sorting
- Filtering
- Aggregation
- Consistent API Responses
- Proper Error Handling

---

## 📦 Installation

Clone the repository

```bash
git clone https://github.com/Farhin-Akhtari/Backend-folder.git
```

Install dependencies

```bash
npm install
```

Create a `.env` file using `.env.sample`

```env
PORT=8000
MONGODB_URL = mongodb+srv://your_username:your_password@your_cluster_url
CORS_ORIGIN = *
ACCESS_TOKEN_SECRET = your_access_token_secret
ACCESS_TOKEN_EXPIRY = 1d
REFRESH_TOKEN_SECRET = your_refresh_token_secret
REFRESH_TOKEN_EXPIRY = 10d

CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
CLOUDINARY_API_KEY = your_cloudinary_api_key 
CLOUDINARY_API_SECRET = your_cloudinary_api_secret

Run the project

```bash
npm run dev
```

---

## 🎯 Future Improvements

- React Frontend
- Video Streaming Optimization
- Notifications
- Watch History
- Recommendations
- Real-time Chat
- Admin Dashboard
- Unit Testing
- Docker Support

---

## 👨‍💻 Author

**Farhin Akhtari**

Computer Science Engineering Student

Passionate about Full Stack Development, Data Structures & Algorithms, and AI.

---

## ⭐ If you like this project

Please consider giving it a ⭐ on GitHub.
