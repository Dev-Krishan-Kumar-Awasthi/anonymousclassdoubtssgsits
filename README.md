# SGSITS Anonymous ("Ask Freely. Learn Better.")

Official institutional classroom communication and real-time doubt platform designed for the Department of Information Technology at **Shri G. S. Institute of Technology and Science (SGSITS), Indore**.

---

## 📌 Problem & Solution
- **The Challenge**: Students in classroom lectures often hesitate to ask questions publicly due to fear of judgment, communication anxiety in English/Hindi/Hinglish, or time limitations. Faculty members ask *"Any doubts?"*, but students remain quiet even when confused.
- **The Solution**: Authenticated students submit questions anonymously to faculty in real-time. The platform intelligently clusters common doubts, allows faculty to answer privately or publish explanations to the whole class, and captures anonymous end-of-lecture Class Pulse ratings.
- **Privacy Core**: *"Anonymous to your teacher"* — The student authenticates with the system for accountability and anti-spam moderation, but the faculty console never exposes names, roll numbers, emails, or profile photos.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS with official institutional academic palette (Navy `#0B1F3A`, Deep Blue `#123B6D`, Primary Blue `#1769AA`, Light Blue `#EAF3FB`, Background `#F6F8FB`)
- **Real-Time Client**: Socket.IO client (`socket.io-client`)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js + Express.js + TypeScript
- **Real-Time Engine**: Socket.IO server with room channels (`class:{code}`, `teacher:{code}`, `student:{id}`)
- **Authoritative Timetable Engine**: Synchronized strictly to `Asia/Kolkata` time with parallel laboratory batch awareness (`B1`, `B2`, `B3`) and 10-minute `STARTING_SOON` countdowns
- **Security & RBAC**: JWT authentication, bcrypt password hashing, Helmet, CORS, and submission rate-limiting
- **Database Layer**: Prisma ORM with normalized PostgreSQL schema

---

## 🚀 Quick Start

### 1. Backend Server Setup
```bash
cd backend
npm install
npm run build
npm test       # Runs full automated test suite (18 tests)
npm run dev    # Starts on http://localhost:5000
```

### 2. Frontend Portal Setup
```bash
cd frontend
npm install
npm run build
npm run dev    # Starts on http://localhost:3000
```

### 3. Root Workspace Commands
```bash
npm run dev:backend   # Starts backend server (Port 5000)
npm run dev:frontend  # Starts Next.js frontend (Port 3000)
npm run test:backend  # Executes test suite
```

---

## 👥 Demo Personas (1-Click Switcher Available on `/login`)
- **Primary Student**: Krishan Awasthi (`krishan.awasthi@sgsits.ac.in` / `password123`) — IT 2nd Year, Section B, Batch B2
- **Parallel Lab Student B1**: Aarav Patel (`student.b1@sgsits.ac.in` / `password123`) — Batch B1
- **Parallel Lab Student B3**: Priya Sharma (`student.b3@sgsits.ac.in` / `password123`) — Batch B3
- **Faculty US**: (`faculty.us@sgsits.ac.in` / `password123`) — Teaches Object Oriented Programming (ATC-301) and OOP Lab (Lab207)
- **Faculty LP**: (`faculty.lp@sgsits.ac.in` / `password123`) — Teaches Data Structures and DSD Lab (LAB105)
- **Department Administrator**: (`admin.it@sgsits.ac.in` / `password123`)

---

## 🗓️ Timetable & Parallel Lab Support
Initial seed data models the exact academic schedule for SGSITS 2nd Year IT Section B:
- Monday 11:00 AM – 12:00 PM: OOP (US) in ATC-301
- Monday 02:00 PM – 04:00 PM: Parallel Labs (B1: DSD Lab in LAB105, B2: DS Lab in LAB105, B3: OOP Lab in Lab207)
- Automated batch filtering guarantees Batch B2 students only see their relevant practical session.

---

## 📄 License
Academic institutional portal for SGSITS Indore Department of Information Technology.
