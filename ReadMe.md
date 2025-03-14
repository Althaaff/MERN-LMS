Learning Management System (LMS) - MERN Stack

📌 Project Overview

The Learning Management System (LMS) is a MERN stack-based platform where instructors can sell courses, and students can purchase and track their progress. Admins manage courses and users, while students can browse, buy, and learn from various courses.

🚀 Features Implemented

Admin Features

✅ Course Creation: Add/edit/delete courses with details.

✅ User Authentication: Secure signup and login.

✅ Dashboard: Manage courses, users, and sales data.

Student Features

✅ Homepage with Slider: Showcasing featured courses.

✅ Category-Based Filtering: Browse courses by category.

✅ Course Details Page: View course info and purchase.

✅ Purchase & PayPal Integration: Secure checkout for courses.

✅ Course Progress Tracking: Access purchased courses and track progress.

🛠️ Tech Stack

Frontend: React.js, Shadcn, tailwind

Backend: Node.js, Express.js, MongoDB, Mongoose

Authentication: JWT (JSON Web Token)

Payment: PayPal API

Storage: Cloudinary (for storing course content)

📂 Folder Structure
LMS-Project/
│── backend/
│ ├── models/ # Mongoose schemas
│ ├── controllers/ # Backend logic
│ ├── routes/ # API endpoints
│ ├── middleware/ # Authentication & validation
│ ├── config/ # Database and environment configs
│ ├── helpers/ # storage (cloudinary for file upload)

│── frontend/
│ ├── components/ # Reusable React components
│ ├── api/ # axios instance base URL setup
│ ├── pages/ # Pages for different routes
│ ├── hooks/ # Custom React hooks
│ ├── context/ # Global state management
│ ├── config/ # utils (form data & more)
│ ├── services/ # client api services
│── README.md
│── package.json
│── .env
