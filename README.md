---
# 📝 Smart Note App – Node.js

A simple **Note Management System (REST API + GraphQL)** built with **Node.js**, **Express**, and **MongoDB**, featuring **secure user authentication**, **notes management**, and **password recovery**.
---

## 🚀 Features

### 🔐 User Authentication

- User registration with hashed passwords
- Login with JWT authentication (**Asymmetric RSA signing & verification**)
- Logout with token revocation
- Upload profile picture (stored locally)
- Forgot & reset password using **OTP via email**
- Secure authentication middleware

### 📄 Notes Management

- Create notes under authenticated user
- Fetch notes using **GraphQL**
- Apply filters (userId, title, date range)
- Pagination handled at **database level**
- Delete notes (only if owned by authenticated user)
- Populate note owner details

---

## 🧱 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB & Mongoose**
- **GraphQL**
- **JWT (Asymmetric – RSA)**
- **bcrypt**
- **dotenv**
- **nodemailer**
- **Joi (validation)**
- **multer (file uploads)**

### 🔒 Security

- `helmet`
- `cors`
- `express-rate-limit`
- Password hashing
- Token revocation check
- Secure & generic responses for sensitive APIs

---

## 📁 Project Structure (High Level)

```
src/
│
├── config/
│   ├── database.js
│   ├── jwt.js
│
├── middlewares/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│
├── modules/
│   ├── auth/
│   ├── notes/
│   ├── users/
│
├── graphql/
│   ├── schema.js
│   ├── resolvers.js
│
├── uploads/
│
├── utils/
│   ├── email.js
│   ├── token-revocation.js
│
├── app.js
├── index.js
│
.env
README.md
```

---

## 🔐 Authentication APIs

### ➕ Register

**POST** `/register`

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

- Password is hashed using **bcrypt (mongoose pre-save hook)**
- Response does NOT expose sensitive user data

---

### 🔑 Login

**POST** `/login`

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

- Returns **JWT access token**
- Token signed using **private RSA key**

---

### 🚪 Logout

**POST** `/logout`

- Revokes the JWT token
- Authentication middleware checks revoked tokens

---

### 🖼 Upload Profile Picture

**PATCH** `/upload-profile-pic`

- Authenticated route
- Uploads image to `/uploads`
- Prevents overwriting files with same name
- Stores image path in user document

---

### 🔁 Forget Password

**POST** `/forget-password`

```json
{
  "email": "user@example.com"
}
```

- Sends OTP via email if user exists
- Secure response (no email enumeration)

---

### 🔄 Reset Password

**POST** `/reset-password`

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "newPass123"
}
```

- OTP is **one-time use**
- Password re-hashed before saving

---

## 📄 Notes APIs

### ➕ Create Note

**POST** `/notes`

```json
{
  "title": "Meeting",
  "content": "Today we discussed...",
  "ownerId": "ObjectId"
}
```

- Authenticated user only
- Owner must exist in Users collection

---

### 📥 Get Notes (GraphQL)

**GET** `/notes`

- Implemented using **GraphQL**
- Filters:

  - `userId`
  - `title`
  - `createdAt interval`

- Pagination handled at DB level
- Each note includes **owner info**

---

### ❌ Delete Note

**DELETE** `/notes/:id`

- Only deletes note if it belongs to authenticated user

---

## ⚠ Global Rules Applied

- Input validation using **Joi**
- Centralized error-handling middleware
- 404 handler for unknown routes
- Environment variables via `.env`
- Clean, modular architecture
- Descriptive logs only (startup, DB, errors)
- Performance-oriented DB queries

---

## 🧪 Running the Project

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Setup environment variables

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri

JWT_PRIVATE_KEY=your_private_rsa_key
JWT_PUBLIC_KEY=your_public_rsa_key

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

### 3️⃣ Run the server

```bash
npm run dev
```

Server will run on:

```
http://localhost:5000
```

---

## 📮 Postman Collection

📌 A Postman collection is included in the repository for testing all endpoints.

---

## 📚 Documentation

- JsDocs are written for all main functions & APIs
- Code follows clean code principles
- Modular & scalable architecture

---

## 👨‍💻 Author

**Mohamed Abdelhakem**
