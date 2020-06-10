import React from 'react';
import './App.css';
import Login from "./components/Login.js"
import Main from "./components/Main.js"
import {Switch, Route, Link, BrowserRouter as Router, Redirect} from 'react-router-dom' ;

class App extends React.Component {

  constructor(){
    super();
    this.state = {serverError : undefined};
  }

  handleErrors(err) {
    if (err) {
      if (err.status && err.status === 401) {
        // Signal login error
        this.setState({serverError : "You are not authenticated"});
      }
      else{
        // Signal generic server error
        this.setState({serverError : "Server error"});
      }
    }
  }

  render(){ return <div className="App">
    <Router>
      <Switch>

        <Route exact path={"/login"}>
          <Login/>
        </Route>

        <Route>
          <Main serverError = {this.state.serverError} handleErrors = {this.handleErrors} />
        </Route>

      </Switch>
    </Router>
    </div>;
  }
}

export default App;
