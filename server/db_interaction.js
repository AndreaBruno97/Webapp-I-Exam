'use strict';
const Vehicle = require('./vehicle');

// Db inizialization
const sqlite = require('sqlite3');
const db = new sqlite.Database('car_rental_database.db3', (err) => { if (err) throw err; });
const bcrypt = require('bcrypt');
const jwtSecret = require('./secretString.js');
const saltRounds = 10;

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

exports.checkUserPassword = function (username, password) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM users WHERE username=?";

        db.get(query, [username], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined) {
                reject();
            } else {
                bcrypt.compare(password, row.hash).then((result)=>{
                    if(result){
                        const token={
                            userId:row.id,
                            userName:row.username
                        };
                        resolve(token);
                    }
                    else
                        reject();
                });
            }
        });
    });
};

function rentalFromRow(row){
    return {id: row.id, userId: row.userId, vehicleId: row.vehicleId, startDay: row.startDay,
        endDay: row.endDay,  carCategory: row.carCategory,  age: row.age,  driversNumber: row.driversNumber,
        estimatedKm: row.estimatedKm, insurance: row.insurance,  price: row.price};
}

exports.getAllRentals = function(userId){
    return new Promise((resolve, reject) => {
        let query=`SELECT * FROM rentals WHERE userId=?`;

        db.all(query, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            //{id: , userId: , vehicleId: , startDay: , endDay: ,  carCategory: ,  age: ,  driversNumber: , estimatedKm: , insurance: ,  price: }
            const projects = rows.map((e) => {return rentalFromRow(e)});
            resolve(projects);
        });
    });
};


// Delete an existing rental, given its id
exports.deleteRental = function (id){
    return new Promise((resolve, reject) => {
        let query = "DELETE FROM rentals WHERE id=?";

        db.run(query, [id], function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
};

// Select an existing rental, given its id
exports.rentalFromId = function(id){
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM rentals WHERE id=?";

        db.get(query, [id], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row !== undefined){
                resolve(rentalFromRow(row));
            }
            else{
                reject();
            }
        });
    });
};