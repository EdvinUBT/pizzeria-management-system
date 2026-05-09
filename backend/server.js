const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

// Konfigurimi i variablave te mjedisit nga .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rruga testuese
app.get('/', (req, res) => {
    res.json({ mesazhi: 'Mire se vini ne API-n e Picerise!' });
});

// Porti nga .env ose 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Serveri eshte duke u ekzekutuar ne portin ${PORT}`);
});