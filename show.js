const db = require('./db');

//.all() returns every matching row as an array of objects
const rows = db.prepare("SELECT * FROM users").all();
//console.table prints it like a spreadsheet
console.table(rows);