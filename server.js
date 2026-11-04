const express = require('express');
const db = require('./db');

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

//Ask the database for all posts (newest first)
//res.render('index', { posts }): fill views/index.ejs with that data
app.get('/', (req, res) =>{
    const posts = db.prepare('SELECT * FROM posts ORDER BY id DESC').all();
    res.render('index', { posts });
});

app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
});