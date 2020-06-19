import React from 'react';
import moment from 'moment';
import api from "./api";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import {Redirect} from 'react-router-dom' ;

class NewRental extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            startDay: "",
            endDay: "",
            carCategory: "",
            age: "",
            driversNumber: "",
            estimatedKm: "",
            insurance: false,
            fullName: "",
            cardNumber: "",
            cvv: "",

            carsAvailable: undefined,
            price: undefined,
            percentageOccupied: undefined,
            isFrequent: false,

            wrongData: false,
            correctSubmit: false,
            noCarsFlag: false,
            redirected: false
        };
    };

    updateField = (name, value) => {
        let tmpState = {...this.state};
        let previous = this.state[name];
        this.setState({[name]: value});
        tmpState[name]=value;
        // True if the value is different
        let isDifferent = previous !== value;

        // Check if the number of available cars needs to be updated
        // I'm changing dates or category
        let parametersAreChanging = ["startDay", "endDay", "carCategory"].includes(name);
        if(parametersAreChanging && isDifferent){
            if(this.carErrors(tmpState) === false){
                // The input is valid
                api.getOccupiedPercentage(tmpState.carCategory, tmpState.startDay, tmpState.endDay)
                    .then((res)=>{
                            this.setState({percentageOccupied: res.perc, carsAvailable: res.free});
                            tmpState["percentageOccupied"] = res.perc;
                            tmpState["carsAvailable"] = res.free;
                            //return tmpState;
                            // Re-compute the price, if needed
                            if(this.inputErrors(tmpState) === false && tmpState.carsAvailable > 0){
                                // The input is valid
                                let newPrice = this.computePrice(tmpState);
                                this.setState({price: newPrice});
                                //tmpState["price"] = newPrice;
                                //return tmpState;
                            }else {
                                // The input is not valid
                                this.setState({price: undefined});
                                //tmpState["price"] = undefined;
                                //return tmpState;
                            }
                        }

                    )
                    .catch((err)=>{this.props.handleErrors(err)})
            }
        }

        // Check if the price needs to be updated
        if(isDifferent){
            if(this.inputErrors(tmpState) === false && tmpState.carsAvailable > 0){
                // The input is valid
                let newPrice = this.computePrice(tmpState);
                this.setState({price: newPrice});
                //tmpState["price"] = newPrice;
                //return tmpState;
            }else {
                // The input is not valid
                this.setState({price: undefined});
                //tmpState["price"] = undefined;
                //return tmpState;
            }
        }
    };

    computePrice = (state) =>{
        // Don't show price if there are no cars available
        if(state.carsAvailable === 0){
            this.setState({price: undefined});
            return
        }

        let tmpPrice = 0;
        switch (state.carCategory) {
            case "A": tmpPrice = 80; break;
            case "B": tmpPrice = 70; break;
            case "C": tmpPrice = 60; break;
            case "D": tmpPrice = 50; break;
            case "E": tmpPrice = 40; break;
            default:
                this.setState({price: undefined});
                return
        }

        if(state.estimatedKm < 50)
            tmpPrice *= 0.95;
        else if(state.estimatedKm > 150)
            tmpPrice *= 1.05;

        if(state.age < 25)
            tmpPrice *= 1.05;
        else if(state.age > 65)
            tmpPrice *= 1.1;

        if(state.driversNumber >= 1)
            tmpPrice *= 1.15;
        if (state.insurance === true)
            tmpPrice *= 1.2;
        if(state.percentageOccupied < 0.1)
            tmpPrice *= 1.1;
        if(state.isFrequent === true)
            tmpPrice *= 0.9;

        let startMoment = moment(state.startDay);
        let endMoment = moment(state.endDay);
        let numberOfDays = endMoment.diff(startMoment, 'days') + 1;
        tmpPrice *= numberOfDays;
        //this.setState({price: tmpPrice.toFixed(2)});
        return tmpPrice.toFixed(2);
    };

    submitRental = () =>{
        let tmp = {...this.state};

        if(tmp.carsAvailable === 0) {
            this.setState({noCarsFlag: true, wrongData: false, correctSubmit: false});
            return;
        }

        if(this.inputErrors(tmp) || this.creditCardErrors(tmp) || tmp.price === undefined){
            // Invalid input
            this.setState({wrongData: true, correctSubmit: false, noCarsFlag: false});
            return;
        }
        else{
            // Correct input
            api.stubPayment(tmp.fullName, tmp.cardNumber, tmp.cvv)
                .then(()=>{
                    // Payment accepted

                    api.newRental(tmp.carCategory, tmp.startDay, tmp.endDay, tmp.estimatedKm, tmp.age, tmp.driversNumber, tmp.insurance, tmp.price)
                        .then(()=>{
                            this.setState({correctSubmit: true, wrongData: false, noCarsFlag: false, redirected: true});
                            return;
                        })
                        .catch((err)=>{this.props.handleErrors(err)})

                    return;
                })
                .catch((err)=>{this.props.handleErrors(err)})
        }

    };

    inputErrors(state){
        if(state === undefined) state = this.state;
        let flag =  this.carErrors(state) ||
            Number.isInteger(state.age) === false || state.age < 0 ||
            Number.isInteger(state.driversNumber) === false || state.driversNumber < 0 ||
            Number.isInteger(state.estimatedKm) === false || state.estimatedKm < 0 ;
        return flag;
    }

    carErrors(state){
        if(state === undefined) state = this.state;
        let startMoment = moment(state.startDay);
        let endMoment = moment(state.endDay);

        let flag =  startMoment._isValid === false ||endMoment._isValid === false ||
            startMoment.isBefore(moment(), "day") ||
            endMoment.isBefore(startMoment, "day") ||
            ["A", "B", "C", "D", "E"].includes(state.carCategory) === false;
        return flag;
    }

    creditCardErrors(state){
        if(state === undefined) state = this.state;

        let flag =  state.fullName === undefined || state.fullName.length === 0 ||
            state.cardNumber === undefined || state.cardNumber.length === 0 ||
            state.cvv === undefined || state.cvv.length === 0;
        return flag;
    }

    componentDidMount() {
        api.getPastRentalsNumber()
            .then((res)=>{this.setState({isFrequent: res >3})})
            .catch((err)=>{this.props.handleError(err);});
    }

    resetState = () =>{
        this.setState({
            startDay: "",
            endDay: "",
            carCategory: "",
            age: "",
            driversNumber: "",
            estimatedKm: "",
            insurance: false,
            fullName: "",
            cardNumber: "",
            cvv: "",

            carsAvailable: undefined,
            price: undefined,
            percentageOccupied: undefined,
            isFrequent: false,

            wrongData: false,
            correctSubmit: false,
            noCarsFlag: false,
            redirected: false
        });
    };

    render(){
        if(this.props.idVal === -1){
            return <></>;
        }
        if(this.state.redirected === true){
            return <Redirect to="/rentals"/>;
        }
        return <>
            <h1>NEW RENTAL</h1>
            <form onSubmit={(e)=> {
                    e.preventDefault();
                    this.submitRental();
                }
            }>

                <label htmlFor="startDay">Start day</label>
                <input type="date" name="startDay" min={moment().format("YYYY-MM-DD")} required
                       value={this.state.startDay}
                       onChange={(ev)=>this.updateField(ev.target.name, moment(ev.target.value).format("YYYY-MM-DD"))}
                />
                <br/>

                <label htmlFor="endDay">End day</label>
                <input type="date" name="endDay" min={this.state.startDay} required
                       value={this.state.endDay}
                       onChange={(ev)=>this.updateField(ev.target.name, moment(ev.target.value).format("YYYY-MM-DD"))}
                />
                <br/>

                <label htmlFor="carCategory">Car category</label>
                <select name="carCategory" required
                        value={this.state.carCategory}
                       onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}
                >
                    <option value="" hidden={true}> </option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                </select>
                <br/>

                <label htmlFor="age">Driver's age</label>
                <input type="number" name="age" min="0" required
                       value={this.state.age}
                       onChange={(ev) => this.updateField(ev.target.name, Number(ev.target.value))}
                />
                <br/>

                <label htmlFor="driversNumber">Number of extra drivers</label>
                <input type="number" name="driversNumber" min="0" required
                       value={this.state.driversNumber}
                       onChange={(ev) => this.updateField(ev.target.name, Number(ev.target.value))}
                />
                <br/>

                <label htmlFor="estimatedKm">Number of estimated km per day</label>
                <input type="number" name="estimatedKm" min="0" required
                       value={this.state.estimatedKm}
                       onChange={(ev) => this.updateField(ev.target.name, Number(ev.target.value))}
                />
                <br/>

                <label htmlFor="insurance">Extra insurance</label>
                <input type="checkbox" name="insurance"
                       checked ={this.state.insurance}
                       onChange={(ev) => this.updateField(ev.target.name, ev.target.checked)}
                />
                <br/>

                <Alert variant="secondary">Cars available: {this.state.carsAvailable === undefined? "":`${this.state.carsAvailable}`}</Alert>
                <Alert variant="secondary">Price: {this.state.price === undefined? "": `${this.state.price}`}</Alert>

                <label htmlFor="fullName">Full name</label>
                <input type="text" name="fullName" required
                       value={this.state.fullName}
                       onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}
                />
                <br/>

                <label htmlFor="cardNumber">Card number</label>
                <input type="text" name="cardNumber" required
                       value={this.state.cardNumber}
                       onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}
                />
                <br/>

                <label htmlFor="cvv">CVV number</label>
                <input type="text" name="cvv" required
                       value={this.state.cvv}
                       onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}
                />
                <br/>

                <Button variant="primary" type="submit">Submit</Button>
                <Button variant="secondary" type="reset" onClick={()=>{this.resetState()}}>Reset</Button>
                {this.state.wrongData===true? <Alert variant="danger">Wrong values</Alert> :""}
                {this.state.correctSubmit===true? <Alert variant="primary">Submit successfully</Alert> :""}
                {this.state.noCarsFlag===true? <Alert variant="danger">No cars available</Alert> :""}
            </form>
        </>;
    }
}

export default NewRental;