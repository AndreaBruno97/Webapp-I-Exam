import Vehicle from "./vehicle.js"
import Rental from "./rental.js"
const baseURL = "/api";

// GET api/vehicles
// Get all vehicles
async function getVehicles() {
    let url = "/vehicles";

    const response = await fetch(baseURL + url);
    const vehicleJson = await response.json();
    if(response.ok){
        return vehicleJson.map((v) => new Vehicle(v.id, v.category, v.brand, v.model));
    } else {
        let err = {status: response.status, errObj:vehicleJson};
        return err;  // An object with the error coming from the server
    }
};

// POST /api/login      (object: {"username": , "password": })
// Logs the user in
async function login(username, password){
    let url = "/login";

    return new Promise((resolve, reject) => {
        fetch(baseURL + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {
                    "username": username,
                    "password": password
                }),
        }).then( (response) => {
            if(response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then( (obj) => {reject(obj);} ) // error msg in the response body
                    .catch( (err) => {reject({ errors: [{ param: "Application", msg: "Cannot parse server response" }] }) }); // something else
            }
        }).catch( (err) => {reject({ errors: [{ param: "Server", msg: "Cannot communicate" }] }) }); // connection errors
    });
}

// POST /api/logout
// Logs the user out
async function logout(){
    let url = "/logout";

    const response = await fetch(baseURL + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (! response.ok){
        throw response;
    }
}


// GET /api/user
// Checks if the usre is authenticated
async function getCookie(){
    let url = "/user";

    const response = await fetch(baseURL + url);
    if (response.ok) {
        const cookie = response.json();
        return cookie;
    } else {
        if(response.status===401){
            // Not authenticated
            return undefined;
        }
        else{
            throw response;
        }
    }
}

// GET /api/rentals
// Gives all the rentals of an authenticated user
async function getRentals() {
    let url = "/rentals";

    const response = await fetch(baseURL + url);
    const rentalJson = await response.json();
    if(response.ok){
        return rentalJson.map((v) => new Rental(v.id, v.userId, v.vehicleId, v.startDay, v.endDay,  v.carCategory,  v.age,
        v.driversNumber, v.estimatedKm, v.insurance,  v.price));
    } else {
        let err = {status: response.status, errObj:rentalJson};
        return err;  // An object with the error coming from the server
    }
};

// DELETE /api/rentals/:id
// Deletes a rental, if the relative user is the authenticated one,
// and if the task is not past
async function deleteRental(id){
    // DELETE /api/rentals/:id
    let url = `/rentals/${id}`;

    return new Promise((resolve, reject) => {
        fetch(baseURL + url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                {}),
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } else {
                // analyze the cause of error
                response.json()
                    .then((obj) => {
                        reject(obj);
                    }) // error msg in the response body
                    .catch((err) => {
                        reject({errors: [{param: "Application", msg: "Cannot parse server response"}]})
                    }); // something else
            }
        })
            .catch((err) => {
                reject({errors: [{param: "Server", msg: "Cannot communicate"}]})
            }); // connection errors
    });
};

// GET /api/rentals/past
// Gives the number of past rentals
async function getPastRentalsNumber() {
    let url = "/rentals/past";

    const response = await fetch(baseURL + url);
    const number = await response.json();
    if(response.ok){
        return number.num;
    } else {
        let err = {status: response.status, errObj:number};
        return err;  // An object with the error coming from the server
    }
};

// POST /api/stubpayment {fullName: , cardNumber: , cvv: }
// Stub for a payment API
async function stubPayment(fullName, cardNumber, cvv){
    let url = "/stubpayment";

    const response = await fetch(baseURL + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                "fullName": fullName,
                "cardNumber": cardNumber,
                "cvv": cvv
            }),
    });

    if (! response.ok){
        throw response;
    }
    else{
        return;
    }
}

// GET /api/vehicles/occupied {category: , startDay: , endDay: }
// Gives the percentage of occupied vehicles and the number of free ones
// Of a certain category, in a certain interval of time
async function getOccupiedPercentage(category, startDay, endDay) {
    let url = "/vehicles/occupied" + `?category=${category}&startDay=${startDay}&endDay=${endDay}`;

    const response = await fetch(baseURL + url);
    const number = await response.json();
    if(response.ok){
        return {perc: number.perc, free: number.free};
    } else {
        let err = {status: response.status, errObj:number};
        return err;  // An object with the error coming from the server
    }
};

export default {getVehicles, getCookie, logout, login, getRentals, deleteRental, getPastRentalsNumber, stubPayment, getOccupiedPercentage};
