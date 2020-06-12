'use strict';
const Vehicle = require('./vehicle');

// Db inizialization
const sqlite = require('sqlite3');
const db = new sqlite.Database('car_rental_database.db3', (err) => { if (err) throw err; });

exports.getAllVehicles = function(){
    return new Promise((resolve, reject) => {
        let query=`SELECT * FROM vehicles`;

        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const projects = rows.map((e) => new Vehicle(e.id, e.category, e.brand, e.model));
            resolve(projects);
        });
    });
};