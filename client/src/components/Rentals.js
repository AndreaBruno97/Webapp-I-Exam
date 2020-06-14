import React from 'react';
import api from "./api";
import {Alert, Col, Container, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";

class Rentals extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rentals: []
        }
    }

    componentDidMount() {
        this.updateRentalsList();
    }

    updateRentalsList = () =>{
        api.getRentals()
            .then((r)=>{
                this.setState({rentals: r})}
            )
            .catch((err)=>{this.props.handleErrors(err);});
    };

    removeRental = (id) =>{
        // Updates the state of the row into an intermediate one
        this.setState((state)=>{
            let tmp = [...state.rentals];
            let target = tmp.filter((e)=>{return e.id ===id;})[0];
            target.isDeleting = true;
            return {rentals: tmp};
        });

        // Removes the rental
        api.deleteRental(id)
            .then(()=>{this.updateRentalsList();})
            .catch((err)=>{
                this.props.handleErrors(err);
                this.updateRentalsList();});
    };

    render() {
        if(this.props.idVal === -1){
            return <></>;
        }
        return <>
            <h1>RENTALS</h1>
            <Container fluid={true}>
                <RentalsList rentals={this.state.rentals} removeRental={this.removeRental}/>
            </Container>
        </>;
    }
}

class RentalsList extends React.Component {
    render() {

        if(this.props.rentals.length === 0){
            return <div>No rentals</div>;
        }

        return <div>
            <>Future rentals</>
            {
                this.props.rentals.map((e) =>
                    e.isHistory === false? <RentalElement key={e.id} rental={e} removeRental={this.props.removeRental}/> : "")
            }

            <>Past rentals</>
            {
                this.props.rentals.map((e) =>
                    e.isHistory === true? <RentalElement key={e.id} rental={e} removeRental={this.props.removeRental}/> : "")
            }
        </div>;
    }
}

// {id: , userId: , vehicleId: ,  isHistory: (not shown)
// startDay: , endDay: ,  carCategory: ,  age: ,  driversNumber: , estimatedKm: , insurance: ,  price: }

class RentalElement extends React.Component {
    render() {
        if(this.props.rental.isDeleting === true){
            return <Row>
                <Col className="col-auto">
                    <TemporaryElement/>
                </Col>
            </Row>
        }
        return <Row>
            <Col className="col-auto">
                {this.props.rental.startDay}
            </Col>
            <Col className="col-auto">
                {this.props.rental.endDay}
            </Col>
            <Col className="col-auto">
                {this.props.rental.carCategory}
            </Col>
            <Col className="col-auto">
                {this.props.rental.age}
            </Col>
            <Col className="col-auto">
                {this.props.rental.driversNumber}
            </Col>
            <Col className="col-auto">
                {this.props.rental.estimatedKm}
            </Col>
            <Col className="col-auto">
                {this.props.rental.insurance? "Yes" : "No"}
            </Col>
            <Col className="col-auto">
                {this.props.rental.price}
            </Col>
            {this.props.rental.isHistory? "":
                <Col className="col-auto">
                    <Button onClick={()=>{this.props.removeRental(this.props.rental.id)}}><FontAwesomeIcon icon={faTrashAlt}/></Button>
                </Col>
            }
        </Row>;
    }
}

class TemporaryElement extends React.Component{
    render() {
        return <Alert variant="secondary">This element is being deleted</Alert>
    }
}

export default Rentals;