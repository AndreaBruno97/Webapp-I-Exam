const express = require('express');

const PORT = 3001;

app = new express();

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

// Db inizialization
const sqlite = require('sqlite3');
const db = new sqlite.Database('car_rental_database.bd3', (err) => { if (err) throw err; });

// Test route
app.get('/', (req, res) => {res.json({"Hello": "World!"});});