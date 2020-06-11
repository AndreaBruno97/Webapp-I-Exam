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

                   <Route path={"/newrental"}>
                        <NewRental handleErrors = {this.props.handleErrors}/>
                   </Route>

                    <Route path={"/rentals"}>
                        <Rentals handleErrors = {this.props.handleErrors}/>
                    </Route>

                    <Route path={"*"} render={(props) => {
                        return <Vehicles handleErrors = {this.props.handleErrors} querySelectors = {props.location.search}/>;
                    }
                    }/>

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
