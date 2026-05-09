const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const createTables = require('./models/database');

// Konfigurimi i variablave te mjedisit nga .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Importo rutat
const authRoutes = require('./routes/authRoutes');

// Rruga testuese
app.get('/', (req, res) => {
    res.json({ mesazhi: 'Mire se vini ne API-n e Picerise!' });
});

// Rutat e autentifikimit
app.use('/api/auth', authRoutes);

// Porti nga .env ose 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Serveri eshte duke u ekzekutuar ne portin ${PORT}`);
    await createTables();
});