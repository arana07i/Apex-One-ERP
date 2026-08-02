# Apex One ERP

> Enterprise-grade Multi-Tenant ERP Platform built with .NET 8, ASP.NET Core, React 19, Clean Architecture, and CQRS.

Apex One ERP is a modern enterprise resource planning (ERP) platform designed for organizations that need a scalable solution for inventory, procurement, warehouse management, sales, invoicing, and financial operations.

The platform is designed for both **Cloud SaaS** and **On-Premise** deployments with enterprise-grade security, multi-tenant architecture, role-based access control, and white-label customization.

---

## 🚀 Features

### Inventory Management

- Product Catalog
- Categories & Brands
- Units of Measure
- Barcode & QR Support
- Batch & Lot Tracking
- Expiry Tracking
- Inventory Valuation
- FIFO Costing
- Weighted Average Costing
- Safety Stock Alerts
- Stock Adjustments
- Stock Transfers
- Multi-Warehouse Support

---

### Procurement

- Purchase Requisition (PR)
- Multi-Level Approval Workflow
- Purchase Orders (PO)
- Goods Receipt Notes (GRN)
- Supplier Management
- Purchase Analytics

---

### Warehouse Operations

- Multi-Warehouse
- Warehouse Zones
- Bin Locations
- Inventory Reservation
- Picking & Packing
- Dispatch Management

---

### Sales

- Customer Management
- Sales Quotations
- Sales Orders
- Invoice Generation
- Payment Tracking
- Customer Ledger

---

### Financial Management

- Accounts Receivable
- Accounts Payable
- Tax Calculation
- Supplier Ledger
- Customer Ledger
- Credit Notes
- Debit Notes
- Financial Reports

---

### Administration

- Multi-Tenant SaaS
- Role-Based Access Control (RBAC)
- User Management
- Audit Logs
- White-Label Branding
- Subscription Management
- Super Admin Portal

---

## 🏗️ Architecture

The application follows **Clean Architecture** with **CQRS** to ensure maintainability, scalability, and separation of concerns.

```
Presentation
        │
        ▼
Application (CQRS)
        │
        ▼
Domain
        │
        ▼
Infrastructure
        │
        ▼
PostgreSQL / SQL Server
```

### Architecture Principles

- Clean Architecture
- CQRS (MediatR)
- SOLID Principles
- Repository Pattern
- Dependency Injection
- Domain-Driven Design Concepts
- FluentValidation
- Global Exception Handling

---

# 🛠 Technology Stack

## Backend

- .NET 8
- ASP.NET Core Web API
- C#
- Entity Framework Core
- MediatR
- FluentValidation
- Serilog
- JWT Authentication

## Frontend

- React 19
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form
- React Router
- Recharts

## Database

- PostgreSQL
- SQL Server

## Infrastructure

- Redis
- MinIO
- AWS S3
- Docker
- Docker Compose

---

# 🔐 Security

- JWT Authentication
- Refresh Tokens
- Role-Based Authorization
- Tenant Isolation
- Audit Logging
- Secure Password Hashing
- OWASP Best Practices
- Global Exception Handling

---

# 🌐 Multi-Tenant SaaS

Apex One ERP is designed for commercial SaaS deployment.

Features include:

- Multi-Company
- Multi-Branch
- Multi-Warehouse
- Tenant Isolation
- White-Label Branding
- Subscription Plans
- Feature Flags
- Custom Domains
- Enterprise Licensing

---

# 📦 Modules

- Dashboard
- Products
- Categories
- Brands
- Warehouses
- Suppliers
- Customers
- Purchase Requisition
- Purchase Orders
- Goods Receipt
- Inventory
- Stock Transfers
- Sales Orders
- Invoices
- Payments
- Reports
- Users
- Roles
- Audit Logs
- Settings
- Super Admin

---

# 📈 Roadmap

### Version 1.0

- Multi-Tenant Architecture
- Inventory Management
- Procurement
- Warehouse Management
- Sales
- Financial Operations
- White-Label Branding
- Subscription Management

### Version 1.1

- Mobile Barcode Scanner
- Advanced Reporting
- Dashboard Customization

### Version 2.0

- AI Demand Forecasting
- OCR Invoice Processing
- Predictive Analytics
- AI Assistant

---

# 🚀 Getting Started

## Prerequisites

- .NET 8 SDK
- Node.js 22+
- PostgreSQL
- Redis
- Docker (Optional)

## Clone Repository

```bash
git clone https://github.com/arana07i/Apex-One-ERP.git

cd apex-one-erp
```

## Backend

```bash
cd backend

dotnet restore

dotnet ef database update

dotnet run
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 📁 Repository Structure

```
ApexOneERP/

backend/
frontend/
admin-portal/
marketing-website/
docs/
database/
docker/
tests/
.github/
```

---

# 📊 Project Status

**Version:** v1.0

Current Focus:

- Foundation
- Multi-Tenant Architecture
- Core ERP Modules

Future releases will introduce AI capabilities, advanced analytics, and additional enterprise modules.

---

# 🤝 Contributing

Contributions, feature requests, and bug reports are welcome.

Please open an issue before submitting a pull request.

---

# 📄 License

This repository is licensed under the MIT License.

For commercial licensing, enterprise deployment, or white-label solutions, please contact the project owner.

---

# ⭐ Support

If you find this project useful, consider giving it a ⭐ on GitHub.

Feedback and contributions are always appreciated.
