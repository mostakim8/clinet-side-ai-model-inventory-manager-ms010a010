# AI Model Inventory & Marketplace - Client Side

A responsive, feature-rich full-stack web application designed for discovering, purchasing, and managing custom AI models. Built with **React, Tailwind CSS, and Firebase**, this client application features dynamic filtering, secure multi-role access, real-time inventory tracking, and seamless payment workflows.

---

## 🔗 Live Demo & Server Repository

* **Live Application:** [AI Model Marketplace Live](https://dulcet-fox-ad01e1.netlify.app/app)
* **Server Repository:** [GitHub Backend Repository](https://github.com/mostakim8/-server-side-aI-model-inventory-manager-ms010a010-.git)

---

##  Key Features

* **AI Model Showcase & Filtering:** Browse, search, and view detailed specifications of custom AI models.
* **Role-Based Dashboards:** Distinct interface views and action privileges for Admins and regular Users.
* **Secure Authentication:** User sign-up, sign-in, and persistent session handling powered by Firebase Auth.
* **Real-time Synchronization:** Instant state updates for purchases and inventory changes without page reloads.
* **Transaction Gateways:** Streamlined checkout process integrated with secure payment handling.
* **Responsive Modern UI:** Clean, pixel-perfect glassmorphic design system using Tailwind CSS and DaisyUI.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React.js
* **Styling & UI Components:** Tailwind CSS, DaisyUI
* **Authentication & Database:** Firebase Auth, Firestore
* **Data Fetching & State:** TanStack Query (React Query), Axios
* **Icons & Animation:** React Icons, Framer Motion

---

## ⚙️ Environment Variables Setup

To run this client-side application locally, create a `.env.local` file in the root directory and add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

## 💻 Local Setup & Installation
Clone the repository:

* Bash
* git clone [https://github.com/mostakim8/clinet-side-ai-model-inventory-manager-ms010a010.git](https://github.com/mostakim8/clinet-side-ai-model-inventory-manager-ms010a010.git)
* cd clinet-side-ai-model-inventory-manager-ms010a010
  
Install dependencies:
* Bash
* npm install
  
Start the development server:
* Bash
* npm run dev
