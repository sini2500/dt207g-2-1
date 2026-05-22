const express = require("express");
const router = express.Router();

const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./db/db.sqlite");

// index, get, visa kurslistan
router.get("/", (req, res) => {

    // förbered fråga
    const sql = "SELECT * FROM courses ORDER BY created_at DESC";

    // hämta från databas
    db.all(sql, (err, data) => {

        let msg = req.query.msg || "";

        if (err) {
            return res.send("Kunde inte hämta data, finns databasen?");
        }

        // rendera vy med given data
        res.render("index", { courses: data, msg: msg });
    });

});

// ny, get, formulär för att lägga till kurs
router.get("/ny", (req, res) => {
    res.render("ny", { error: null });
});

// ny, post, mottagning av skickat formulär
router.post("/ny", (req, res) => {

    // separera till variabler
    const { coursecode, coursename, syllabus, progression } = req.body;

    // validera
    let error = null;

    const progressions = ["A", "B", "C"];

    if (!coursecode || !coursename || !syllabus || !progression) {
        error = "Alla fält måste fyllas i";
    }
    else if (!progressions.includes(progression)) {
        error = "Progression måste vara A, B eller C";
    }
    else if (!syllabus.startsWith("http")) {
        error = "Kursplan måste vara en url som börjar med http";
    }

    if (error) {
        return res.render("ny", { error: error });
    }

    // spara
    const sql = "INSERT INTO courses (coursecode, coursename, syllabus, progression) VALUES (?, ?, ?, ?)";

    db.run(sql, [coursecode, coursename, syllabus, progression], (err) => {
        if (err) {
            if (err.message.includes("UNIQUE")) {
                return res.render("ny", { error: "Kurskoden " + coursecode + " finns redan" });
            }
            return res.render("ny", { error: "Kunde inte spara kursen" });
        } else {
            res.redirect("/?msg=" + encodeURIComponent("Kursen sparades!"));
        }

    });
});

// radera, post, borttagning av kurs med id
router.get("/radera/:id", (req, res) => {

    // förebered fråga
    const id = req.params.id;
    const sql = "DELETE FROM courses WHERE id = ?";

    // ta bort från databas (ingen pilfunktion för callback, så "this" kan användas)
    db.run(sql, [id], function (err) {
        let msg = null;

        if (err) {
            msg = `Kunde inte radera kurs ${id}`;
        } else {
            msg = `Kurs med id ${id} togs bort`;
        }

        if (this.changes === 0) {
            msg = `Ingen ändring, kurs-ID ${id} är nog inte i databasen.`;
        }

        res.redirect("/?msg=" + encodeURIComponent(msg));

    });

});

// om, get, en sida om projektet
router.get("/om", (req, res) => {
    res.render("om");
});

// 404, status, sidan finns inte
router.use((req, res) => {
    res.status(404).render("404");
});

module.exports = router;