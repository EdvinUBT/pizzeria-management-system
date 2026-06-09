# 🍕 Pizzeria Management System

Sistem i plotë full-stack për menaxhimin e një picërie — nga porosia deri te dërgesa, me raporte dinamike dhe njoftime real-time.

Ndërtuar me **MERN Stack** — Node.js + Express.js, React + Vite, MySQL, MongoDB — si projekt për lëndën Lab Course 2 (Programim) në Kolegjin UBT.

---

## 📋 Përmbajtja

- [Teknologjitë](#-teknologjitë)
- [Arkitektura](#-arkitektura)
- [Databaza](#-databaza)
- [Siguria](#-siguria)
- [Real-Time Communication](#-real-time-communication)
- [State Management](#-state-management)
- [Additional Features](#-additional-features)
- [API Dokumentacioni](#-api-dokumentacioni)
- [Instalimi](#-instalimi)
- [Struktura e Projektit](#-struktura-e-projektit)
- [Rolet e Sistemit](#-rolet-e-sistemit)
- [ERD Diagrami](#-erd-diagrami)
- [Git Workflow](#-git-workflow)

---

## 🛠 Teknologjitë

| Layer | Teknologjia |
|-------|-------------|
| Backend | Node.js + Express.js |
| Frontend | React + Vite + Bootstrap |
| DB SQL | MySQL 8.0 (26 tabela) |
| DB NoSQL | MongoDB Atlas (2 koleksione) |
| Real-Time | Socket.IO |
| State Management | Zustand |
| Autentifikimi | JWT (httpOnly Cookies) + bcrypt |
| Arkitektura | 3-Shtresore (Controllers → Services → Repositories) |
| API Docs | Swagger / OpenAPI 3.0 |
| Version Control | Git + GitHub (Branches + Pull Requests) |

---

## 🏗 Arkitektura

```
Client (React + Vite)
    ↓ REST API + Socket.IO
Express.js Server
    ├── Controllers (HTTP request/response)
    ├── Services (Logjika e biznesit)
    ├── Repositories (SQL/MongoDB queries)
    ↓               ↓
  MySQL          MongoDB Atlas
 (26 tabela)    (AuditLogs, Notifications)
```

**Ndarja 3-Shtresore:**
- **Controllers** — Pranojnë kërkesat HTTP dhe kthejnë përgjigje (pa logjikë biznesi)
- **Services** — Përmbajnë logjikën e biznesit, validime dhe rregulla
- **Repositories** — Komunikimi me databazën (SQL dhe MongoDB)

**20 module** të refaktoruara në këtë arkitekturë: Auth, Kategorite, Produktet, Përberësit, ProduktPërberësit, Klientët, Porositë, Punonjësit, Dërgesat, Menytë, Vlerësimet, Kuponat, Adresat, Users, Roles, UserRoles, UserClaims, UserTokens, Dashboard, KlientPaneli.

---

## 🗄 Databaza

### MySQL — 26 Tabela (3NF)

**Sistemi i Identitetit (8 tabela):**
`users` · `roles` · `user_roles` · `permissions` · `role_permissions` · `refresh_tokens` · `user_claims` · `user_tokens`

**Tabelat e Picërisë (12 tabela):**
`klientet` · `kategorite` · `produktet` · `perberesit` · `produkt_perberesit` · `porosite` · `detajet_porosise` · `punonjesit` · `dergesat` · `menyte` · `meny_produktet` · `vleresimet`

**Tabelat Shtesë (6 tabela):**
`kuponat` · `adresat` · `audit_logs` · `notifications` · `settings` · `files`

**Karakteristika:**
- Të gjitha tabelat kanë kolonat `created_at`, `updated_at`, `created_by`, `updated_by`
- 29+ indekse për performancë optimale
- Foreign keys për integritetin referencial
- ENUM për statuse dhe role

### MongoDB Atlas — 2 Koleksione

| Koleksioni | Qëllimi | Justifikimi |
|------------|---------|-------------|
| **AuditLog** | Regjistrim veprimi (audit trail) | Shkrim i shpeshtë, schema fleksibël (JSON old/new values), nuk ka nevojë JOINs |
| **Notification** | Njoftime real-time | Volum i lartë, lexim/shkrim i shpeshtë, nuk ka relacione |

**Lidhjet kryesore:**
- Klientet → Porosite → Detajet_Porosise ← Produktet
- Produktet ↔ Përberësit (N:M përmes produkt_perberesit)
- Menytë ↔ Produktet (N:M përmes meny_produktet)
- Users ↔ Roles (N:M përmes user_roles)
- Roles ↔ Permissions (N:M përmes role_permissions)
- Porosite → Dërgesat ← Punonjësit
- Klientet → Adresat, Vlerësimet

---

## 🔐 Siguria

- **JWT** me Access Token (15 min) + Refresh Token (7 ditë) me Rotation
- **httpOnly Cookies** — tokenat ruhen si cookies, JavaScript nuk mund t'i lexojë (mbrojtje XSS)
- **Password hashing** — bcrypt me salt 10
- **Role-Based Access Control (RBAC)** — Admin, Menaxher, User
- **Input validation** — middleware i dedikuar për validim
- **CORS** — i konfiguruar me credentials dhe origin specifik
- **Environment variables** — .env për të dhëna sekrete

---

## 📡 Real-Time Communication

Implementuar me **Socket.IO** për komunikim në kohë reale:

- **Njoftime live** — kur statusi i porosisë ndryshon, klienti njoftohet në kohë reale
- **Porosi e re** — admin/menaxher njoftohen kur klienti krijon porosi
- **NotificationBell** — komponenti UI me dropdown, badge, mark as read
- **Rooms** — çdo user ka dhomën e vet (`user_{id}`), admin-ët bashkohen në `admin_room`

---

## 🏪 State Management

Implementuar me **Zustand** — state management i centralizuar:

| Store | Qëllimi |
|-------|---------|
| `useAuthStore` | Menaxhon user, login, logout, roles, socket connection |
| `useNotificationStore` | Menaxhon notifications, unread count, mark as read |

AuthContext mbetet si wrapper për backward compatibility me `useAuth()` hook.

---

## ⭐ Additional Features

### 1. Advanced Search (5 lista)
Kërkim i avancuar server-side me filtra, renditje dhe debounced API calls:
- **Produktet** — kërkim sipas emrit/përshkrimit, filtrim sipas kategorisë, çmimit min/max, statusit
- **Porositë** — kërkim sipas klientit, filtrim sipas statusit, metodës pageses, datës, totalit
- **Klientët** — kërkim sipas emrit/emailit/telefonit, filtrim sipas datës regjistrimit
- **Punonjësit** — kërkim sipas emrit/emailit, filtrim sipas rolit, statusit
- **Kuponat** — kërkim sipas kodit, filtrim sipas zbritjes, statusit, vlefshmërisë

### 2. Data Export/Import (5 lista)
Eksportim dhe importim i të dhënave në 3 formate për 5 lista:
- **Formatet:** CSV, Excel (.xlsx), JSON
- **Eksportim** — shkarko të dhënat me një klik
- **Importim** — ngarko fajll dhe importo të dhëna me validim
- **Listat:** Produktet, Porositë, Klientët, Punonjësit, Kuponat

### 3. Dynamic Reports
Raporte dinamike me grafika interaktive dhe eksportim:
- **Shitjet sipas kategorisë** — BarChart
- **Porositë sipas statusit** — PieChart
- **Shitjet ditore** — LineChart
- **Metodat e pagesës** — PieChart
- **Top 10 produktet** — Tabela
- **Filtra sipas datës** — Data Nga / Data Deri
- **Eksportim** — Excel, CSV, JSON

---

## 📖 API Dokumentacioni

API dokumentacioni është i disponueshëm përmes **Swagger UI**:

```
http://localhost:5000/api-docs
```

### Endpoints kryesore:

| Grupi | Bazë URL | Përshkrimi |
|-------|----------|------------|
| Auth | `/api/auth` | Register, Login, Refresh, Logout |
| Kategorite | `/api/kategorite` | CRUD + Search |
| Produktet | `/api/produktet` | CRUD + Search |
| Përberësit | `/api/perberesit` | CRUD përberësit |
| Klientët | `/api/klientet` | CRUD + Search |
| Porositë | `/api/porosite` | CRUD + Search + Status |
| Punonjësit | `/api/punonjesit` | CRUD + Search |
| Dërgesat | `/api/dergesat` | CRUD + Status |
| Menytë | `/api/menyte` | CRUD + produktet |
| Vlerësimet | `/api/vleresimet` | CRUD vlerësimet |
| Kuponat | `/api/kuponat` | CRUD + Search + Aplikim |
| Adresat | `/api/adresat` | CRUD adresat |
| Users | `/api/users` | Menaxhimi i përdoruesve |
| Roles | `/api/roles` | Menaxhimi i roleve |
| Dashboard | `/api/dashboard` | Statistikat |
| Audit Logs | `/api/audit-logs` | Regjistrim veprimi (MongoDB) |
| Notifications | `/api/notifications` | Njoftime (MongoDB) |
| Export | `/api/export/:entity` | Eksportim CSV/Excel/JSON |
| Import | `/api/import/:entity` | Importim CSV/Excel/JSON |
| Reports | `/api/reports` | Raporte dinamike |
| Klient Paneli | `/api/klient-paneli` | Paneli i klientit |

---

## 🚀 Instalimi

### Kërkesat paraprake:
- Node.js (v18+)
- MySQL Server 8.0
- Git

### Hapat:

**1. Klono repository-n:**
```bash
git clone https://github.com/EdvinUBT/pizzeria-management-system.git
cd pizzeria-management-system
```

**2. Konfiguro backend-in:**
```bash
cd backend
npm install
```

Krijo fajllin `.env` në dosjen `backend/`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pizzeria_db
JWT_SECRET=your_secret_key
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pizzeria_db?retryWrites=true&w=majority
```

**3. Konfiguro frontend-in:**
```bash
cd ../frontend
npm install
```

**4. Starto MySQL:**
```bash
# Windows
net start MySQL80
```

**5. Starto aplikacionin:**

Backend (terminal 1):
```bash
cd backend
npm start
```

Frontend (terminal 2):
```bash
cd frontend
npm run dev
```

**6. Hap në browser:**
- Frontend: `http://localhost:3000`
- API: `http://localhost:5000`
- Swagger: `http://localhost:5000/api-docs`

---

## 📁 Struktura e Projektit

```
pizzeria-management-system/
├── backend/
│   ├── config/
│   │   ├── db.js              # MySQL connection
│   │   └── mongodb.js         # MongoDB Atlas connection
│   ├── controllers/           # 22 controllers
│   ├── services/              # 20 services (business logic)
│   ├── repositories/          # 22 repositories (database access)
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification + RBAC
│   │   ├── validateMiddleware.js
│   │   └── auditMiddleware.js  # Audit logging
│   ├── models/
│   │   ├── database.js         # MySQL table creation
│   │   └── mongodb/
│   │       ├── AuditLog.js     # Mongoose schema
│   │       └── Notification.js # Mongoose schema
│   ├── routes/                 # 22 route files me Swagger docs
│   ├── utils/
│   │   ├── exportHelper.js     # CSV/Excel/JSON export
│   │   └── socketHelper.js     # Socket.IO notification helper
│   ├── server.js               # Entry point + Socket.IO
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── NotificationBell.jsx  # Real-time notifications
│   │   │   └── ExportImport.jsx      # Export/Import UI
│   │   ├── context/
│   │   │   └── AuthContext.jsx        # Wrapper per useAuth()
│   │   ├── store/
│   │   │   ├── useAuthStore.jsx       # Zustand auth store
│   │   │   └── useNotificationStore.jsx
│   │   ├── pages/                     # 20+ faqe
│   │   │   ├── Dashboard.jsx
│   │   │   ├── KlientDashboard.jsx
│   │   │   ├── Raportet.jsx           # Dynamic Reports me grafika
│   │   │   └── ...
│   │   └── services/
│   │       ├── api.jsx                # Axios me credentials
│   │       └── socket.jsx             # Socket.IO client
│   ├── vite.config.js
│   └── package.json
│
├── docs/
│   └── ERD_Pizzeria_Management_System.html  # ERD Diagram
│
└── README.md
```

---

## 👥 Rolet e Sistemit

| Roli | Qasja |
|------|-------|
| **Admin** | Qasje e plotë — Users, Roles, CRUD, Raporte, Export/Import |
| **Menaxher** | Menaxhon operacionet — Porosite, Klientet, Punonjësit, Raporte |
| **User** | Paneli i Klientit — Menyja, Porositë, Adresat, Profili |

### Paneli i Klientit (User):
- Shiko menynë dhe produktet me vlerësime
- Krijo porosi me shportë dhe personalizim
- Tracking bar i statusit (5 hapa)
- Apliko kuponë me verifikim real-time
- Menaxho adresat e dërgesës
- Njoftime live për ndryshim statusi

---

## 📊 ERD Diagrami

ERD diagrami interaktiv (me zoom dhe pan) gjendet në:
```
docs/ERD_Pizzeria_Management_System.html
```
Përfshin të 26 tabelat SQL me relacionet, si dhe 2 koleksionet MongoDB.

---

## 🔀 Git Workflow

- **Branches:** `main` → `dev` → `feature/*`
- **Pull Requests:** Çdo feature zhvillohet në branch të veçantë, pastaj PR në `dev`
- **Commits:** Mesazhe përshkruese (feat:, fix:, refactor:)

### PRs të kryera:
1. `feature/vite-migration` — Migrimi CRA → Vite
2. `feature/database-updates` — 6 tabela të reja + kolona audit
3. `feature/three-layer-architecture` — Refaktorimi 3-shtresor
4. `feature/mongodb-integration` — MongoDB Atlas për AuditLogs/Notifications
5. `feature/socket-io-integration` — Socket.IO real-time notifications
6. `feature/centralized-state-management` — Zustand stores
7. `feature/advanced-search` — Advanced Search për 5 lista
8. `feature/data-export-import` — Data Export/Import CSV/Excel/JSON
9. `feature/dynamic-reports` — Dynamic Reports me grafika

---

## 👤 Autori

- **Edvin** — [@EdvinUBT](https://github.com/EdvinUBT)
- Kolegji UBT — Lab Course 2 (Programim) — Viti Akademik 2025/2026
