# 🎆 BOOM Industries — BFW Fireworks

India's premier fireworks manufacturer, wholesaler, trader, and retailer based in Latur, Maharashtra. Lighting up celebrations for decades with quality, innovation, and safety.

---

## 🚀 Overview

This repository contains the official, high-performance web platform for **BOOM Industries (BFW Fireworks)**. It is built as a **100% Serverless, Vercel-Ready Web Application** with an interactive product catalog, instant Gmail inquiry forwarding, and a password-protected product management system.

---

## ✨ Features

- **🛍️ Dynamic Product Catalog (`/products`)**:
  - Browse fireworks by category (Rockets, Sparklers, Fountains, Crackers, Aerial Shells, Chakkar).
  - Search by product name and filter by price range.
  - Interactive 3D tilt cards with rating badges.
  - Multi-item **Inquiry Cart** with real-time total counter.

- **✉️ Direct Gmail / Email Forwarding**:
  - Automatically launches **Gmail Web Compose** (or native mail client) on submission.
  - Pre-fills all customer details, contact numbers, and selected products with itemized quantities and prices.

- **🔒 Password-Protected Product Manager (`/edit_page`)**:
  - **Access Password**: `boom5373`
  - Secured via **SHA-256 cryptographic verification** with session persistence.
  - Add, edit, and delete products, update prices, and upload images in real-time.
  - **⚡ Google Drive Image Integration**: Paste any Google Drive image share link, and it automatically converts into a high-speed direct CDN image.
  - **1-Click Code Export**: Export updated catalog code directly into `src/data/products.ts` for permanent version control.
  - Factory default reset capability.

- **🎆 Visual Media Gallery (`/gallery`)**:
  - High-definition event highlights, videos, and Instagram reels with a built-in lightbox viewer.

- **⚡ Optimized Aesthetics & Animations**:
  - Sleek dark theme with glowing gradients and glassmorphism.
  - **CPU-Optimized Particle Effects**: Ember floating particles and idle-detecting spark cursor (automatically disabled on touch screens to save battery).

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vite.dev/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Radix UI / Lucide Icons
- **Animations**: Framer Motion
- **Deployment & Architecture**: 100% Serverless (Vercel Compatible)

---

## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation & Local Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lavinpattnaikoffical-gif/sparkling-serenity.git
   cd sparkling-serenity
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🌐 Deploying to Vercel (1-Click)

This project requires **zero server configuration or database provisioning**.

1. Push your repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. Import this repository.
4. Vercel will auto-detect **Vite**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**! 🚀

---

## 🔐 Product Manager (`/edit_page`)

To manage your product inventory, prices, and images:

1. Navigate to `https://yourdomain.com/edit_page` (or click *Product Manager* in the website footer).
2. Enter the manager password: **`boom5373`**
3. Add/edit your fireworks or update prices.
4. To add images from Google Drive:
   - Ensure the image sharing in Google Drive is set to **"Anyone with the link can view"**.
   - Paste the link in the image field.

---

## 📄 License & Proprietary Notice

This project is private and proprietary. All rights reserved by **BOOM Industries (BFW Fireworks)**.

---
*Built for BOOM Industries • Latur, Maharashtra*
