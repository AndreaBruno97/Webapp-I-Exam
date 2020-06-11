import Vehicle from "./vehicle.js"
const baseURL = "/api";


// GET api/vehicles
// parameters: categories, list of elements separated by |
//             brands, list of elements separated by |
async function getVehicles(querySelectors) {
        let url = "/vehicles";

        const response = await fetch(baseURL + url);
        const vehicleJson = await response.json();
        if(response.ok){
            return vehicleJson.map((v) => new Vehicle(v.id, v.category, v.brand, v.model));
        } else {
            let err = {status: response.status, errObj:vehicleJson};
            throw err;  // An object with the error coming from the server
        }
};

export default {getVehicles};

/*
let url = "/vehicles";
    if(categories.length){
        let queryParamsCat = "?categories=";
        for (let cat of categories)
            queryParamsCat += cat + "|";

        url += queryParamsCat.slice(0,-1);
    }

    if(brands.length){
        let queryParamsBr = "?brands=";
        for (let br of brands)
            queryParamsBr += br + "|";

        url += queryParamsBr.slice(0,-1);
    }

    const response = await fetch(baseURL + url);
    const vehicleJson = await response.json();
    if(response.ok){
        return vehicleJson.map((v) => new Vehicle(v.id, v.category, v.brand, v.model));
    } else {
        let err = {status: response.status, errObj:vehicleJson};
        throw err;  // An object with the error coming from the server
    }
 */