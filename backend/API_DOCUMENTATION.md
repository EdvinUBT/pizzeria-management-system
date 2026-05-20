# Dokumentacioni i API-t - Sistem per Menaxhimin e Picerise

## URL Baze

http://localhost:5000/api

## Autentifikimi
API perdor JWT (JSON Web Token). Pas login, dergoni tokenin ne header:

Authorization: Bearer <access_token>

---

## 1. Auth (Autentifikimi)

### POST /api/auth/register - Regjistrimi
**Body:**
```json
{
    "emri": "Edvin",
    "mbiemri": "Test",
    "email": "edvin@test.com",
    "password": "Test1234!",
    "phone_number": "044123456"
}
```
**Pergjigja:** `{ sukses: true, mesazhi: "Regjistrimi u krye me sukses!", userId: 1 }`

### POST /api/auth/login - Login
**Body:**
```json
{
    "email": "edvin@test.com",
    "password": "Test1234!"
}
```
**Pergjigja:** `{ sukses: true, accessToken: "...", refreshToken: "...", perdoruesi: {...} }`

### POST /api/auth/refresh-token - Rinovimi i Tokenit
**Body:** `{ "refreshToken": "..." }`

### POST /api/auth/logout - Logout
**Body:** `{ "refreshToken": "..." }`

---

## 2. Kategorite

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/kategorite | Merr te gjitha kategorite | Public |
| GET | /api/kategorite/:id | Merr nje kategori | Public |
| POST | /api/kategorite | Krijo kategori | Admin/Menaxher |
| PUT | /api/kategorite/:id | Perditeso kategori | Admin/Menaxher |
| DELETE | /api/kategorite/:id | Fshi kategori | Admin |

---

## 3. Produktet

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/produktet | Merr te gjitha produktet | Public |
| GET | /api/produktet/:id | Merr nje produkt | Public |
| GET | /api/produktet/kategoria/:id | Produktet sipas kategorise | Public |
| POST | /api/produktet | Krijo produkt | Admin/Menaxher |
| PUT | /api/produktet/:id | Perditeso produkt | Admin/Menaxher |
| DELETE | /api/produktet/:id | Fshi produkt | Admin |

---

## 4. Perberesit

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/perberesit | Merr te gjithe perberesit | Public |
| GET | /api/perberesit/:id | Merr nje perberes | Public |
| POST | /api/perberesit | Krijo perberes | Admin/Menaxher |
| PUT | /api/perberesit/:id | Perditeso perberes | Admin/Menaxher |
| DELETE | /api/perberesit/:id | Fshi perberes | Admin |

---

## 5. Klientet

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/klientet | Merr te gjithe klientet | Admin/Menaxher |
| GET | /api/klientet/:id | Merr nje klient | Token |
| POST | /api/klientet | Krijo klient | Public |
| PUT | /api/klientet/:id | Perditeso klient | Token |
| DELETE | /api/klientet/:id | Fshi klient | Admin |

---

## 6. Porosite

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/porosite | Merr te gjitha porosite | Admin/Menaxher |
| GET | /api/porosite/:id | Merr nje porosi me detaje | Token |
| GET | /api/porosite/klienti/:id | Porosite e nje klienti | Token |
| POST | /api/porosite | Krijo porosi | Token |
| PUT | /api/porosite/:id/statusi | Perditeso statusin | Admin/Menaxher |
| PUT | /api/porosite/:id/anulo | Anulo porosi | Token |
| DELETE | /api/porosite/:id | Fshi porosi | Admin |

---

## 7. Punonjesit

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/punonjesit | Merr te gjithe punonjesit | Admin/Menaxher |
| GET | /api/punonjesit/:id | Merr nje punonjes | Admin/Menaxher |
| POST | /api/punonjesit | Krijo punonjes | Admin |
| PUT | /api/punonjesit/:id | Perditeso punonjes | Admin |
| DELETE | /api/punonjesit/:id | Fshi punonjes | Admin |

---

