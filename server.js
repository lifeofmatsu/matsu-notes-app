const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); //for generating unique IDs for notes

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//route to serve notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

//GET route to return all saved notes
app.get('/api/notes', (req, res) => {
    const notes = readDb();
    res.json(notes);
});
  
//POST route to add a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4(); //assign a unique ID

    const notes = readDb();
    notes.push(newNote);
    writeDb(notes);

    res.json(newNote);
});

//DELETE route to delete a note
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    let notes = readDb();
    notes = notes.filter(note => note.id !== id);
    writeDb(notes);

    res.json({ msg: 'Note deleted' });
});

//read from db.json
const readDb = () => {
    const data = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8');
    return JSON.parse(data);
}

//write to db.json
const writeDb = (data) => {
    fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(data, null, 4));
}

//DEFAULT route to serve index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});