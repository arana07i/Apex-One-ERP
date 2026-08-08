# Apex One ERP - Enterprise Resource Planning System

Apex One ERP is a commercial-grade Enterprise Resource Planning (ERP) platform built with a modern full-stack architecture featuring **React 19**, **Tailwind CSS**, **Node.js / Express**, **Cloud SQL (PostgreSQL)** with **Drizzle ORM**, and **Firebase Authentication**.

---

## 🌟 Architecture & Features

### Core Modules
1. **User & Role Management**: RBAC (Admin, Manager, Warehouse Operator, Purchasing Officer, Finance Auditor, View Only) with real-time audit logs.
2. **Products & Catalog Management**: Multi-category, SKU tracking, pricing, reorder points, hazardous material indicators.
3. **Suppliers & Customers**: Partner directories, lead times, tax IDs, credit limits, payment terms.
4. **Multi-Warehouse & Zone Management**: Capacity utilization, bin allocations, multi-warehouse stock visibility.
5. **Inventory Control & Movements**: Batch tracking, stock movements, inter-warehouse transfers, RMA returns.
6. **Procurement**: Purchase Requisitions (PR) and Purchase Orders (PO) with automated multi-step approval workflows.
7. **Sales & Billing**: Sales Orders (SO), Invoicing, Payments, Tax calculations, and AR balance tracking.
8. **Compliance & Audit Logging**: High-risk operation tracking, IP logging, and state transition histories.

### Tech Stack
- **Frontend**: React 19, Lucide Icons, Recharts, Framer Motion, Tailwind CSS v4
- **Backend API**: Node.js / Express with TypeScript
- **Database & Persistence**: Google Cloud SQL (PostgreSQL)
- **ORM & Migrations**: Drizzle ORM & Drizzle Kit
- **Authentication**: Firebase Auth + JWT fallback
- **Build & Server Strategy**: Vite, esbuild bundling for Express

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.x
- Cloud SQL PostgreSQL instance or local PostgreSQL instance
- Firebase project credentials

### Environment Setup
Copy `.env.example` to `.env` and fill in your Cloud SQL database credentials:

```bash
cp .env.example .env
```

Set the following variables in `.env`:
```env
# Database Credentials
SQL_DB_NAME=postgres
SQL_USER=postgres
SQL_PASSWORD=your_password
SQL_HOST=your_cloudsql_host_or_ip
SQL_ADMIN_USER=postgres
SQL_ADMIN_PASSWORD=your_password

# Application URL
APP_URL=http://localhost:3000
```

### Installation

```bash
npm install
```

### Running in Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:3000` with hot server reloads via `tsx`.

---

## 🛠️ Database Schema & Drizzle Commands

The database schema is defined in `src/db/schema.ts` using Drizzle ORM.

To generate or apply schema migrations:
```bash
# Push schema updates directly to the database
npx drizzle-kit push
```

---

## 📦 Building for Production

To build both the Vite frontend bundle and the Express CJS server executable:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

---

## 📄 License

Private - Enterprise Proprietary.
