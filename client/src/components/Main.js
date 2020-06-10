import React from 'react';
import Vehicles from "./Vehicles.js"
import NewRental from "./NewRental.js"
import Rentals from "./Rentals.js"
import {Switch, Route, Link, BrowserRouter as Router, Redirect} from 'react-router-dom' ;
import Alert from "react-bootstrap/Alert";

class Main extends React.Component {
    render() {
        return <>
            <h1>MAIN</h1>
            <Router>
                <Switch>

                   <Route exact path={"/newrental"}>
                        <NewRental/>
                   </Route>

                    <Route exact path={"/rentals"}>
                        <Rentals/>
                    </Route>

                    <Route exact path={"/"}>
                        <Vehicles/>
                    </Route>

                </Switch>
            </Router>

            {this.props.serverError === undefined?
                <Alert variant="warning">{this.props.serverError}</Alert>
            :
            ""}
            
            </>;
    }
}
export default Main;
