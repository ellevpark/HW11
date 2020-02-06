const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);
const readFileAsync = util.promisify(fs.readFile);

const app = express();

const PORT = 3000;

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//API routes

app.get("/api/notes", function(req, res){
    fs.readFile("db/db.json", "utf8", function(err, notes){
        if(err) throw err;
        console.log(typeof notes)
        res.json(JSON.parse(notes))
    })
});

app.post("/api/notes", async function(req, res){
  let newNote = req.body;
  console.log(newNote);
    try {
      let notes = await readFileAsync("db/db.json", "utf8");
      notes = JSON.parse(notes);
      notes.push(newNote);
      
      for (let i = 0; i < notes.length; i++){
        notes[i].id= i + 1;
      }      
        await writeFileAsync("db/db.json", JSON.stringify(notes, null, 2));

        res.json(newNote);
    } catch(err){
        //errors
    }
})

app.delete("/api/notes/:id", function(req, res) {

  const idDelete = parseInt(req.params.id);
  let database = JSON.parse(fs.readFileSync("./db/db.json", "utf-8"));
  const filteredArray = database.filter(note => note.id !== idDelete);
  const stringedDB = JSON.stringify(filteredArray);
  fs.writeFile("./db/db.json", stringedDB, "utf8", (err, data) => {
    if (err) throw err;
    console.log("note has been deleted");
  });
  res.json(filteredArray);
});

//HTML routes

app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});