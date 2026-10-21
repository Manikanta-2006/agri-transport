# 🚀 Agri Transport – Deployment Guide (Render / Railway)

This guide walks you through deploying Agri Transport as a single, unified web service (Express backend + compiled React frontend + MongoDB Atlas database).

---

## 📋 Overview of Setup

- **Frontend & Backend**: Unified Node.js service running Express. Express serves `/api/*` routes and static React assets (`client/dist`) for all pages.
- **Database**: Free cloud MongoDB Atlas cluster (`mongodb+srv://...`).
- **Platform**: [Render](https://render.com) or [Railway](https://railway.app).

---

## 1️⃣ Step 1: Set Up MongoDB Atlas (Database)

If you don't already have a free MongoDB Atlas cluster:

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account.
2. Create a **Shared / Free (M0)** cluster.
3. Under **Security → Database Access**:
   - Create a database user (e.g., `agri_user`) and a secure password.
4. Under **Security → Network Access**:
   - Click **Add IP Address** → Choose **Allow Access from Anywhere (`0.0.0.0/0`)** so Render/Railway can connect.
5. Under **Deployment → Database → Connect**:
   - Select **Drivers (Node.js)**.
   - Copy the connection string:
     ```text
     mongodb+srv://agri_user:<password>@cluster0.xxxx.mongodb.net/agri-transport?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your database user password and save this URI for Step 3.

---

## 2️⃣ Step 2: Push Your Code to GitHub

Make sure your latest code with the new deployment configuration is committed and pushed:

```bash
git add .
git commit -m "Configure full-stack deployment for Render and Railway"
git push origin main
```

---

## 3️⃣ Step 3A: Deploy on Render (Recommended)

### Option A: Using Render Blueprints (Automatic)

1. Go to [render.com](https://render.com) and log in.
2. Click **New +** → **Blueprint**.
3. Connect your `agri-transport` GitHub repository.
4. Render will automatically detect [`render.yaml`](./render.yaml).
5. When prompted for environment variables:
   - `MONGO_URI`: Paste your MongoDB Atlas connection string from Step 1.
   - `JWT_SECRET`: Leave as auto-generated or paste a random secret key.
   - `NODE_ENV`: Set to `production` (already populated).
6. Click **Apply**. Render will build the frontend, launch the server, and give you a live URL (e.g. `https://agri-transport.onrender.com`).

---

### Option B: Manual Web Service Setup on Render

If you prefer setting it up manually:

1. Click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name**: `agri-transport`
   - **Region**: Choose closest to you (e.g., Singapore, Frankfurt, Oregon)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
4. Add **Environment Variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGO_URI` = `<your MongoDB Atlas connection string>`
   - `JWT_SECRET` = `<any secure random string>`
5. Click **Deploy Web Service**.

---

## 4️⃣ Step 3B: Deploy on Railway (Alternative)

1. Go to [railway.app](https://railway.app) and log in with GitHub.
2. Click **New Project** → **Deploy from GitHub repo**.
3. Select `agri-transport`.
4. Click **Add Variables** and configure:
   - `NODE_ENV` = `production`
   - `MONGO_URI` = `<your MongoDB Atlas connection string>`
   - `JWT_SECRET` = `<your secure JWT secret>`
5. Go to **Settings** → **Networking** → Click **Generate Domain**.
6. Railway will automatically detect [`railway.toml`](./railway.toml) and deploy your app.

---

## 🔍 Verification & Health Check

Once your service is deployed:
- Visit your app's URL: `https://<your-service-name>.onrender.com`
- Check health endpoint: `https://<your-service-name>.onrender.com/api/health` (should return `{"status":"ok", ...}`)
- Test signing up a farmer, delivery agent, or buyer, and logging into the dashboard.

---

## 🛠️ Local Production Testing

To test the unified production setup locally before pushing:

```bash
# 1. Build the frontend
npm run build:client

# 2. Start server in production mode
NODE_ENV=production PORT=5001 node server/index.js
```
Then visit `http://localhost:5001` in your browser. Both the React UI and Express API will run on port 5001!
