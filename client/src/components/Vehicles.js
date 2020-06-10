import React from 'react';
import api from "./api.js"
import {Switch, Route, Link, BrowserRouter as Router, Redirect} from 'react-router-dom' ;

class Vehicles extends React.Component {
    constructor() {
        super();
        this.state = {
            vehicles : [],
            categories : [],
            brands : [],

        };
    }

    componentDidMount() {
        let queryString = this.props.location.search;
        let newCategories = [];
        let newBrands = [];
        // Parsing the query selectors

        //Check if there are categories
        if (queryString.search("categories=") !== -1)
            newCategories = queryString.split("categories=")[1].split("brands=")[0].replace("&", "").split("|");

        //Check if there are categories
        if (queryString.search("brands=") !== -1)
            newBrands = queryString.split("brands=")[1].split("categories=")[0].replace("&", "").split("|");

        this.setState({categories:newCategories, brands:newBrands});
    }


    render() {
        return <>
            <h1>VEHICLES</h1>
            </>;
    }
}
export default Vehicles;