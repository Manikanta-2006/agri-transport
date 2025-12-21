# 🌾 Agri Transport – Agricultural Produce Trading & Delivery System

Agri Transport is a web-based application designed to connect **farmers, buyers, and delivery agents** on a single digital platform. The system enables farmers to sell their agricultural produce directly, buyers to place orders and make online payments, and delivery agents to manage deliveries efficiently.

---

## 🚀 Features

### 👨‍🌾 Farmer Module
- Farmer registration and login
- List agricultural produce with price and location
- Manage product listings
- View incoming orders

### 🛒 Buyer Module
- Buyer registration and login
- Browse available agricultural products
- Place orders based on location and price
- Secure online payment through payment gateway
- View order status

### 🚚 Delivery Agent Module
- Delivery agent login
- View available delivery requests
- Accept delivery tasks
- Update delivery status

---

## 🏗️ System Architecture

The application follows a **client–server architecture**:

- **Frontend (Client Side):** React JS  
- **Backend (Server Side):** Node JS with Express  
- **Database:** MongoDB  
- **Payment Integration:** Payment Gateway API  

---

## 🛠️ Technology Stack

### Frontend
- React JS
- HTML5
- CSS3
- JavaScript

### Backend
- Node JS
- Express JS

### Database
- MongoDB

### Tools
- Git & GitHub
- Visual Studio Code
- Postman

---

## 📂 Project Structure
project/
├── client/ # React frontend
├── server/ # Node.js backend
├── .gitignore
├── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
bash
git clone https://github.com/Manikanta-2006/agri-transport.git
cd agri-transport

2️⃣ Install frontend dependencies
cd client
npm install
npm start

3️⃣ Install backend dependencies
cd server
npm install
npm start


⚠️ Make sure MongoDB is running and environment variables are configured.

🔐 User Roles

Farmer: Adds and manages agricultural produce

Buyer: Orders products and makes payments

Delivery Agent: Handles delivery of ordered products

🎯 Project Objective

The main objective of this project is to provide a transparent, efficient, and user-friendly digital platform for agricultural produce trading and delivery management using modern web technologies.

📌 Future Enhancements

Mobile application support

Real-time GPS tracking for deliveries

Notification system (SMS/Email)

Admin dashboard

Multi-language support

📄 License

This project is developed for academic purposes as part of course requirements.
