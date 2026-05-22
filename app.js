const express = require('express');
const sqlite3 = require("sqlite3");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./db/cv.db");

/** hämta alla poster */
app.get("/api/workexperience", (req, res) => {

  const sql = "SELECT * FROM workexperience";

  db.all(sql, (err, rows) => {

    if (err) {
      return res.status(500).json({
        error: "Något gick fel"
      });
    }

    res.json(rows);

  });

});

/** hämta en post */
app.get("/api/workexperience/:id", (req, res) => {

  const id = req.params.id;
  const sql = "SELECT * FROM workexperience WHERE id = ?";

  db.get(sql, [id], (err, row) => {

    if (err) {
      return res.status(500).json({
        error: "Något gick fel"
      });
    }

    if (!row) {
      return res.status(404).json({
        error: "Ingen post hittades"
      });
    }

    res.json(row);

  });

});

/** skapa en ny post */
app.post("/api/workexperience", (req, res) => {

  const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

  if (!companyname || !jobtitle || !location || !startdate || !enddate || !description) {
    return res.status(400).json({ error: "Alla fält måste finnas" });
  }

  const sql = "INSERT INTO workexperience(companyname, jobtitle, location, startdate, enddate, description) VALUES (?, ?, ?, ?, ?, ?)";

  db.run(sql, [companyname, jobtitle, location, startdate, enddate, description], function (err) {

    if (err) {
      return res.status(500).json({
        error: "Kunde inte skapa post"
      });
    }

    res.status(201).json({
      message: "Post skapad",
      id: this.lastID
    });

  });

});

/** uppdatera en post */
app.put("/api/workexperience/:id", (req, res) => {

  const id = req.params.id;

  const { companyname, jobtitle, location, startdate, enddate, description } = req.body;

  const sql = "UPDATE workexperience SET companyname = ?, jobtitle = ?, location = ?, startdate = ?, enddate = ?, description = ? WHERE id = ?";

  db.run(sql, [companyname, jobtitle, location, startdate, enddate, description, id], function (err) {

    if (err) {
      return res.status(500).json({
        error: "Kunde inte uppdatera"
      });
    }

    res.json({
      message: "Post uppdaterad"
    });

  });

});

/** radera en post */
app.delete("/api/workexperience/:id", (req, res) => {

  const id = req.params.id;
  const sql = "DELETE FROM workexperience WHERE id = ?"

  db.run(sql, [id], function (err) {

    if (err) {
      return res.status(500).json({
        error: "Kunde inte radera"
      });
    }

    res.json({
      message: "Post raderad"
    });

  });

});

/** kör igång server */
app.listen(port, () => {
  console.log('Server is running on port: ' + port);
});