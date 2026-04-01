# BOOM Industries - BFW Fireworks

India's finest fireworks manufacturer, wholesaler, and retailer. Lighting up your celebrations for decades with quality and safety.

## 🚀 Overview

BOOM Industries (BFW Fireworks) is a premier fireworks business based in Latur, India. This repository contains the source code for the official business platform, including a product catalog, image gallery, and a comprehensive admin management system.

## ✨ Features

- **Dynamic Product Catalog**: Browse through a wide variety of fireworks with detailed information.
- **Visual Gallery**: High-quality media showcase of celebrations and product demonstrations.
- **Inquiry System**: Professional multi-step inquiry forms for products and events.
- **Admin Dashboard**: Full CRUD management for products, media, and inquiries.
- **Responsive Design**: Premium dark-mode UI with smooth animations (Framer Motion, GSAP).
- **Secure Backend**: JWT-based authentication for administrative tasks.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI / Radix UI
- **Animations**: Framer Motion, GSAP
- **State Management**: Zustand
- **Data Fetching**: TanStack Query

### Backend
- **Server**: Node.js / Express.js
- **Database**: PostgreSQL
- **Media Storage**: Cloudinary
- **Authentication**: JWT & Bcrypt

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lavinpattnaikoffical-gif/sparkling-serenity.git
   cd sparkling-serenity
   ```

2. **Frontend Setup**
   ```bash
   npm install
   ```

3. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

4. **Environment Variables**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   DATABASE_URL=your_postgresql_url
   JWT_SECRET=your_secret
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. **Run Locally**
   ```bash
   # From the root directory
   npm run dev
   ```

## 📄 License

This project is private and proprietary. All rights reserved by BOOM Industries.

---
*Built for BOOM Industries*
