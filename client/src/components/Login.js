import React from 'react';
import {Link, Redirect} from "react-router-dom";
import Button from "react-bootstrap/Button";
import api from './api.js';
import Alert from "react-bootstrap/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

class Login extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            user: "",
            pass: "",
            passShown: false,
            redirected: false,
            wrongLogin: false
        };
    };

    updateField = (name, value) => {
        this.setState({[name]: value});
    };

    setPassShown = () => {
        this.setState((state)=> {
            return {passShown: !state.passShown};
        });
    };

    render() {
        if (this.state.redirected === true)
            return <Redirect to="/" />;

        return <>
            <h1>LOGIN</h1>
            <Link to="/">Main page</Link>

            <form id="loginForm" onSubmit={(e)=> {
                    e.preventDefault();
                    this.setState({wrongLogin:false});
                    api.login(this.state.user, this.state.pass)
                        .then(()=>{
                            this.setState({redirected: true});
                        })
                        .catch(()=>{this.setState({wrongLogin:true});});
                }
            }>

                <div>
                    <p>Username</p>
                    <input type="text" name="user" required
                           onChange={(ev)=>this.updateField(ev.target.name, ev.target.value)}
                    /><br/>
                    <p>Password</p>
                    <input type={this.state.passShown?"text":"password"} name="pass" required
                           onChange={(ev)=>this.updateField(ev.target.name, ev.target.value)}
                    />
                    <FontAwesomeIcon size="lg" icon={this.state.passShown? faEye:faEyeSlash} onClick={()=>{this.setPassShown()}}/>
                    <br/>
                    <Button variant="primary" type="submit">Login</Button>
                    <Button variant="secondary" type="reset">Reset</Button>
                    <br/>
                    {this.state.wrongLogin===true? <Alert variant="danger" id="wrongLogin">Wrong credentials</Alert> :""}
                </div>
            </form>
            </>;
    }
}

export default Login