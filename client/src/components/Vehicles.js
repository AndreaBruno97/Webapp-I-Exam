import React from 'react';
import api from "./api.js"
import Button from "react-bootstrap/Button";
import {Switch, Route, Link, BrowserRouter as Router, Redirect} from 'react-router-dom' ;

class Vehicles extends React.Component {
    constructor() {
        super();
        this.state = {
            vehicles : [],
            categories : [],
            brands : [],
            redirected : false
        };
    }

    getQuerySelectors(){
        let queryParams="";
        if(this.state.categories.length){
            let queryParamsCat = "?categories=";
            for (let cat of this.state.categories)
            queryParamsCat += cat + "|";

            queryParams += queryParamsCat.slice(0,-1);
        }

        if(this.state.brands.length){
            let queryParamsBr = "?brands=";
            for (let br of this.state.brands)
                queryParamsBr += br + "|";

            queryParams += queryParamsBr.slice(0,-1);
        }
        return queryParams;
    }

    addFilter = (newElem, filter) => {

    };

    removeFilter = (oldElem, filter) => {

    };

    componentDidMount() {
        let queryString = this.props.querySelectors;
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
        if(this.state.redirected){
            this.setState({redirected:false})
            return <Redirect to={"/?categories=A|E&brands=Fiat"}/>;
        }
        return <>
            <Button onClick={ ()=>{
                this.setState({redirected:true})
            }}/>
            <h1>VEHICLES</h1>
            </>;
    }
}

export default Vehicles;