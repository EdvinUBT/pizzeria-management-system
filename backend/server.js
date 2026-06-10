const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');
const createTables = require('./models/database');
const connectMongoDB = require('./config/mongodb');
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

const auditLogsRoutes = require('./routes/auditLogsRoutes');

const notificationsRoutes = require('./routes/notificationsRoutes');

const exportImportRoutes = require('./routes/exportImportRoutes');

const reportsRoutes = require('./routes/reportsRoutes');

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

app.use('/api/audit-logs', auditLogsRoutes);

app.use('/api/notifications', notificationsRoutes);

app.use('/api', exportImportRoutes);

app.use('/api/reports', reportsRoutes);

// Socket.IO konfigurimi
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        credentials: true
    }
});

// Ruaj io instance per perdorim global
app.set('io', io);

// Socket.IO lidhjet
io.on('connection', (socket) => {
    console.log('Perdorues i lidhur:', socket.id);

    // Perdoruesi bashkohet ne dhomat e tij
    socket.on('join', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`Perdoruesi ${userId} u bashkua ne dhomen user_${userId}`);
    });

    socket.on('join_admin', () => {
        socket.join('admin_room');
        console.log('Admin u bashkua ne admin_room');
    });

    socket.on('disconnect', () => {
        console.log('Perdorues i shkeputur:', socket.id);
    });
});

// Porti nga .env ose 5000
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
    console.log(`Serveri eshte duke u ekzekutuar ne portin ${PORT}`);
    await createTables();
    await connectMongoDB();
});