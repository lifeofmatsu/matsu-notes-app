//required module imports
const express = require('express');
const path = require('path');
const fs = require('fs');

/*
UUID module for generating unique IDs for notes.
This is useful for easy reference and modification,
as well as scalability & database integrity.
*/
const { v4: uuidv4 } = require('uuid');

//initialize express application
const app = express();
const PORT = process.env.PORT || 3000;

//middleware to parse json and url-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public')); //serve static (client-side) files

//route to serve notes.html upon '/notes' access 
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

//GET route to return all saved notes from database
app.get('/api/notes', (req, res) => {
    const notes = readDb();
    res.json(notes);
});

//POST route to add a new note to database
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4(); //assign a unique ID

    const notes = readDb();
    notes.push(newNote);
    writeDb(notes);

    res.json(newNote);
});

//DELETE route to delete a note from database
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    let notes = readDb();
    notes = notes.filter(note => note.id !== id); //remove the note with the required (given) ID
    writeDb(notes);

    res.json({ msg: 'Note has been deleted' });
});

//read from database (db.json)
const readDb = () => {
    const data = fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8');
    return JSON.parse(data);
}

//write to database (db.json)
const writeDb = (data) => {
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(data, null, 4));
}

//default route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//start server and listen on specified port
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});