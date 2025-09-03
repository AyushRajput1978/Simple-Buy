# E-Commerce Website

An Ecommerce Website made with React.js Framework.

<!-- ## Demo -->

## Run Locally

Clone the project

```bash
  git clone https://github.com/AyushRajput1978/Simple-Buy
```

Go to the project directory

```bash
  cd Simple-Buy
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

## Tech Stack

-Frontend: React, Redux Toolkit
-UI Library: Bootstrap 5 (customized)
-Routing: React Router
-State Management: Redux Toolkit
-Payment: Stripe
-Notifications: react-toastify
-API: REST API from Express backend (hosted on Railway)


src/
├── components/
│   ├── AddEditModals/           # Modals for CRUD operations
│   ├── layout/                  # Reusable layout components
│   ├── Tables/                  # Table components for admin views
│   ├── DashboardLayout.jsx      # Dashboard layout HOC
│   ├── Errorboundary.jsx        # Catch global errors
│   ├── Footer.jsx               # Footer component
│   ├── index.css                # index css for all the components
│   ├── index.js                 # import path for components
│   ├── Layout.jsx               # HOC for website
│   ├── HeroContainer.jsx        # Conatainer for Hero image
│   ├── Navbar.jsx               # Common Navbar
│   ├── Products.jsx             # Products section with filter and Product Card
│   ├── ProtectedRoutes.jsx      # Protecting dashboard routes
│   ├── Products.jsx             # Products section with filter and Product Card
│   └── Reviews.jsx              # Products review section for users 
│
├── hooks/                       # Custom React hooks
├── pages/                       # All page-level components (Home, Login, Cart, etc.)
├── redux/                       # Redux slices and store setup
├── utils/                       # Utility functions and helpers
├── main.jsx                     # App entry point
├── main.css                     # Global styles
├── axios.js                     # Axios instance with base API config
├── custom-theme.css/.scss       # Custom Bootstrap theme


## Features
- User Authentication (Register/Login/Password Reset)
- Product listing and filtering
- Cart management using Redux
- Payment Integration (Stripe)
- Product reviews and ratings
- Admin Dashboard to manage:
- Products
- Categories
- Users
- Orders
- Responsive design
- Toast-based notifications


