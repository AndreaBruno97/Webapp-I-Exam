import React from 'react';
import Vehicles from "./Vehicles.js"
import NewRental from "./NewRental.js"
import Rentals from "./Rentals.js"
import api from './api.js';
import {Switch, Route, BrowserRouter as Router, Redirect} from 'react-router-dom' ;
import {Alert, Button} from "react-bootstrap";
import {Navbar, Nav} from "react-bootstrap";

class Main extends React.Component {

    constructor() {
        super();
        this.state={
            id : -1,
            name : "",
            redirectedByLogout: false
        };
    }

    componentDidMount() {
        api.getCookie().then((cookie)=>{
                if(cookie === undefined)
                    this.setUser("",-1);
                else
                    this.setUser(cookie.username, cookie.id);
            })
            .catch((err)=>this.props.handleErrors(err));
    }

    setUser = (name, id) => {
        this.setState({name: name, id: id});
    };

    render() {
        if (this.state.redirectedByLogout === true)
            return <Redirect to={"/login"}/>;

        return <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand >Car rental</Navbar.Brand>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/">Vehicle list</Nav.Link>
                <Nav.Link href={this.state.id === -1 ? "/login" : "/newrental"}>New rental</Nav.Link>
                <Nav.Link href={this.state.id === -1 ? "/login" : "/rentals"}>Rental list</Nav.Link>
                <Button onClick={()=>{
                    if(this.state.id === -1)
                        this.props.handleErrors({status: 401});
                    else
                        api.logout()
                            .then(this.setState({redirectedByLogout: true}))
                            .catch((err)=>{this.props.handleErrors(err);});
                }}>LOGOUT</Button>

                <Button>{this.state.name||"Unauthenticated"}</Button>
            </Navbar>

            <Router>
                <Switch>

                    <Route path={"/newrental"}>
                        <NewRental handleErrors={this.props.handleErrors} idVal={this.state.id} name={this.state.name}/>
                    </Route>

                    <Route path={"/rentals"}>
                        <Rentals handleErrors={this.props.handleErrors} idVal={this.state.id} name={this.state.name}/>
                    </Route>

                    <Route exact path={"/"}>
                        <Vehicles handleErrors = {this.props.handleErrors} idVal={this.state.id} name={this.state.name}/>
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
