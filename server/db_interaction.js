'use strict';
const Vehicle = require('./vehicle');

// Db inizialization
const sqlite = require('sqlite3');
const db = new sqlite.Database('car_rental_database.db3', (err) => { if (err) throw err; });

exports.getVehicles = function(categories, brands){
    return new Promise((resolve, reject) => {
        let query=`SELECT * FROM vehicles WHERE `;

        if(categories === undefined){
            // No filter selected on category
            query += `category LIKE ? `;
            categories = "%";
        }
        else{
            query += `category IN (?) `;
            // Map the list separated by | into a sql list ?filter=A|B|C -> ("A","B","C")
            let category_list = categories.split("|").map(e=>`"` + e + `"`);
            categories = category_list.toString();
        }

        if(brands === undefined){
            // No filter selected on category
            query += `AND brand LIKE ?`;
            brands = "%";
        }
        else{
            query += `AND brand IN (?)`;
            // Map the list separated by | into a sql list ?filter=A|B|C -> ("A","B","C")
            let brand_list = brands.split("|").map(e=>`"` + e + `"`);
            brands = brand_list.toString();
        }

        console.log(query);
        console.log(categories);
        console.log(brands);

        db.all(query, [categories, brands], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const projects = rows.map((e) => new Vehicle(e.id, e.category, e.brand, e.mode));
            resolve(projects);
        });
    });
};