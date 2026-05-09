const db = require('../config/db');

const createTables = async () => {
    try {
        // ==========================================
        // TABELAT E SISTEMIT TE IDENTITETIT
        // ==========================================

        // 1. Tabela Users
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                emri VARCHAR(100) NOT NULL,
                mbiemri VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                phone_number VARCHAR(20),
                email_confirmed BOOLEAN DEFAULT FALSE,
                lockout_enabled BOOLEAN DEFAULT FALSE,
                access_failed_count INT DEFAULT 0,
                data_krijimit DATETIME DEFAULT CURRENT_TIMESTAMP,
                statusi ENUM('aktiv', 'joaktiv', 'bllokuar') DEFAULT 'aktiv'
            )
        `);
        console.log('Tabela users u krijua me sukses!');

        // 2. Tabela Roles
        await db.query(`
            CREATE TABLE IF NOT EXISTS roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                emertimi VARCHAR(100) NOT NULL UNIQUE,
                pershkrimi TEXT,
                normalized_name VARCHAR(100) NOT NULL UNIQUE
            )
        `);
        console.log('Tabela roles u krijua me sukses!');

        // 3. Tabela UserRoles (Many-to-Many)
        await db.query(`
            CREATE TABLE IF NOT EXISTS user_roles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                role_id INT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_role (user_id, role_id)
            )
        `);
        console.log('Tabela user_roles u krijua me sukses!');

        // 4. Tabela UserClaims
        await db.query(`
            CREATE TABLE IF NOT EXISTS user_claims (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                claim_type VARCHAR(255) NOT NULL,
                claim_value TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Tabela user_claims u krijua me sukses!');

        // 5. Tabela UserTokens
        await db.query(`
            CREATE TABLE IF NOT EXISTS user_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                login_provider VARCHAR(255) NOT NULL,
                token_name VARCHAR(255) NOT NULL,
                token_value TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Tabela user_tokens u krijua me sukses!');

        // 6. Tabela RefreshTokens
        await db.query(`
            CREATE TABLE IF NOT EXISTS refresh_tokens (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                token VARCHAR(500) NOT NULL,
                expires DATETIME NOT NULL,
                created DATETIME DEFAULT CURRENT_TIMESTAMP,
                revoked DATETIME NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Tabela refresh_tokens u krijua me sukses!');

        console.log('------------------------------------');
        console.log('Te gjitha tabelat e identitetit u krijuan me sukses!');

        // ==========================================
        // TABELAT E PICERISE
        // ==========================================

        // 7. Tabela Klientet
        await db.query(`
            CREATE TABLE IF NOT EXISTS klientet (
                klient_id INT AUTO_INCREMENT PRIMARY KEY,
                emri VARCHAR(100) NOT NULL,
                mbiemri VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                telefoni VARCHAR(20),
                adresa TEXT,
                data_regjistrimit DATETIME DEFAULT CURRENT_TIMESTAMP,
                fjalekalimi_hash VARCHAR(255) NOT NULL
            )
        `);
        console.log('Tabela klientet u krijua me sukses!');

        // 8. Tabela Kategorite
        await db.query(`
            CREATE TABLE IF NOT EXISTS kategorite (
                kategori_id INT AUTO_INCREMENT PRIMARY KEY,
                emri_kategorise VARCHAR(100) NOT NULL,
                pershkrimi TEXT,
                renditja INT DEFAULT 0,
                aktive BOOLEAN DEFAULT TRUE
            )
        `);
        console.log('Tabela kategorite u krijua me sukses!');

        // 9. Tabela Produktet
        await db.query(`
            CREATE TABLE IF NOT EXISTS produktet (
                produkt_id INT AUTO_INCREMENT PRIMARY KEY,
                kategori_id INT NOT NULL,
                emri_produktit VARCHAR(200) NOT NULL,
                pershkrimi TEXT,
                cmimi_baze DECIMAL(10, 2) NOT NULL,
                foto_url VARCHAR(500),
                aktive BOOLEAN DEFAULT TRUE,
                koha_pergatitjes_min INT DEFAULT 0,
                FOREIGN KEY (kategori_id) REFERENCES kategorite(kategori_id) ON DELETE CASCADE
            )
        `);
        console.log('Tabela produktet u krijua me sukses!');

        // 10. Tabela Perberesit
        await db.query(`
            CREATE TABLE IF NOT EXISTS perberesit (
                perberes_id INT AUTO_INCREMENT PRIMARY KEY,
                emri_perberesit VARCHAR(200) NOT NULL,
                njesia_matese VARCHAR(50),
                sasia_stok DECIMAL(10, 2) DEFAULT 0,
                cmimi_shtese DECIMAL(10, 2) DEFAULT 0,
                alergjene VARCHAR(255)
            )
        `);
        console.log('Tabela perberesit u krijua me sukses!');

        // 11. Tabela Produkt_Perberesit (Many-to-Many)
        await db.query(`
            CREATE TABLE IF NOT EXISTS produkt_perberesit (
                produkt_perberes_id INT AUTO_INCREMENT PRIMARY KEY,
                produkt_id INT NOT NULL,
                perberes_id INT NOT NULL,
                sasia_standarde DECIMAL(10, 2) DEFAULT 0,
                eshte_opsionale BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (produkt_id) REFERENCES produktet(produkt_id) ON DELETE CASCADE,
                FOREIGN KEY (perberes_id) REFERENCES perberesit(perberes_id) ON DELETE CASCADE
            )
        `);
        console.log('Tabela produkt_perberesit u krijua me sukses!');

        // 12. Tabela Porosite
        await db.query(`
            CREATE TABLE IF NOT EXISTS porosite (
                porosi_id INT AUTO_INCREMENT PRIMARY KEY,
                klient_id INT NOT NULL,
                data_porosise DATETIME DEFAULT CURRENT_TIMESTAMP,
                statusi ENUM('ne_pritje', 'ne_pergatitje', 'gati', 'ne_dergim', 'dorezuar', 'anuluar') DEFAULT 'ne_pritje',
                totali DECIMAL(10, 2) DEFAULT 0,
                metoda_pageses ENUM('cash', 'karte', 'online') DEFAULT 'cash',
                adresa_dergeses TEXT,
                shenimet TEXT,
                FOREIGN KEY (klient_id) REFERENCES klientet(klient_id) ON DELETE CASCADE
            )
        `);
        console.log('Tabela porosite u krijua me sukses!');

        // 13. Tabela Detajet_Porosise
        await db.query(`
            CREATE TABLE IF NOT EXISTS detajet_porosise (
                detaj_id INT AUTO_INCREMENT PRIMARY KEY,
                porosi_id INT NOT NULL,
                produkt_id INT NOT NULL,
                sasia INT NOT NULL DEFAULT 1,
                cmimi_njesi DECIMAL(10, 2) NOT NULL,
                personalizimi TEXT,
                nentotali DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (porosi_id) REFERENCES porosite(porosi_id) ON DELETE CASCADE,
                FOREIGN KEY (produkt_id) REFERENCES produktet(produkt_id) ON DELETE CASCADE
            )
        `);
        console.log('Tabela detajet_porosise u krijua me sukses!');

        // 14. Tabela Punonjesit
        await db.query(`
            CREATE TABLE IF NOT EXISTS punonjesit (
                punonjes_id INT AUTO_INCREMENT PRIMARY KEY,
                emri VARCHAR(100) NOT NULL,
                mbiemri VARCHAR(100) NOT NULL,
                roli ENUM('menaxher', 'kuzhinier', 'kamarier', 'shofer', 'admin') NOT NULL,
                telefoni VARCHAR(20),
                email VARCHAR(255),
                data_punesimit DATETIME DEFAULT CURRENT_TIMESTAMP,
                aktiv BOOLEAN DEFAULT TRUE
            )
        `);
        console.log('Tabela punonjesit u krijua me sukses!');

        // 15. Tabela Dergesat
        await db.query(`
            CREATE TABLE IF NOT EXISTS dergesat (
                dergese_id INT AUTO_INCREMENT PRIMARY KEY,
                porosi_id INT NOT NULL,
                punonjes_id INT NOT NULL,
                koha_nisjes DATETIME,
                koha_dergeses DATETIME,
                statusi ENUM('ne_pritje', 'ne_rruge', 'dorezuar', 'deshtuar') DEFAULT 'ne_pritje',
                adresa TEXT,
                FOREIGN KEY (porosi_id) REFERENCES porosite(porosi_id) ON DELETE CASCADE,
                FOREIGN KEY (punonjes_id) REFERENCES punonjesit(punonjes_id) ON DELETE CASCADE
            )
        `);
        console.log('Tabela dergesat u krijua me sukses!');

        // 16. Tabela Menyte
        await db.query(`
            CREATE TABLE IF NOT EXISTS menyte (
                meny_id INT AUTO_INCREMENT PRIMARY KEY,
                emri_menys VARCHAR(200) NOT NULL,
                pershkrimi TEXT,
                data_fillimit DATE,
                data_mbarimit DATE,
                aktive BOOLEAN DEFAULT TRUE
            )
        `);
        console.log('Tabela menyte u krijua me sukses!');

        // 17. Tabela Meny_Produktet (Many-to-Many)
        await db.query(`
            CREATE TABLE IF NOT EXISTS meny_produktet (
                meny_produkt_id INT AUTO_INCREMENT PRIMARY KEY,
                meny_id INT NOT NULL,
                produkt_id INT NOT NULL,
                cmimi_special DECIMAL(10, 2),
                renditja INT DEFAULT 0,
                FOREIGN KEY (meny_id) REFERENCES menyte(meny_id) ON DELETE CASCADE,
                FOREIGN KEY (produkt_id) REFERENCES produktet(produkt_id) ON DELETE CASCADE
            )
        `);
        console.log('Tabela meny_produktet u krijua me sukses!');

        // 18. Tabela Vleresimet
        await db.query(`
            CREATE TABLE IF NOT EXISTS vleresimet (
                vleresim_id INT AUTO_INCREMENT PRIMARY KEY,
                klient_id INT NOT NULL,
                porosi_id INT NOT NULL,
                yjet INT NOT NULL CHECK (yjet >= 1 AND yjet <= 5),
                komenti TEXT,
                data_vleresimit DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (klient_id) REFERENCES klientet(klient_id) ON DELETE CASCADE,
                FOREIGN KEY (porosi_id) REFERENCES porosite(porosi_id) ON DELETE CASCADE
            )
        `);
        console.log('Tabela vleresimet u krijua me sukses!');

        console.log('====================================');
        console.log('TE GJITHA 18 TABELAT U KRIJUAN ME SUKSES!');
        console.log('====================================');

    } catch (error) {
        console.error('Gabim gjate krijimit te tabelave:', error.message);
    }
};

module.exports = createTables;