const jwt = require('jsonwebtoken');
//qetu testohen tokenat okejjj
// Middleware per te verifikuar JWT tokenin
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    // pshb ne backend kur u bo kerkesa ekziston nje si kategori qe quhet headers edhe express.js e njef kit req.headers 
    //edhe na i thojna shko ne kategori headers edhe search per authorization 
    // edhe tash na i thojme okej kqyre a ekziston qeky authHeader qe e rujtem edhe bone split ndaje ku ka hapesire merre 
    // se kur perdorim split ky i bon si array na i thojna merre elementin 1 se tokeni ruhet qeshtu diqka mdoket tokenkpsokpoaksfpoakspfk
    //e neve na duhet qekjo anash token qata i thojna NA JEP VETEM ATE E SHENUME SI ARABISHT EDHE BONE VERIFY QATE TOKEN 
    // E MERR E DESHIFRON KY AUTOMATIKISHT E LYP A ESHTE KODI, A JON TE DHANAT E USERIT QESI SENE 
    if (!token) {
        return res.status(401).json({
            sukses: false,
            mesazhi: 'Qasja e refuzuar! Token mungon.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            sukses: false,
            mesazhi: 'Token i pavlefshem ose i skaduar!'
        });
    }
};

// Middleware per te verifikuar rolin
const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles) {
            return res.status(403).json({
                sukses: false,
                mesazhi: 'Qasja e refuzuar! Nuk keni rol te caktuar.'
            });
        }

        const hasRole = req.user.roles.some(role => allowedRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({
                sukses: false,
                mesazhi: 'Nuk keni autorizim per kete veprim!'
            });
        }

        next();
    };
};

module.exports = { verifyToken, verifyRole };