const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const createTables = require('./models/database');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Konfigurimi i variablave te mjedisit nga .env
dotenv.config();

const app = express();

// Middleware
const cookieParser = require('cookie-parser');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Swagger konfigurimi
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Pizzeria Management System API',
            version: '1.0.0',
            description: 'API dokumentacioni per Sistemin e Menaxhimit te Picerise',
            contact: {
                name: 'Edvin',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Serveri Lokal',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Importo rutat
const authRoutes = require('./routes/authRoutes');

const kategoriteRoutes = require('./routes/kategoriteRoutes');

const produktetRoutes = require('./routes/produktetRoutes');

const perberesitRoutes = require('./routes/perberesitRoutes');

const klientetRoutes = require('./routes/klientetRoutes');

const porositeRoutes = require('./routes/porositeRoutes');

const punonjesitRoutes = require('./routes/punonjesitRoutes');

const dergesatRoutes = require('./routes/dergesatRoutes');

const menyteRoutes = require('./routes/menyteRoutes');

const vleresimetRoutes = require('./routes/vleresimetRoutes');

const produktPerberesitRoutes = require('./routes/produktPerberesitRoutes');

const dashboardRoutes = require('./routes/dashboardRoutes');

const usersRoutes = require('./routes/usersRoutes');

const rolesRoutes = require('./routes/rolesRoutes');

const userRolesRoutes = require('./routes/userRolesRoutes');

const kuponatRoutes = require('./routes/kuponatRoutes');

const adresatRoutes = require('./routes/adresatRoutes');

const userClaimsRoutes = require('./routes/userClaimsRoutes');

const userTokensRoutes = require('./routes/userTokensRoutes');

const klientPaneliRoutes = require('./routes/klientPaneliRoutes');

// Rruga testuese
app.get('/', (req, res) => {
    res.json({ mesazhi: 'Mire se vini ne API-n e Picerise!' });
});

// Rutat e autentifikimit
app.use('/api/auth', authRoutes);
//qekjo /api/auth i thote kur eshte route /api/auth shko merri senet me i menaxhu ne authRoutes
app.use('/api/kategorite', kategoriteRoutes);

app.use('/api/produktet', produktetRoutes);

app.use('/api/perberesit', perberesitRoutes);

app.use('/api/klientet', klientetRoutes);

app.use('/api/porosite', porositeRoutes);

app.use('/api/punonjesit', punonjesitRoutes);

app.use('/api/dergesat', dergesatRoutes);

app.use('/api/menyte', menyteRoutes);

app.use('/api/vleresimet', vleresimetRoutes);

app.use('/api/produkt-perberesit', produktPerberesitRoutes);

app.use('/api/dashboard', dashboardRoutes);

app.use('/api/users', usersRoutes);

app.use('/api/roles', rolesRoutes);

app.use('/api/user-roles', userRolesRoutes);

app.use('/api/kuponat', kuponatRoutes);

app.use('/api/adresat', adresatRoutes);

app.use('/api/user-claims', userClaimsRoutes);

app.use('/api/user-tokens', userTokensRoutes);

app.use('/api/klient-paneli', klientPaneliRoutes);

// Porti nga .env ose 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log(`Serveri eshte duke u ekzekutuar ne portin ${PORT}`);
    await createTables();
});