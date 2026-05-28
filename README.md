# 🍕 Pizzeria Management System

Sistem i plotë për menaxhimin e një picërie — nga porosia deri te dërgesa.

Ndërtuar me **Node.js**, **React**, dhe **MySQL** si projekt për lëndën Lab Course 1 (Programim).   

---

## 📋 Përmbajtja

- [Teknologjitë](#-teknologjitë)
- [Arkitektura](#-arkitektura)
- [Databaza](#-databaza)
- [Siguria](#-siguria)
- [API Dokumentacioni](#-api-dokumentacioni)
- [Instalimi](#-instalimi)
- [Struktura e Projektit](#-struktura-e-projektit)
- [Rolet e Sistemit](#-rolet-e-sistemit)
- [Screenshots](#-screenshots)

---

## 🛠 Teknologjitë

| Layer | Teknologjia |
|-------|-------------|
| Backend | Node.js + Express.js |
| Frontend | React.js + Bootstrap |
| Databaza | MySQL 8.0 |
| Autentifikimi | JWT (Access + Refresh Token) |
| Arkitektura | MVC (Model-View-Controller) |
| Version Control | Git + GitHub |

---

## 🏗 Arkitektura

```
Client (React) ──→ API (Express.js) ──→ MySQL Database
       ↑                    ↓
       └── JWT Auth ←───────┘
```

- **Frontend** komunikon me backend përmes REST API
- **Backend** përdor MVC pattern me controllers, routes, middleware, dhe models
- **Autentifikimi** bëhet me JWT access token (15 min) + refresh token (7 ditë) me rotation

---

## 🗄 Databaza

Sistemi ka **20 tabela** të ndara në tri grupe:

### Sistemi i Identitetit (6 tabela)
`users` · `roles` · `user_roles` · `user_claims` · `user_tokens` · `refresh_tokens`

### Tabelat e Picërisë (12 tabela)
`klientet` · `kategorite` · `produktet` · `perberesit` · `produkt_perberesit` · `porosite` · `detajet_porosise` · `punonjesit` · `dergesat` · `menyte` · `meny_produktet` · `vleresimet`

### Tabelat Shtesë (2 tabela)
`kuponat` · `adresat`

**19 indekse** të krijuara automatikisht për performancë optimale.

### Lidhjet kryesore:
- Klientet → Porosite → Detajet_Porosise ← Produktet
- Produktet ↔ Përberësit (Many-to-Many)
- Menytë ↔ Produktet (Many-to-Many)
- Porosite → Dërgesat ← Punonjësit
- Klientet → Adresat, Vlerësimet

---

## 🔐 Siguria

- **JWT Access Token** — skadon pas 15 minutash
- **Refresh Token Rotation** — kur përdoret, krijohet i ri dhe i vjetri revokohet
- **Logout nga të gjitha pajisjet** — revokon të gjitha refresh tokenat
- **Password hashing** — bcrypt me salt 10
- **Role-Based Access Control** — Admin, Menaxher, User
- **Input validation** — middleware i dedikuar për validim
- **CORS** — i konfiguruar për siguri
- **Environment variables** — .env për të dhëna sekrete

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
| Kategorite | `/api/kategorite` | CRUD kategoritë e produkteve |
| Produktet | `/api/produktet` | CRUD produktet me foto |
| Përberësit | `/api/perberesit` | CRUD përberësit me stok |
| Klientët | `/api/klientet` | CRUD klientët |
| Porositë | `/api/porosite` | CRUD porositë me detaje |
| Punonjësit | `/api/punonjesit` | CRUD punonjësit |
| Dërgesat | `/api/dergesat` | CRUD dërgesat me status |
| Menytë | `/api/menyte` | CRUD menytë + produktet |
| Vlerësimet | `/api/vleresimet` | Vlerësimet me yje (1-5) |
| Kuponat | `/api/kuponat` | CRUD kuponat + aplikim |
| Adresat | `/api/adresat` | Adresat e klientëve |
| Users | `/api/users` | Menaxhimi i përdoruesve |
| Roles | `/api/roles` | Menaxhimi i roleve |
| Dashboard | `/api/dashboard` | Statistikat e sistemit |

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
```

**3. Konfiguro frontend-in:**
```bash
cd ../frontend
npm install
```

**4. Starto MySQL:**
- Hap `services.msc` → gjej `MySQL80` → Start

**5. Starto aplikacionin:**

Backend (terminal 1):
```bash
cd backend
npm run dev
```

Frontend (terminal 2):
```bash
cd frontend
npm start
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
│   ├── config/          # Konfigurimi i databasës
│   ├── controllers/     # Logjika e biznesit (19 controllers)
│   ├── middleware/       # Auth + Validation middleware
│   ├── models/          # Krijimi i tabelave + indekse
│   ├── routes/          # Definimi i API rutave (19 routes)
│   └── server.js        # Entry point (PORT 5000)
│
└── frontend/
    └── src/
        ├── components/  # Navbar, Footer
        ├── context/     # AuthContext (state management)
        ├── pages/       # 18 faqe (Dashboard, CRUD, Login, etj.)
        └── services/    # Axios me JWT interceptors
```

---

## 👥 Rolet e Sistemit

| Roli | Qasja |
|------|-------|
| **Admin** | Qasje e plotë — Users, Roles, të gjitha CRUD operacionet |
| **Menaxher** | Menaxhon operacionet — Porosite, Klientet, Punonjësit, Dërgesat |
| **User** | Qasje e kufizuar — Dashboard, Kategorite, Produktet (vetëm shikim) |

---

## 👤 Autori

- **Edvin** — [@EdvinUBT](https://github.com/EdvinUBT)
- Kolegji UBT — Lab Course 1 (Programim)
