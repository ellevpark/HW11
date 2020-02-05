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

        newNote.id = 52345

        await writeFileAsync("db/db.json", JSON.stringify(notes));

        res.json(newNote);
    } catch(err){
        //errors
    }
})

app.delete("api/notes/:id", function(req, res){
    //req.params
})

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