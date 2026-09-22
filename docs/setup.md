# SGSITS Anonymous - Setup & Developer Guide

## Prerequisites
- Node.js >= 18 (Tested on v24.13.0)
- npm >= 9 (Tested on 11.8.0)

## Quick Start

### 1. Install & Build Backend
```bash
cd backend
npm install
npm run build
npm test
npm run dev
```

### 2. Install & Build Frontend
```bash
cd frontend
npm install
npm run build
npm run dev
```

### 3. Root Workspace Commands
```bash
npm run dev:backend   # Starts backend on http://localhost:5000
npm run dev:frontend  # Starts Next.js on http://localhost:3000
npm run test:backend  # Runs backend automated test suite
```
