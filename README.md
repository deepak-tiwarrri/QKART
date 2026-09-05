# QKART

A modern e‑commerce web application built with a **React** frontend and a **Node.js/Express** backend. It demonstrates a full‑stack implementation with product browsing, cart management, and order processing.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Getting Started (Local Development)](#getting-started-local-development)
- [Backend Deployment on Render](#backend-deployment-on-render)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

QKART is a sample e‑commerce platform that showcases:
- A **React** SPA with modern UI/UX (dynamic animations, glass‑morphism styles).
- A **RESTful** API built with **Node.js**, **Express**, and **MongoDB** for data persistence.
- JWT‑based authentication and role‑based access control.
- Docker support for containerised development and production.

---

## Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | React, Vite, Tailwind CSS (optional) |
| Backend    | Node.js, Express, Mongoose, JWT   |
| Database   | MongoDB (MongoDB Atlas recommended) |
| DevOps     | Docker, Render (for backend)      |
| Testing    | Jest, Supertest                    |

---

## Getting Started (Local Development)

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd QKART
   ```

2. **Setup the backend**
   ```bash
   cd backend
   cp .env.example .env   # adjust values as needed
   npm install
   npm run dev   # starts the API on http://localhost:5000
   ```

3. **Setup the frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev   # Vite dev server on http://localhost:3000
   ```

4. **Running tests**
   ```bash
   cd backend
   npm test
   ```

---

## Backend Deployment on Render

Render offers a straightforward way to host Node.js services. Follow the steps below to deploy the **backend** portion of QKART.

### 1. Create a Render Account & New Service
1. Sign in to <https://render.com> and click **New** → **Web Service**.
2. Connect your GitHub (or GitLab) repository that contains the QKART code.
3. Choose the **branch** you want to deploy (e.g., `main`).

### 2. Service Configuration
| Setting                | Value (example)                           |
|------------------------|-------------------------------------------|
| **Name**               | `qkart-backend`                           |
| **Region**             | `Seattle (US)` (or any preferred)         |
| **Runtime**            | `Node`                                     |
| **Build Command**      | `cd backend && npm install`                |
| **Start Command**      | `cd backend && npm run start` (or `npm run prod` if you have a production script) |
| **Port**               | `5000` (Render automatically assigns `$PORT`; ensure your Express app uses `process.env.PORT || 5000`) |
| **Environment**        | **Node Version**: `20.x` (or latest)     |

### 3. Environment Variables
Add the following variables (you can copy them from your local `.env` file):
- `MONGODB_URI` – MongoDB connection string (MongoDB Atlas is recommended).
- `JWT_SECRET` – Secret key for signing JWT tokens.
- `PORT` – Optional; Render provides `$PORT` automatically.
- Any other custom variables you defined (e.g., `PAYMENT_GATEWAY_KEY`).

### 4. Adjust the Backend to Use Render’s Port
In `backend/index.js` (or wherever you call `app.listen`), replace the static port with:
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```
This ensures the server binds to the port Render assigns.

### 5. Deploy
Click **Create Web Service**. Render will:
1. Clone the repo.
2. Run the **Build Command**.
3. Start the service using the **Start Command**.
4. Provide a live URL like `https://qkart-backend.onrender.com`.

### 6. Verify
- Open the Render dashboard → **Service** → **Logs** to ensure the server started without errors.
- Test the health endpoint (if you have one) e.g., `https://qkart-backend.onrender.com/api/health`.
- Update the frontend `.env` (or Vite config) to point API calls to the new Render URL.

### 7. Optional – Continuous Deployments
Enable **Automatic Deploys** so each push to the selected branch triggers a new build, keeping the backend up‑to‑date.

---

## Environment Variables
A sample `.env.example` for the backend:
```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/qkart?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
PORT=5000   # optional, Render will override
```
Copy this to `.env` and fill in real values before running locally or deploying.

---

## Scripts
In the **backend** `package.json` you will find:
- `npm run dev` – Starts the server with **nodemon** for development.
- `npm run start` – Starts the server in production mode.
- `npm test` – Runs Jest/Supertest suite.
- `npm run lint` – Lints the code with ESLint.

---

## Contributing
Feel free to open issues or pull requests. Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Commit your changes with clear messages.
4. Open a PR targeting `main`.

---

## License
This project is licensed under the MIT License – see the `LICENSE` file for details.

---
