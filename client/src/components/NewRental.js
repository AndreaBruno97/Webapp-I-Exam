import React from 'react';
import moment from 'moment';
import {Link, Redirect} from "react-router-dom";
import api from "./api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

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

            wrongData: false
        };
    };

    updateField = (name, value) => {
        this.setState({[name]: value});
    };

    submitRental = () =>{
        this.setState((state)=>{
            let startMoment = moment(state.startDay);
            let endMoment = moment(state.endDay);
            if(startMoment.isBefore(moment(), "day") ||
                endMoment.isBefore(startMoment, "day") ||
                ["A", "B", "C", "D", "E"].includes(state.carCategory) === false ||
                Number.isInteger(state.age) === false || state.age < 0 ||
                Number.isInteger(state.driversNumber) === false || state.driversNumber < 0 ||
                Number.isInteger(state.estimatedKm) === false || state.estimatedKm < 0){
                // Invalid input
                return {wrongData: true};
            }
        });
    };

    render() {
        if(this.props.idVal === -1){
            return <></>;
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
                       onChange={(ev)=>this.updateField(ev.target.name, moment(ev.target.value).format("YYYY-MM-DD"))}
                />
                <br/>

                <label htmlFor="endDay">End day</label>
                <input type="date" name="endDay" min={this.state.startDay} required
                       onChange={(ev)=>this.updateField(ev.target.name, moment(ev.target.value).format("YYYY-MM-DD"))}
                />
                <br/>

                <label htmlFor="carCategory">Car category</label>
                <select name="carCategory" required
                       onChange={(ev) => this.updateField(ev.target.name, ev.target.value)}
                >
                    <option value="" hidden={true}></option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                </select>
                <br/>

                <label htmlFor="age">Driver's age</label>
                <input type="number" name="age" min="0" required
                       onChange={(ev) => this.updateField(ev.target.name, Number(ev.target.value))}
                />
                <br/>

                <label htmlFor="driversNumber">Number of extra drivers</label>
                <input type="number" name="driversNumber" min="0" required
                       onChange={(ev) => this.updateField(ev.target.name, Number(ev.target.value))}
                />
                <br/>

                <label htmlFor="estimatedKm">Number of estimated km per day</label>
                <input type="number" name="estimatedKm" min="0" required
                       onChange={(ev) => this.updateField(ev.target.name, Number(ev.target.value))}
                />
                <br/>

                <label htmlFor="insurance">Extra insurance</label>
                <input type="checkbox" name="insurance"
                       onChange={(ev) => this.updateField(ev.target.name, ev.target.checked)}
                />
                <br/>

                <Button variant="primary" type="submit">Submit</Button>
                <Button variant="secondary" type="reset">Reset</Button>
                {this.state.wrongData===true? <Alert variant="danger">Wrong values</Alert> :""}
            </form>
        </>;
    }
}

export default NewRental;