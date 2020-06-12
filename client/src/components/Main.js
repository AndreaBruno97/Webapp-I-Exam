import React from 'react';
import Vehicles from "./Vehicles.js"
import NewRental from "./NewRental.js"
import Rentals from "./Rentals.js"
import {Switch, Route, Link, BrowserRouter as Router, Redirect} from 'react-router-dom' ;
import Alert from "react-bootstrap/Alert";
import {Navbar, Nav} from "react-bootstrap";

class Main extends React.Component {
    render() {
        return <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>Car rental</Navbar.Brand>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/newrental">New rental</Nav.Link>
                <Nav.Link href="/rentals">Rental list</Nav.Link>
            </Navbar>
            <Router>
                <Switch>

                   <Route path={"/newrental"}>
                        <NewRental handleErrors = {this.props.handleErrors}/>
                   </Route>

                    <Route path={"/rentals"}>
                        <Rentals handleErrors = {this.props.handleErrors}/>
                    </Route>

                    <Route path={"/"}>
                        <Vehicles handleErrors = {this.props.handleErrors}/>
                    </Route>
                    }/>

                </Switch>
            </Router>

            {this.props.serverError !== undefined?
                <Alert variant="warning">{this.props.serverError}</Alert>
            :
            ""}

            </>;
    }
}
export default Main;
