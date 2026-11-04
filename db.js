const { DatabaseSync } = require ('node:sqlite');

const db = new DatabaseSync('cms.db');

//IF NOT EXISTS: safe to run again
//PRIMARY KEY AUTOINCREMENT: unique id that counts up by itself
//NOT NULL: the column can't be empty 
//DEFAULT: filled in for us
db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        body TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;
