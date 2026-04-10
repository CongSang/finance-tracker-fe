# 💰 Finance Tracker - Fullstack Financial Tracker (Frontend)

A modern personal finance dashboard built with **Next.js 14**. This application features an **AI-powered Invoice Scanner** to help users automate expense tracking with a clean, pastel-themed interface.

## 🚀 Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Pastel Palette)
- **State Management:** React Hooks & Context API
- **AI Integration:** OCR & AI processing for Invoice Scanning
- **Auth:** OAuth2 (Google) & JWT integration
- **Deployment:** Docker & GitHub Actions

## ✨ Key Features
- **🤖 AI Invoice Scanner:** Upload receipt images to automatically extract Date, Amount, and Category using AI.
- **📊 Interactive Dashboard:** Real-time visualization of income vs. expenses with dynamic charts.
- **💸 Transaction Management:** Full CRUD operations with advanced filtering and search.
- **🔐 Secure Auth:** Social login via Google OAuth2 and secure session handling with Cookies.
- **📱 Responsive Design:** Fully optimized for mobile, tablet, and desktop views.
- **🏗️ CI/CD:** Automated build pipelines via GitHub Actions.

## 🛠️ Setup & Installation
1. **Clone & Install:**
    ```bash
    git clone https://github.com/CongSang/finance-tracker-fe.git
    cd finance-tracker-fe
    npm install --force

2. **Environment Variables:** Create a .env.local file
    ```bash
    NEXT_PUBLIC_API_URL=http://localhost:8080/api
    NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

3. **Run Development:**
    ```bash
    npm run dev

## 🐳 Docker Deployment
  ```bash
  docker build -t finance-tracker-be .
  docker run -p 8080:8080 finance-tracker-be