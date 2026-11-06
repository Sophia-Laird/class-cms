const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
//urlencoded: turns submitted form data into req.body
app.use(express.urlencoded({ extended: false }));

function requireLogin(req, res, next) {
    if(!req.session.user) {
        return res.redirect("/login");
    }
    next();
}

//session: enables login memory and sets the cookie
app.use(session({
    secret: "I put pinapple on pizza",
    resave: false,
    saveUninitialized: false
}));
//makes user available in every template
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.get("/login", (req, res) => {
    res.render("login", { error: null});
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    //Find the user, then compare the typed password to the stored hash
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
    //Success: save the user in the session, then redirect (a 302!)
    if(user && bcrypt.compareSync(password, user.password_hash)) {
        req.session.user = { id: user.id, username: user.username };
        return res.redirect("/admin");
    }
    //Failure: show the form again with an error (we don't say which part was wrong)
    res.render("login", { error: "Wrong username or password."});
});

//Ask the database for all posts (newest first)
//res.render('index', { posts }): fill views/index.ejs with that data
app.get('/', (req, res) =>{
    const posts = db.prepare('SELECT * FROM posts ORDER BY id DESC').all();
    res.render('index', { posts });
});

app.get("/post/:id", (req, res) => {
    const post = db.prepare("SELECT *  FROM posts WHERE id = ?").get(req.params.id);
    if (!post) {
        return res.status(404).send("Post not found");
    }
    res.render("post", { post });
});

app.get("/admin", requireLogin, (req,res) => {
    const posts = db.prepare("SELECT * FROM posts ORDER BY id DESC").all();
    res.render("dashboard", { posts });
});

app.post("/logout", (req, res) => {
    //session.destroy throws away the server's note about you. The cookie is now useless. 
    req.session.destroy(() => {
        res.redirect("/");
    });
});

app.get("/admin/new", requireLogin, (req, res) => {
    res.render("edit", { post: null });
});

app.post("/admin/new", requireLogin, (req, res) => {
    const { title, body } = req.body;
    db.prepare("INSERT INTO posts (title, body) VALUES (?, ?)").run(title, body);
    res.redirect("/admin");
});

app.get("/admin/edit/:id", requireLogin, (req, res) => {
    const { title, body } = req.body;
    db.prepare("UPDATE posts SET Rtitle = ?, body = ? WHERE id = ?").run(title, body, req.params.id);
    res.redirect("/admin");
});

app.post("/admin/delete/:id", requireLogin, (req, res) => {
    db.prepare("DELETE FROM posts WHERE id = ?").run(req.params.id);
    res.redirect("/admin");
})

app.listen(PORT, () => {
    console.log("Server running at http://localhost:" + PORT);
});