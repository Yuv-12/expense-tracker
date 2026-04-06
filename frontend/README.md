# 💸 Expense Tracker Web App

A full-stack **Expense Tracker Application** built using modern web technologies.
It allows users to track income and expenses, visualize financial data, and manage transactions securely with authentication.

---

## 🚀 Features

### 🔐 Authentication

* Secure login & signup using **Clerk**
* Session-based user management
* Protected routes for authenticated users

### 💰 Transaction Management

* Add Income & Expense transactions
* Edit and delete transactions
* Categorize expenses (e.g., Food, Travel, Gym)

### 📊 Dashboard & Analytics

* Total Income, Expense, and Balance overview
* Expense distribution (Pie Chart)
* Monthly spending trends (Bar Chart)

### ⚠️ Validation

* Prevent expenses exceeding total income
* Form validation for required fields
* Backend validation for secure data handling

### 🌙 UI/UX

* Clean and modern UI with **Tailwind CSS**
* Dark mode toggle
* Responsive layout

---

## 🧱 Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Recharts (for charts)
* Clerk (Authentication)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

---

## 📁 Project Structure

```
Expense-Tracker/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── styles/
│
├── backend/
│   ├── server.js
│   └── models/
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker
```

---

### 2️⃣ Setup Backend

```
cd backend
npm install
```

Create a `.env` file:

```
MONGO_URI=mongodb://127.0.0.1:27017/expense-tracker
PORT=5000
```

Run backend:

```
npm start
```

---

### 3️⃣ Setup Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Frontend (.env)

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

### Backend (.env)

```
MONGO_URI=your_mongodb_uri
PORT=5000
```

---

## 📡 API Endpoints

| Method | Endpoint          | Description          |
| ------ | ----------------- | -------------------- |
| GET    | /transactions     | Get all transactions |
| POST   | /transactions     | Add new transaction  |
| PUT    | /transactions/:id | Update transaction   |
| DELETE | /transactions/:id | Delete transaction   |

---

## 🧪 Test Cases

### ✅ Testcase 1

* Error shown when signing up with an existing email

### ✅ Testcase 2

* Expense cannot be greater than total income

### ✅ Testcase 3

* Invalid or empty fields are not allowed in transactions

---

## 📸 Screenshots

* Dashboard overview
* Add transaction modal
* Charts visualization
* Dark mode UI

*(Add screenshots here if needed)*

---

## 🛡️ Validation Logic

* Backend ensures:

  * Total expense ≤ total income
* Frontend ensures:

  * Required fields are filled
  * Valid input formats

---

## 🌐 Future Improvements

* Multi-user data isolation using Clerk userId
* Export reports (PDF/CSV)
* Budget tracking system
* Notifications & alerts
* Deployment (Vercel + Render)

---

## 🤝 Contributing

Contributions are welcome!
Feel free to fork the repo and submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Yuvraj Gupta**

* GitHub: https://github.com/YOUR_USERNAME

---

## ⭐ If you like this project

Give it a ⭐ on GitHub!
