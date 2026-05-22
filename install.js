/* installera db */

const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./db/db.sqlite");

db.serialize(()=>{

    db.run("DROP TABLE IF EXISTS courses")

    db.run(`
        CREATE TABLE courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            coursecode TEXT NOT NULL UNIQUE,
            coursename TEXT NOT NULL,
            syllabus TEXT NOT NULL,
            progression TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);

    db.run(`
        INSERT INTO courses (coursecode, coursename, syllabus, progression)
        VALUES 
        ('DT207G', 'Backend-baserad webbutveckling', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT207G/', 'B'),
        ('DT084G', 'Introduktion till programmering i JavaScript', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT084G/', 'A'),
        ('DT200G', 'Grafisk teknik för webb', 'https://www.miun.se/utbildning/kursplaner-och-utbildningsplaner/DT200G/', 'B')
    `);

});

db.close();