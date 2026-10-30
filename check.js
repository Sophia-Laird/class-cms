console.log('Node version: ' + process.version);

require('express');
console.log('[ok] express');

require('ejs');
console.log('[ok] ejs');

require('express-session');
console.log('[ok] express-session');

require('bcryptjs');
console.log('[ok] bcryptjs');

const { DatabaseSync } = require('node:sqlite');
const testDb = new DatabaseSync(':memory:');
testDb.exec('CREATE TABLE test (id INTEGER)');
console.log('[ok] sqlite');

console.log('Your stack is ready!')