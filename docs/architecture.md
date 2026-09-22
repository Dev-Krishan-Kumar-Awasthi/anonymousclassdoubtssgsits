# SGSITS Anonymous - System Architecture

"Ask Freely. Learn Better."

## 1. System Overview
SGSITS Anonymous is a privacy-first, real-time academic classroom communication platform built for the Department of Information Technology at Shri G. S. Institute of Technology and Science, Indore.

It solves the friction in classroom learning where students hesitate to ask doubts publicly due to fear of judgment, language anxiety (English/Hindi/Hinglish), or time constraints, while giving faculty actionable, real-time visibility into students' points of confusion.

## 2. Core Architectural Pillars
- **Authoritative Academic Timezone**: `Asia/Kolkata` is authoritative on all backend calculations, timetable lookups, and session management.
- **Privacy Protocol**: *"Anonymous to your teacher"* — Student identity is cryptographically authenticated via JWT and stored internally for spam prevention and rate limiting, but stripped completely from faculty-facing interfaces.
- **Real-Time Synchronicity**: Socket.IO maintains live bidirectional pipelines between active classroom lecture rooms and faculty consoles.
- **Batched Timetable Engine**: Automatically maps parallel laboratory batches (B1, B2, B3) ensuring students see only their active practical/lecture slot.

## 3. High-Level Architecture Diagram
```
┌─────────────────────────────────────────────────────────┐
│              Next.js Frontend (Port 3000)               │
│  - Academic Institutional Design System (Tailwind CSS)  │
│  - App Router (Student / Teacher / Admin / Public)      │
│  - Socket.IO Client for instant updates                 │
└───────────────────────────┬─────────────────────────────┘
                            │ REST / WebSocket
┌───────────────────────────▼─────────────────────────────┐
│             Express + Node.js (Port 5000)               │
│  - Asia/Kolkata Timetable Engine                        │
│  - Socket.IO Realtime Engine (Rooms & Event Dispatch)   │
│  - Role-Based Access Control (Student/Teacher/Admin)    │
│  - Spam / Abuse Moderation Layer                        │
└───────────────────────────┬─────────────────────────────┘
                            │ Prisma ORM
┌───────────────────────────▼─────────────────────────────┐
│                    PostgreSQL DB                        │
│  - Normalized Schema for Timetable, Users, Doubts       │
└─────────────────────────────────────────────────────────┘
```
