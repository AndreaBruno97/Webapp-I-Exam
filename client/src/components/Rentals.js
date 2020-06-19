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
        return <div id="rentalListPage">
            <h1>RENTALS</h1>
            <Container fluid={true}>
                <RentalsList rentals={this.state.rentals} removeRental={this.removeRental}/>
            </Container>
        </div>;
    }
}

class RentalsList extends React.Component {
    render() {

        if(this.props.rentals.length === 0){
            return <div>No rentals</div>;
        }

        return <div>
            <p>Future rentals</p>
            <Row className="TitleRow">
                <Col>
                    Start day
                </Col>
                <Col>
                    End day
                </Col>
                <Col xs={1}>
                    Category
                </Col>
                <Col xs={1}>
                    Age
                </Col>
                <Col xs={2}>
                    Number of drivers
                </Col>
                <Col xs={2}>
                    Estimated km per day
                </Col>
                <Col xs={1}>
                    Insurance
                </Col>
                <Col xs={1}>
                    Price
                </Col>
                <Col xs={1}></Col>
            </Row>
            {
                this.props.rentals.map((e) =>
                    e.isHistory === false? <RentalElement key={e.id} rental={e} removeRental={this.props.removeRental}/> : "")
            }

            <p>Past rentals</p>
            <Row className="TitleRow">
                <Col>
                    Start day
                </Col>
                <Col>
                    End day
                </Col>
                <Col xs={1}>
                    Category
                </Col>
                <Col xs={1}>
                    Age
                </Col>
                <Col xs={2}>
                    Number of drivers
                </Col>
                <Col xs={2}>
                    Estimated km per day
                </Col>
                <Col xs={1}>
                    Insurance
                </Col>
                <Col xs={1}>
                    Price
                </Col>
                <Col xs={1}></Col>
            </Row>
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
            <Col>
                {this.props.rental.startDay}
            </Col>
            <Col>
                {this.props.rental.endDay}
            </Col>
            <Col xs={1}>
                {this.props.rental.carCategory}
            </Col>
            <Col xs={1}>
                {this.props.rental.age}
            </Col>
            <Col xs={2}>
                {this.props.rental.driversNumber}
            </Col>
            <Col xs={2}>
                {this.props.rental.estimatedKm}
            </Col>
            <Col xs={1}>
                {this.props.rental.insurance? "Yes" : "No"}
            </Col>
            <Col xs={1}>
                {this.props.rental.price}
            </Col>
            <Col xs={1}>
            {this.props.rental.isHistory? "":
                    <Button size="sm" onClick={()=>{this.props.removeRental(this.props.rental.id)}}><FontAwesomeIcon icon={faTrashAlt}/></Button>
            }
            </Col>
        </Row>;
    }
}

class TemporaryElement extends React.Component{
    render() {
        return <Alert variant="secondary">This element is being deleted</Alert>
    }
}

export default Rentals;