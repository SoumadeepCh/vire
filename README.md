# Vire

**Vire** is your all-in-one platform for discovering, uploading, and selling video content online. Built for creators, educators, and businesses, Vire makes it easy to share your videos securely, manage your content, and accept payments—all in a beautiful, modern interface.

---

## 🌐 Live Demo

The live website will be available soon! Stay tuned for the link.

---

## What can you do with Vire?

-   **Browse and watch videos** from a curated library
-   **Upload your own videos** with secure, fast storage via ImageKit
-   **Sell your content** and accept payments with Razorpay
-   **Register and log in** securely with NextAuth.js
-   **Get notified** about purchases and uploads via email

Vire is designed for anyone who wants to monetize video content or build a video-based community with ease.

## ✨ Features

-   🔐 **User Authentication** (NextAuth.js)
-   📹 **Video Upload & Management** (ImageKit)
-   💳 **Payment Processing** (Razorpay)
-   🎨 **Modern UI** (Tailwind CSS, DaisyUI)
-   📱 **Fully Responsive Design**
-   🔒 **Secure API Routes**
-   📧 **Email Notifications** (Nodemailer)
-   🗄️ **MongoDB Database Integration**

## 🛠️ Tech Stack

-   **Frontend:** Next.js 15, React 19, TypeScript
-   **Styling:** Tailwind CSS, DaisyUI
-   **Authentication:** NextAuth.js, JWT
-   **Database:** MongoDB + Mongoose
-   **File Storage:** ImageKit
-   **Payment:** Razorpay
-   **Email:** Nodemailer
-   **Forms:** React Hook Form

## ⚡ Prerequisites

-   [Node.js](https://nodejs.org/) (Latest LTS)
-   [MongoDB](https://www.mongodb.com/)
-   [ImageKit](https://imagekit.io/) Account
-   [Razorpay](https://razorpay.com/) Account
-   SMTP Server (for email notifications)

## 🚀 Getting Started

1. **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd vire
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Configure environment variables:**

    - Copy `.env.example` to `.env`
    - Fill in all required values (see below)

4. **Run the development server:**

    ```bash
    npm run dev
    ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔑 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# ImageKit
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Email (SMTP)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

## 📦 Available Scripts

-   `npm run dev` — Start development server
-   `npm run build` — Build production application
-   `npm run start` — Start production server
-   `npm run lint` — Run ESLint
-   `npm run seed` — Seed the database
-   `npm run mailtrap` — Test email configuration

## 📁 Project Structure

```
├── app/                  # Next.js app directory
│   ├── api/              # API routes
│   ├── components/       # Reusable components
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── upload/           # Video upload page
├── lib/                  # Utility functions
├── models/               # MongoDB models
├── public/               # Static assets
└── types.d.ts            # TypeScript declarations
```

