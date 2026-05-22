/* installera db */

const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./db/cv.db");

db.serialize(()=>{

    db.run("DROP TABLE IF EXISTS workexperience")

    db.run(`
        CREATE TABLE IF NOT EXISTS workexperience (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            companyname TEXT NOT NULL,
            jobtitle TEXT NOT NULL,
            location TEXT NOT NULL,
            startdate TEXT NOT NULL,
            enddate TEXT NOT NULL,
            description TEXT NOT NULL
        )
    `);

    db.run(`
        INSERT INTO workexperience (companyname, jobtitle, location, startdate, enddate, description)
        VALUES 
        ('ICA', 'Ägare', 'Hemma', '2000-01-01', '2012-12-12', 'Hemma på min gata i staaaan...'),
        ('Stugan', 'Kapten', 'Taket', '2022-01-01', '2033-12-12', 'Världens bästa karlsson...')
    `);

});

db.close();