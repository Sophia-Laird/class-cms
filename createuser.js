const bcrypt = require("bcryptjs");
const db = require("./db");

//process.argv is the list of words typed on the command line. Index 0 and 1 are Node and the file, so ours start at 2.
const username = process.argv[2];
const password = process.argv[3];


if (!username || !password){
    console.log("Usage: node createuser.js <username> <password>");
    process.exit(1);
}
//hashSync(password, 10) scrambles the password. The 10 controls how slow (and so how hard to guess) it is.
const hash = bcrypt.hashSync(password, 10);

db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(username, hash);

console.log("Created user: " + username);
console.log("Stored hash: " + hash);