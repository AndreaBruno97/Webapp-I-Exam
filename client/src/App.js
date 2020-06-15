import React from 'react';
import Login from "./components/Login.js"
import Main from "./components/Main.js"
import {Switch, Route, BrowserRouter as Router} from 'react-router-dom' ;

class App extends React.Component {

  constructor(){
    super();
    this.state = {serverError : undefined};
  }

  handleErrors = (err) => {
    if (err) {
      if (err.status && err.status === 401) {
        // Signal login error
        if(this.state.serverError !== `You are not authenticated`)
          this.setState({serverError : `You are not authenticated`});
      }
      else{
        // Signal generic server error
        if(this.state.serverError !== `Server error`)
          this.setState({serverError : `Server error`});
      }
    }
  };

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