## 8. Dergesat

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/dergesat | Merr te gjitha dergesat | Admin/Menaxher |
| GET | /api/dergesat/:id | Merr nje dergese | Token |
| POST | /api/dergesat | Krijo dergese | Admin/Menaxher |
| PUT | /api/dergesat/:id/statusi | Perditeso statusin | Admin/Menaxher |
| DELETE | /api/dergesat/:id | Fshi dergese | Admin |

---

## 9. Menyte

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/menyte | Merr te gjitha menyte | Public |
| GET | /api/menyte/:id | Merr nje meny me produktet | Public |
| POST | /api/menyte | Krijo meny | Admin/Menaxher |
| PUT | /api/menyte/:id | Perditeso meny | Admin/Menaxher |
| POST | /api/menyte/:id/produkt | Shto produkt ne meny | Admin/Menaxher |
| DELETE | /api/menyte/:id/produkt/:produktId | Hiq produkt nga menyja | Admin/Menaxher |
| DELETE | /api/menyte/:id | Fshi meny | Admin |

---

## 10. Vleresimet

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/vleresimet | Merr te gjitha vleresimet | Public |
| GET | /api/vleresimet/porosi/:id | Vleresimet e nje porosie | Public |
| POST | /api/vleresimet | Krijo vleresim | Token |
| PUT | /api/vleresimet/:id | Perditeso vleresim | Token |
| DELETE | /api/vleresimet/:id | Fshi vleresim | Admin |

---

## 11. Kuponat

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/kuponat | Merr te gjitha kuponat | Admin/Menaxher |
| GET | /api/kuponat/kodi/:kodi | Kontrollo kupon me kod | Token |
| POST | /api/kuponat | Krijo kupon | Admin/Menaxher |
| POST | /api/kuponat/apliko | Apliko kupon ne porosi | Token |
| PUT | /api/kuponat/:id | Perditeso kupon | Admin/Menaxher |
| DELETE | /api/kuponat/:id | Fshi kupon | Admin |

---

## 12. Dashboard

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/dashboard | Statistikat e sistemit | Admin/Menaxher |

---

## 13. Users (Perdoruesit)

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/users | Merr te gjithe perdoruesit | Admin |
| GET | /api/users/:id | Merr nje perdorues | Admin |
| POST | /api/users | Krijo perdorues | Admin |
| PUT | /api/users/:id | Perditeso perdorues | Admin |
| PUT | /api/users/:id/statusi | Aktivizo/Deaktivizo | Admin |
| DELETE | /api/users/:id | Fshi perdorues | Admin |

---

## 14. Roles (Rolet)

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/roles | Merr te gjitha rolet | Admin |
| GET | /api/roles/:id | Merr nje rol | Admin |
| POST | /api/roles | Krijo rol | Admin |
| PUT | /api/roles/:id | Perditeso rol | Admin |
| DELETE | /api/roles/:id | Fshi rol | Admin |

---

## 15. User Roles

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/user-roles/:userId | Rolet e nje perdoruesi | Admin |
| POST | /api/user-roles | Cakto rol | Admin |
| DELETE | /api/user-roles/:userId/:roleId | Hiq rol | Admin |

---

## 16. Adresat

| Metoda | Endpoint | Pershkrimi | Autorizimi |
|--------|----------|------------|------------|
| GET | /api/adresat/:klientId | Adresat e nje klienti | Token |
| POST | /api/adresat | Shto adrese | Token |
| PUT | /api/adresat/:id | Perditeso adrese | Token |
| DELETE | /api/adresat/:id | Fshi adrese | Token |

---

## Teknologjite e Perdorura
- **Backend:** Node.js, Express.js
- **Frontend:** React.js, Bootstrap
- **Databaza:** MySQL
- **Autentifikimi:** JWT (JSON Web Token)
- **Validimi:** Middleware i dedikuar

## Statuset e Porosise
- ne_pritje → ne_pergatitje → gati → ne_dergim → dorezuar
- anuluar (ne cdo moment)

## Rolet e Sistemit
- **Admin** - Qasje e plote ne sistem
- **Menaxher** - Menaxhon operacionet kryesore
- **User** - Qasje e kufizuar