# E-Commerce (Full-Stack) 🚀

A modern, high-performance, and feature-rich E-Commerce application built using the **MERN** stack (MongoDB, Express, React, Node.js). This project features a premium, responsive UI, secure authentication, and a robust admin management system.

---

## 🌐 Live Demo
Check out the live application here:  
👉 **[E-Commerce Live on Vercel](https://e-commerce-follow-along-xi.vercel.app)**

---

## ✨ Features

### 🔐 Authentication & Security
- **JWT & Cookie-based Authentication**: Secure user sessions using JSON Web Tokens stored in HTTP-only cookies.
- **Robust Validation**: Client-side and server-side validation for emails, passwords, and user details.
- **Secure Password Hashing**: Utilizes `bcryptjs` for protecting user credentials.

### 🛡 Admin Role-Based Access Control (RBAC)
- **Strict Admin Privileges**: Only the designated administrator account (`saideep@gmail.com`) has permissions to **Create, Update, and Delete** products.
- **Dynamic UI**: Administrative links (Add Product, My Products) are hidden from standard users to ensure a clean and secure experience.

### 🛒 Core E-Commerce Functionality
- **Product Management**: Feature-rich product cards with image support and category tagging.
- **Shopping Cart**: Real-time cart management including quantity adjustments and subtotal calculations.
- **User Profile**: Personalized dashboards where users can view their details, manage multiple shipping addresses, and **edit their profiles** (Full Name & Phone Number).

### 🎨 Premium UI/UX
- **Modern Aesthetic**: Built with a sleek dark-mode aesthetic using **Tailwind CSS**.
- **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices.
- **Lucide Icons**: High-quality SVG icons for a consistent and professional look.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **State Management**: Redux
- **Styling**: Tailwind CSS
- **Icons**: Lucide-React
- **Routing**: React Router DOM

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **File Handling**: Multer (for avatars and product images)

### Deployment
- **Platform**: Vercel (Deployed as a Monorepo for unified Frontend/Backend hosting)
- **CI/CD**: GitHub Integration

---

## 📂 Project Structure
```text
├── backend/            # Express server, models, controllers, and database config
├── frontend/           # Vite + React application
├── vercel.json         # Vercel monorepo deployment configuration
└── README.md           # Project documentation
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/dasarisaideep30/E-Commerce-carting.git
cd E-Commerce-carting
```

### 2. Backend Setup
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in `backend/config/.env` and add:
   ```env
   PORT = 8000
   DB_URL = your_mongodb_connection_string
   JWT_SECRET_ = your_jwt_secret
   JWT_EXPIRE = 7d
   ```
4. Start the server: `npm run dev`

### 3. Frontend Setup
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite app: `npm run dev`

---

## 🔧 Deployment
This project is configured for seamless deployment on **Vercel**. 
The root `vercel.json` ensures that both the frontend and backend are deployed together on the same origin, preventing CORS issues in production.

---

## 👤 Author
- **Saideep Dasari** - [GitHub](https://github.com/dasarisaideep30)

---

### 🙌 Acknowledgments
- Inspired by modern E-commerce design principles.
- Icons by [Lucide](https://lucide.dev/).
