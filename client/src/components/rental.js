// Received from db: {id: , userId: , vehicleId: , startDay: , endDay: ,  carCategory: ,  age: ,  driversNumber: , estimatedKm: , insurance: ,  price: }
// Field "isHistory" says if the rental belongs to the past ones
import moment from 'moment';

class Rental{
    constructor(id, userId, vehicleId, startDay, endDay, carCategory, age, driversNumber, estimatedKm, insurance, price) {
        this.id = id;
        this.userId = userId;
        this.vehicleId = vehicleId;

        // From format YYYY MM D
        let tmpStart = moment(startDay);
        let tmpEnd = moment(endDay);

        // In history if it has already started (it can't be deleted)
        this.isHistory = moment().isAfter(tmpStart, 'day');

        this.startDay = tmpStart.format('D MMMM YYYY').toString();
        this.endDay = tmpEnd.format('D MMMM YYYY').toString();

        this.carCategory = carCategory;
        this.age = age;
        this.driversNumber = driversNumber;
        this.estimatedKm = estimatedKm + "km";
        // From integer (1 or 0) to boolean
        this.insurance = insurance === 1;
        // From integer (number of cents) in price
        this.price = (price/100).toFixed(2) + "€";
    }
}

export default Rental;