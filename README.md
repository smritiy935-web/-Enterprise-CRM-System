# 🚀 APEX CRM — Enterprise Sales Intelligence Hub

[![React](https://img.shields.io/badge/Frontend-React%20v18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20v18-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Real--Time-Socket.io-black?style=for-the-badge&logo=socket.io)](https://socket.io/)

**Apex CRM** is a high-performance, industrial-grade Sales Intelligence platform designed for enterprise-level lead management, real-time analytics, and secure team collaboration. Built with a focus on "Silent Luxury" aesthetics and high-density data visualization.

---

## ✨ Key Features

### 📊 Industrial Dashboard
- **Hybrid Demonstration Mode**: Automatically scales data for high-impact visual presentations when live data is sparse.
- **Dynamic Real-time Analytics**: Live revenue tracking and lead ingestion via WebSocket synchronization.
- **Visual Excellence**: Glassmorphic UI with vibrant "Cyber Sunset" and "Emerald Neon" color palettes.

### 🎯 Leads & Pipeline Management
- **High-Density Leads Hub**: Advanced repository for managing thousands of prospects with zero latency.
- **Engagement Engine**: Integrated logging for Calls, Messages, and Meetings with automated activity feeds.
- **AI-Powered Scoring**: Preparations for intelligent lead prioritization based on behavior metrics.

### 🔐 Enterprise Security
- **Security Protocols Hub**: Advanced credential management with real-time password strength entropy calculation.
- **Industrial Notification Engine**: Fine-grained control over real-time lead alerts and system status pings.
- **RBAC**: Multi-tier Role-Based Access Control (Admin, Manager, Strategic Member).

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Core** | React 18, Node.js, Express, MongoDB |
| **Styling** | Vanilla CSS (Modern CSS Variables), Glassmorphism |
| **Real-time** | Socket.io (Bi-directional communication) |
| **Visualization** | Recharts (Responsive Area & Bar Charts) |
| **Icons** | Lucide React (Premium stroke icons) |
| **Animation** | CSS Keyframes & Framer Motion |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local instance or MongoDB Atlas URI

### 2. Backend Installation
```bash
cd backend
npm install
```
Create a `.env` file in the `/backend` directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_hyper_secure_secret
```
Run the server:
```bash
npm run dev
```

### 3. Frontend Installation
```bash
cd frontend
npm install
```
Run the client:
```bash
npm run dev
```

---

## 📂 Architecture Overview

```text
├── backend/
│   ├── controllers/      # Business logic handlers
│   ├── models/           # Mongoose schemas (Leads, Users, Activities)
│   ├── routes/           # RESTful API endpoints
│   └── middleware/       # JWT Auth & RBAC guards
└── frontend/
    ├── src/
    │   ├── components/   # Reusable UI modules (Sidebar, TeamChat)
    │   ├── pages/        # High-order components (Dashboard, Settings)
    │   ├── context/      # Global Authentication & System state
    │   └── utils/        # API configurations & Helpers
```

---

## 🛡 Security Credentials (Dev Environment)

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@apex.com` | `admin123` |

---

## 🎨 UI Aesthetics
- **Core Theme**: "Midnight Obsidian" (Pitch Black variants available)
- **Accents**: Cyberpunk Pink, Electric Indigo, and Safety Amber.
- **Design Philosophy**: High Information Density without visual clutter.

---

Built with ❤️ by the **Apex Intelligence Team**.
