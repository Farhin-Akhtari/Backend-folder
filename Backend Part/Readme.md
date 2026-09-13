# Backend series

# 🎥 PlayNest — Backend

The backend for **PlayNest**, a full-stack video-sharing platform inspired by modern video streaming platforms.

Built with **Node.js, Express.js, MongoDB, and Mongoose**, the backend provides RESTful APIs for authentication, videos, likes, comments, subscriptions, playlists, notifications, and more.

---

## 🚀 Key Features

* 🔐 JWT-based authentication and authorization
* 🎥 Video upload, management, search, sorting, and pagination
* ❤️ Like and unlike videos, comments, and tweets
* 💬 Comment management
* 👥 Channel subscriptions
* 📂 Playlist management
* 🕐 Watch Later
* 🔎 Search History
* 🔔 Real-time notifications using Socket.IO
* 📊 Channel dashboard and analytics
* ☁️ Media upload and storage using Cloudinary
* 🔒 Protected routes and owner-based authorization

---

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

## 🛠️ Tech Stack

**Backend**

* Node.js
* Express.js

**Database**

* MongoDB
* Mongoose

**Authentication & Security**

* JWT
* bcrypt

**File Storage**

* Multer
* Cloudinary

**Real-Time Communication**

* Socket.IO

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Farhin-Akhtari/Backend-folder.git
```

### 2. Navigate to the backend

```bash
cd backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file using `.env.sample`.

```env
PORT=8000

MONGODB_URL=your_mongodb_connection_string

CORS_ORIGIN=your_frontend_url

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 5. Start the development server

```bash
npm run dev
```

---

## 🔗 Frontend

The PlayNest frontend is available in the `frontend` folder of this repository.

See the [Frontend Part README](../frontend/README.md) for frontend setup and details.

---

## 🎯 Future Improvements

* Video streaming optimization
* Video recommendations
* Real-time chat
* Admin dashboard
* Unit testing
* Docker support
* Improved API documentation

---

## 👨‍💻 Author

**Farhin Akhtari**

Computer Science Engineering Student

Interested in Full Stack Development, Data Structures & Algorithms, and AI.

---

## ⭐ Support

If you like this project, consider giving the repository a ⭐ on GitHub.
