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
            <Navbar id="myNavbar" bg="dark" variant="dark">
                <Navbar.Brand>Car rental</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/">Vehicle list</Nav.Link>
                    <Nav.Link href={this.state.id === -1 ? "/login" : "/newrental"}>New rental</Nav.Link>
                    <Nav.Link href={this.state.id === -1 ? "/login" : "/rentals"}>Rental list</Nav.Link>
                </Nav>
                <div id="navbarLogin">
                    <div id="navbarUserName">{this.state.name?("Welcome, " + this.state.name):""}</div>
                    <Nav.Link href="/login"><Button>Login</Button></Nav.Link>
                    <Button onClick={()=>{
                        if(this.state.id === -1)
                            this.props.handleErrors({status: 401});
                        else
                            api.logout()
                                .then(this.setState({redirectedByLogout: true}))
                                .catch((err)=>{this.props.handleErrors(err);});
                    }}>Logout</Button>
                </div>

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
                <Alert id="alertMessageError" variant="warning">{this.props.serverError}</Alert>
            :
            ""}

            </>;
    }
}
export default Main;
