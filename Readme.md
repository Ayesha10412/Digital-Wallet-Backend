# 💳 Digital Wallet API (Express + Mongoose)

A secure, modular, and role-based backend API for a **digital wallet system**, built with **Express.js, TypeScript, and Mongoose**.
Supports **users**, **agents**, and **admins** with authentication, wallet management, transactions, and role-based access control.

---

## 🚀 Features

- 🔐 **Authentication & Authorization** – JWT + bcrypt + refresh tokens + role-based guards
- 👥 **Roles** – `ADMIN`, `USER`, `AGENT` with clear boundaries
- 🏦 **Wallet Management** – auto-created wallets with initial balance, block/unblock support
- 🔁 **Transactions** – deposits, withdraws, sends, cash-in/out, full history
- 🧱 **Modular Structure** – clean separation of concerns (auth, user, wallet, transaction)
- 📦 **Validation** – strong request validation with Zod
- 🧩 **Error Handling** – centralized error responses

---

## 📁 Project Structure

```
src/
├── app.ts                # Express app entry
├── config/               # Config (db, jwt, etc.)
├── middlewares/          # Auth, error handling
├── modules/
│   ├── auth/             # Authentication & authorization
│   ├── user/             # User and agent logic
│   ├── wallet/           # Wallet operations
│   └── transaction/      # Transaction handling
├── utils/                # Helpers (jwt, bcrypt, async wrapper, etc.)
```

---

## ⚙️ Installation & Setup

### 1. Clone the repo

git clone https://github.com/your-username/digital-wallet-api.git
cd digital-wallet-api

```

### 2. Install dependencies


npm install
```

### 3. Setup environment

Create a `.env` file in the root:

```env
PORT=5000
MONGO_URI=
JWT_SECRET=
```

### 4. Run the project

npm run dev # development
npm run build # build
npm start # production

```

---

## 📜 API Endpoints

### 1️⃣ Authentication (`auth/`)

| Method | Endpoint             | Description                               | Roles               |
| ------ | -------------------- | ----------------------------------------- | ------------------- |
| POST   | /auth/register       | Register new user/agent/admin             | Public              |
| POST   | /auth/login          | Login and receive access + refresh tokens | Public              |
| POST   | /auth/refresh-token  | Get new access token using refresh token  | All logged-in users |
| POST   | /auth/logout         | Clear cookies & logout                    | All logged-in users |
| POST   | /auth/reset-password | Reset password                            | Logged-in users     |

---

### 2️⃣ User (`user/`)

| Method | Endpoint    | Description                   | Roles        |
| ------ | ----------- | ----------------------------- | ------------ |
| GET    | /users      | Get all users/agents          | admin        |
| GET    | /users/\:id | Get single user info          | admin / self |
| PATCH  | /users/\:id | Update user info (admin only) | admin        |
| PATCH  | /users/me   | Update own info               | user / agent |
| GET    | /users/me   | Get own profile               | user / agent |

---

### 3️⃣ Wallet (`wallet/`)

| Method | Endpoint                 | Description                     | Roles         |
| ------ | ------------------------ | ------------------------------- | ------------- |
| POST   | /wallet/deposit          | Add money to own wallet         | user / agent  |
| POST   | /wallet/withdraw         | Withdraw from own wallet        | user / agent  |
| POST   | /wallet/send             | Send money to another user      | user / agent  |
| POST   | /wallet/cash-in          | Agent/Admin deposits to user    | agent / admin |
| POST   | /wallet/cash-out         | Agent/Admin withdraws from user | agent / admin |
| GET    | /wallet/\:id             | Get wallet balance              | admin / self  |
| GET    | /wallet/history/\:userId | Get transaction history         | admin / self  |

---

### 4️⃣ Transactions (`transaction/`)

| Method | Endpoint           | Description            | Roles        |
| ------ | ------------------ | ---------------------- | ------------ |
| GET    | /transactions/me   | Get own transactions   | user / agent |
| GET    | /transactions/all  | Get all transactions   | admin        |
| GET    | /transactions/\:id | Get single transaction | admin / self |

---

## 🔁 Flow of Operations

### Example: User Sends Money

1. `/wallet/send` → JWT validated by `checkAuth`
2. Backend checks balance + wallet status
3. Deduct sender balance → Add receiver balance
4. Create `Transaction` record
5. Respond with success + updated balance

---

## 🧪 Postman Testing Guide

1. Register → `/auth/register`
2. Login → `/auth/login` (store access token)
3. Test user ops → `/wallet/deposit`, `/wallet/send`
4. Test agent ops → `/wallet/cash-in`, `/wallet/cash-out`
5. Test admin ops → `/users`, `/wallet/history/:id`, `/transactions/all`
6. Test refresh token → `/auth/refresh-token`

---

## 🛠 Tech Stack

* **Express.js** – API framework
* **TypeScript** – strong typing
* **Mongoose** – MongoDB ODM
* **JWT + bcrypt** – authentication & security
* **Zod** – validation
* **Nodemon/ts-node** – dev tools

---

## ✅ Evaluation Checklist

*  JWT + bcrypt authentication
*  Role-based authorization
*  Auto wallet creation
*  Transaction recording
*  Modular folder structure
*  Admin/user/agent role separation
*  README + Postman + video demo

---

## ⚠️ Challenges

* Ensuring JWT security and preventing brute force attacks
* Handling atomic balance updates during simultaneous transactions
* Simplified agent approval (no fraud checks yet)
* Limited scalability (single-node MongoDB)
* Cash-in/out not connected to real banking APIs
* Basic user info only (no KYC verification)

## 🔮 Future Improvements

* Add 2FA and device-based login security
* Migrate to microservices for scalability
* Integrate with real bKash/Nagad/bank APIs
* Implement fraud detection & monitoring system
* Add agent commission mechanism
* Support multi-currency wallets
* Provide mobile app integration (GraphQL/gRPC)
* Add KYC & AML compliance features


---

```
