const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); //needed for the deletion of notes

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

router.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

router.get("/api/notes", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("./db/db.json"));
  res.json(notes);
});

router.post("/api/notes", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("./db/db.json"));
  const noteID = Object.assign(req.body, { id: `${uuidv4()}` }); //needed for deletion of notes gives notes ids
  notes.push(noteID); //assigns ids to notes
  const stringNote = JSON.stringify(notes);
  fs.writeFileSync("./db/db.json", stringNote);
  res.json(notes);
});
//router.delete deletes notes by removing note with given id and rewriting the file with non deleted notes
router.delete("/api/notes/:id", (req, res) => {
  const notes = JSON.parse(fs.readFileSync("./db/db.json"));
  const noteID = req.params.id;
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].id === noteID) {
      notes.splice(i, 1);
      const newNotes = JSON.stringify(notes);
      fs.writeFileSync("./db/db.json", newNotes);
      return res.json(notes);
    }
  }
});

module.exports = router;
