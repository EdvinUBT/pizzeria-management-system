// Validimi i email-it
const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Validimi i regjistrimit
const validateRegister = (req, res, next) => {
    const { emri, mbiemri, email, password } = req.body;
    const gabimet = [];

    if (!emri || emri.trim().length < 2) {
        gabimet.push('Emri duhet te kete te pakten 2 karaktere');
    }
    if (!mbiemri || mbiemri.trim().length < 2) {
        gabimet.push('Mbiemri duhet te kete te pakten 2 karaktere');
    }
    if (!email || !isValidEmail(email)) {
        gabimet.push('Email i pavlefshem');
    }
    if (!password || password.length < 6) {
        gabimet.push('Fjalekalimi duhet te kete te pakten 6 karaktere');
    }

    if (gabimet.length > 0) {
        return res.status(400).json({ sukses: false, gabimet });
    }
    next();
};

// Validimi i login
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const gabimet = [];

    if (!email || !isValidEmail(email)) {
        gabimet.push('Email i pavlefshem');
    }
    if (!password) {
        gabimet.push('Fjalekalimi eshte i detyrueshem');
    }

    if (gabimet.length > 0) {
        return res.status(400).json({ sukses: false, gabimet });
    }
    next();
};

// Validimi i kategorise
const validateKategori = (req, res, next) => {
    const { emri_kategorise } = req.body;
    const gabimet = [];

    if (!emri_kategorise || emri_kategorise.trim().length < 2) {
        gabimet.push('Emri i kategorise duhet te kete te pakten 2 karaktere');
    }

    if (gabimet.length > 0) {
        return res.status(400).json({ sukses: false, gabimet });
    }
    next();
};

// Validimi i produktit
const validateProdukt = (req, res, next) => {
    const { kategori_id, emri_produktit, cmimi_baze } = req.body;
    const gabimet = [];

    if (!kategori_id) {
        gabimet.push('Kategoria eshte e detyrueshme');
    }
    if (!emri_produktit || emri_produktit.trim().length < 2) {
        gabimet.push('Emri i produktit duhet te kete te pakten 2 karaktere');
    }
    if (!cmimi_baze || cmimi_baze <= 0) {
        gabimet.push('Cmimi duhet te jete me i madh se 0');
    }

    if (gabimet.length > 0) {
        return res.status(400).json({ sukses: false, gabimet });
    }
    next();
};

// Validimi i klientit
const validateKlient = (req, res, next) => {
    const { emri, mbiemri, email, fjalekalimi } = req.body;
    const gabimet = [];

    if (!emri || emri.trim().length < 2) {
        gabimet.push('Emri duhet te kete te pakten 2 karaktere');
    }
    if (!mbiemri || mbiemri.trim().length < 2) {
        gabimet.push('Mbiemri duhet te kete te pakten 2 karaktere');
    }
    if (!email || !isValidEmail(email)) {
        gabimet.push('Email i pavlefshem');
    }
    if (req.method === 'POST' && (!fjalekalimi || fjalekalimi.length < 6)) {
        gabimet.push('Fjalekalimi duhet te kete te pakten 6 karaktere');
    }

    if (gabimet.length > 0) {
        return res.status(400).json({ sukses: false, gabimet });
    }
    next();
};

// Validimi i porosise
const validatePorosi = (req, res, next) => {
    const { klient_id, detajet } = req.body;
    const gabimet = [];

    if (!klient_id) {
        gabimet.push('Klienti eshte i detyrueshem');
    }
    if (!detajet || detajet.length === 0) {
        gabimet.push('Porosia duhet te kete te pakten nje artikull');
    }
    if (detajet) {
        detajet.forEach((d, i) => {
            if (!d.produkt_id) gabimet.push(`Artikulli ${i + 1}: produkt_id mungon`);
            if (!d.sasia || d.sasia <= 0) gabimet.push(`Artikulli ${i + 1}: sasia duhet te jete me e madhe se 0`);
            if (!d.cmimi_njesi || d.cmimi_njesi <= 0) gabimet.push(`Artikulli ${i + 1}: cmimi duhet te jete me i madh se 0`);
        });
    }

    if (gabimet.length > 0) {
        return res.status(400).json({ sukses: false, gabimet });
    }
    next();
};

// Validimi i punonjesit
const validatePunonjes = (req, res, next) => {
    const { emri, mbiemri, roli } = req.body;
    const gabimet = [];

    if (!emri || emri.trim().length < 2) {
        gabimet.push('Emri duhet te kete te pakten 2 karaktere');
    }
    if (!mbiemri || mbiemri.trim().length < 2) {
        gabimet.push('Mbiemri duhet te kete te pakten 2 karaktere');
    }
    if (!roli) {
        gabimet.push('Roli eshte i detyrueshem');
    }

    if (gabimet.length > 0) {
        return res.status(400).json({ sukses: false, gabimet });
    }
    next();
};

// Validimi i vleresimit
const validateVleresim = (req, res, next) => {
    const { klient_id, porosi_id, yjet } = req.body;
    const gabimet = [];

    if (!klient_id) gabimet.push('Klienti eshte i detyrueshem');
    if (!porosi_id) gabimet.push('Porosia eshte e detyrueshme');
    if (!yjet || yjet < 1 || yjet > 5) gabimet.push('Yjet duhet te jene mes 1 dhe 5');

    if (gabimet.length > 0) {
        return res.status(400).json({ sukses: false, gabimet });
    }
    next();
};

// Validimi i kuponit
const validateKupon = (req, res, next) => {
    const { kodi, zbritja_perqind, data_fillimit, data_skadimit } = req.body;
    const gabimet = [];

    if (!kodi || kodi.trim().length < 3) {
        gabimet.push('Kodi i kuponit duhet te kete te pakten 3 karaktere');
    }
    if (!zbritja_perqind || zbritja_perqind <= 0 || zbritja_perqind > 100) {
        gabimet.push('Zbritja duhet te jete mes 1% dhe 100%');
    }
    if (!data_fillimit) gabimet.push('Data e fillimit eshte e detyrueshme');
    if (!data_skadimit) gabimet.push('Data e skadimit eshte e detyrueshme');

    if (gabimet.length > 0) {
        return res.status(400).json({ sukses: false, gabimet });
    }
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateKategori,
    validateProdukt,
    validateKlient,
    validatePorosi,
    validatePunonjes,
    validateVleresim,
    validateKupon
};