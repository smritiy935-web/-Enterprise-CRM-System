# 🚀 Apex CRM — Enterprise Sales Intelligence Hub

[![React](https://img.shields.io/badge/Frontend-React%20v18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20v18-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Real--Time-Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

**Apex CRM** is a high-performance, industrial-grade Sales Intelligence platform. Designed for enterprise scalability, it streamlines lead management, optimizes team productivity with real-time analytics, and ensures uncompromising security through advanced RBAC protocols.

---

## 💎 The "Silent Luxury" Design Philosophy
Apex CRM isn't just a tool; it's a workspace. Built with a focus on **high-density data visualization** and **premium aesthetics**:
- **Midnight Obsidian Theme**: A sleek, dark interface minimized for eye comfort during long sessions.
- **Glassmorphic Components**: Layered depth using modern CSS backdrop filters.
- **Vibrant Accents**: "Cyber Sunset" (Pink/Orange) and "Emerald Neon" (Green) for intuitive status indicators.

---

## ✨ Key Features

### 📊 Industrial Intelligence Dashboard
- **Hybrid Data Scaling**: Intelligent visualization that scales seamlessly from empty states to millions of data points.
- **Live Revenue Tracking**: Real-time sales pipeline monitoring via high-speed WebSocket synchronization.
- **Predictive Analytics**: Integrated charting for trend analysis and volume forecasting.

### 🎯 Precision Leads Hub
- **Zero-Latency Repository**: Advanced state management for handling massive lead quantities with instant search/filter.
- **Engagement Timeline**: Automated logging for Calls, Messages, and Meetings in a unified activity stream.
- **Smart Prioritization**: Behavior-based metrics to identify high-intent prospects.

### 🔐 Enterprise-Grade Security
- **RBAC (Role-Based Access Control)**: Granular permissions for Admins, Managers, and Sales Representatives.
- **Security Command Center**: Real-time monitoring of password entropy and credential strength.
- **Industrial Alerts**: Fine-grained notification engine for critical system updates and lead pings.

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Core Runtime** | React 18 (Frontend), Node.js (Backend) |
| **Data Engine** | MongoDB (NoSQL) with Mongoose ODM |
| **Real-time Engine** | Socket.io (Bi-directional communication) |
| **Architecture** | Express.js RESTful API & WebSocket integration |
| **Visualization** | Recharts (Responsive Analytics) |
| **Styling** | Modern Vanilla CSS, CSS Variables, Framer Motion |
| **Build Tool** | Vite (Ultra-fast development environment) |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: `v18.x` or higher
- **MongoDB**: Active instance (Local or Atlas)
- **Git**: For version control

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5081
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret_key
```
Start the development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```

---

## 📂 Project Architecture

```text
├── backend/
│   ├── controllers/      # Core business logic
│   ├── models/           # Mongoose schemas (Leads, Users, Activities)
│   ├── routes/           # REST API Definitions
│   └── middleware/       # JWT Auth & Security Guards
└── frontend/
    ├── src/
    │   ├── components/   # Atomic UI Modules
    │   ├── pages/        # Dashboard, Leads Hub, Settings
    │   ├── context/      # Auth & Global System State
    │   └── utils/        # API Configuration & Helpers
```

---

## 🛡 Default Development Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Admin** | `admin@apex.com` | `admin123` |

---

## 👩‍💻 Developed By
**Smriti Yadav**  
*MERN Stack Developer*

---
© 2026 Apex CRM. All Rights Reserved.
