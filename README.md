# AI-EchOo E-commerce Platform

AI-EchOo is an AI-enabled e-commerce platform built to provide a smooth shopping experience with product browsing, cart management, wishlist, order handling, payments, admin product control, and chatbot-based assistance.

## Live Demo

**Deployed Link:** https://ai-echoo-ecommerce-platform.onrender.com/
**GitHub Repository:** https://github.com/Sp-bit-code/AI-EchOo-Ecommerce-Platform

## Project Overview

AI-EchOo E-commerce Platform is designed as a modern online shopping system where users can explore products, manage their cart and wishlist, place orders, and interact with an AI-powered chatbot for product-related support.

The platform also includes an admin dashboard for managing products, orders, stock status, and user-related activity. Supabase is used for authentication and database handling, while the interface is built with React for a responsive and user-friendly experience.

## Features

* User authentication and secure login system
* Product listing with detailed product information
* Cart management for adding and removing products
* Wishlist functionality for saving favorite products
* Order placement and order history tracking
* Payment flow integration
* Admin dashboard for product and order management
* Add, update, delete, and manage product stock
* AI chatbot support for product and shopping-related queries
* Responsive user interface for desktop and mobile screens
* Deployed live platform using Render

## Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Backend and Database

* Supabase
* SQL Database
* Authentication
* API Integration

### AI and Automation

* RAG Chatbot
* AI Assistant Support
* N8N Workflows

### Deployment

* Render
* GitHub

## Main Modules

### User Module

* User signup and login
* Product browsing
* Cart and wishlist management
* Order placement
* Payment handling
* Order history view

### Admin Module

* Admin login
* Dashboard overview
* Add new products
* Update existing products
* Delete products
* Manage stock availability
* View current orders
* Track order history and cancelled orders

### AI Chatbot Module

* Product-related query handling
* Shopping assistance
* Short and relevant responses
* Support for product search and user guidance

## Project Structure

```bash
AI-EchOo-Ecommerce-Platform/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── styles/
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── server.js
│
├── README.md
└── package.json
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/Sp-bit-code/AI-EchOo-Ecommerce-Platform.git
```

### 2. Navigate to the project folder

```bash
cd AI-EchOo-Ecommerce-Platform
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Start the frontend

```bash
npm run dev
```

### 5. Install backend dependencies

```bash
cd ../server
npm install
```

### 6. Start the backend

```bash
npm start
```

## Environment Variables

Create a `.env` file and add your required keys.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=your_backend_api_url
```

For backend:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5000
```

## Deployment

The project is deployed on Render.

**Live Website:** https://ai-echoo-ecommerce-platform.onrender.com/

## Key Learnings

* Built a complete e-commerce workflow with user and admin features
* Implemented Supabase authentication and database operations
* Managed product, cart, wishlist, order, and payment-related data
* Designed a responsive and clean user interface using React
* Added AI chatbot support for user assistance
* Improved debugging, deployment, and API integration skills

## Future Improvements

* Add advanced product filtering and sorting
* Improve chatbot product recommendation accuracy
* Add email notifications for orders
* Add analytics dashboard for admin
* Improve payment status tracking
* Add product review and rating system

## Author

**Sparsh Srivastava**

* GitHub: https://github.com/Sp-bit-code
* LinkedIn: https://linkedin.com/in/sparsh-srivastava-621882289
* Portfolio: https://sparsh-portfolio-qokw.onrender.com/

## License

This project is created for learning, development, and portfolio purposes.
