# GreenCare Pharmacy

Complete full-stack online pharmacy e-commerce demo with a React frontend, ASP.NET Core Web API backend, SQL Server persistence, JWT authentication, role-based admin tools, product management, cart checkout, orders, and seed data.

This is a demo application. It does not provide medical advice, diagnosis, or treatment guidance.

## Tech Stack

- Frontend: React, React Router, Context API, Vite, responsive CSS
- Backend: C#, ASP.NET Core Web API, Entity Framework Core, JWT Bearer auth
- Database: SQL Server via EF Core migrations

## Project Structure

```text
Backend/
  Controllers/
  Data/
  DTOs/
  Middleware/
  Migrations/
  Models/
  Services/
Frontend/
  src/
    api/
    components/
    context/
    pages/
    styles/
```

## Default Accounts

- Admin: `admin@pharmacy.com` / `Admin123!`
- User: `user@pharmacy.com` / `User123!`

Passwords are hashed when startup seed data is created.

## Backend Setup

1. Install .NET 8 SDK and SQL Server or SQL Server LocalDB.
2. Update `Backend/appsettings.json` if needed:

```json
"DefaultConnection": "Server=(localdb)\\v11.0;Database=GreenCarePharmacyDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
```

This machine currently reports a LocalDB instance named `v11.0` from `sqllocaldb i`. If your SQL Server installation uses the newer default instance, change the server to `(localdb)\\MSSQLLocalDB`.

3. Run the API:

```bash
cd Backend
dotnet restore
dotnet ef database update
dotnet run
```

The API runs at:

- `https://localhost:7001`
- `http://localhost:5001`
- Swagger: `https://localhost:7001/swagger`

`Program.cs` also calls `Database.MigrateAsync()` and seeds demo data at startup, so running the API will apply pending migrations automatically.

## Frontend Setup

1. Install Node.js 20+.
2. Create `Frontend/.env` if your API URL differs from the default:

```text
VITE_API_BASE_URL=http://localhost:5001/api
```

3. Run the React app:

```bash
cd Frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

On Windows PowerShell, if `npm.ps1` is blocked by execution policy, use:

```bash
cmd /c npm install
cmd /c npm run dev
```

## Core API Routes

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Products:

- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/products/category/{categoryId}`
- `GET /api/products/admin/all`
- `POST /api/products/admin`
- `PUT /api/products/admin/{id}`
- `DELETE /api/products/admin/{id}`

Categories:

- `GET /api/categories`
- `POST /api/categories/admin`
- `PUT /api/categories/admin/{id}`
- `DELETE /api/categories/admin/{id}`

Orders:

- `POST /api/orders`
- `GET /api/orders/my-orders`
- `GET /api/orders/{id}`
- `GET /api/orders/admin/all`
- `PUT /api/orders/admin/{id}/status`

Users and Admin:

- `GET /api/users/profile`
- `PUT /api/users/profile`
- `GET /api/admin/dashboard-stats`

## Security and Business Rules

- JWT tokens include user id, email, and role claims.
- Admin endpoints require the `Admin` role.
- Passwords are hashed with BCrypt.
- Product deletion is a soft delete by setting `IsActive = false`.
- Orders are calculated server-side using current product prices.
- Checkout validates active products, stock availability, and prescription restrictions.
- Product stock is reduced after successful order placement.
- CORS is configured for the Vite frontend.

## Demo Data

Seeded categories include pain relief, cold and flu, vitamins, first aid, skin care, baby care, and personal care.

Seeded products include Paracetamol 500mg, Ibuprofen 200mg, Vitamin C Tablets, Digital Thermometer, Cough Syrup, First Aid Kit, Antiseptic Cream, and Allergy Relief Tablets.
