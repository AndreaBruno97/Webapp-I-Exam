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

        return <div id="loginContainer">
            <h1>LOGIN</h1>

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
                           value={this.state.user}
                           onChange={(ev)=>this.updateField(ev.target.name, ev.target.value)}
                    /><br/>
                    <p id="LoginFormPasswordTitle">Password</p>
                    <>
                        <input type={this.state.passShown?"text":"password"} name="pass" required
                               value={this.state.pass}
                               onChange={(ev)=>this.updateField(ev.target.name, ev.target.value)}
                        />
                        <FontAwesomeIcon id="loginEye" size="lg" icon={this.state.passShown? faEye:faEyeSlash} onClick={()=>{this.setPassShown()}}/>
                    </>
                    <br/>
                    <Button id="buttonLoginFormSubmit" variant="primary" type="submit">Login</Button>
                    <Button id="buttonLoginFormReset" variant="secondary" type="reset">Reset</Button>
                    <br/>
                    {this.state.wrongLogin===true? <Alert variant="danger" id="wrongLogin">Wrong credentials</Alert> :""}
                </div>
            </form>
            <Link to="/"><Button id="buttonLoginReturn">Main page</Button></Link>
        </div>;
    }
}

export default Login