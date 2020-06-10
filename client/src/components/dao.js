import Vehicle from "./vehicle.js"
const baseURL = "/api";

async function getVehicles(categories, brands) {
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
}