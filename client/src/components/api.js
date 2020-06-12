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


export default {getVehicles};
