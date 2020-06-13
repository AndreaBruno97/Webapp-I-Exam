import React from 'react';
import api from "./api";
import {Col, Container, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";

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

    render() {
        if(this.props.idVal === -1){
            return <></>;
        }
        return <>
            <h1>RENTALS</h1>
            <Container fluid={true}>
                <RentalsList rentals={this.state.rentals}/>
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
                    e.isHistory === false? <RentalElement key={e.id} rental={e}/> : "")
            }

            <>Past rentals</>
            {
                this.props.rentals.map((e) =>
                    e.isHistory === true? <RentalElement key={e.id} rental={e}/> : "")
            }
        </div>;
    }
}

// {id: , userId: , vehicleId: ,  isHistory: (not shown)
// startDay: , endDay: ,  carCategory: ,  age: ,  driversNumber: , estimatedKm: , insurance: ,  price: }

class RentalElement extends React.Component {
    render() {
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
        </Row>;
    }
}
export default Rentals;