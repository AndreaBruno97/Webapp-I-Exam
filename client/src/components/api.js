import Vehicle from "./vehicle.js"
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
        console.log(response)
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


export default {getVehicles, getCookie, logout, login};
