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
        };
    }

    getQuerySelectors(categories, brands){
        let queryParams="?";
        if(categories.length){
            let queryParamsCat = "categories=";
            for (let cat of categories)
            queryParamsCat += cat + "|";

            queryParams += queryParamsCat.slice(0,-1);
        }

        if(brands.length){
            if(categories.length)
                queryParams += "&";

            let queryParamsBr = "brands=";
            for (let br of brands)
                queryParamsBr += br + "|";

            queryParams += queryParamsBr.slice(0,-1);
        }
        return queryParams;
    }

    updateFilters = (elem, type, operation) => {
        //this.setState((state)=>{
            let tmp=[];

            if(type === "categories")
                tmp = [...this.state.categories];
            else
                tmp = [...this.state.brands];

            if(operation==="add"){
                if(tmp.indexOf(elem) === -1)
                    tmp.push(elem);
            }else{
                if(tmp.indexOf(elem))
                    tmp.splice(tmp.indexOf(elem), 1);
            }

           // return {type: tmp};
        //});
        return tmp;
    };

    updateFilterState = (list, filterType) =>{
        if(filterType === "categories")
            this.setState({"categories": list});
        else
            this.setState({"brands": list});

        this.updateVehiclesList();
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

        this.updateVehiclesList();
    }

    updateVehiclesList = () =>{
        api.getVehicles(this.getQuerySelectors([...this.state.categories], [...this.state.brands]))
            .then((v)=>{this.setState({vehicles: v})})
            .catch((err)=>{this.props.handleErrors(err);});
    };


    render() {
        let categoriestmpAdd = this.updateFilters("E", "categories", "add");
        let categoriestmpRemove = this.updateFilters("E", "categories", "remove");
        return <>


            <Link to={this.getQuerySelectors(categoriestmpAdd, [...this.state.brands])} onClick={()=>{this.updateFilterState(categoriestmpAdd, "categories")}}>Add E</Link>
            <Link to={this.getQuerySelectors(categoriestmpRemove, [...this.state.brands])} onClick={()=>{this.updateFilterState(categoriestmpRemove, "brands")}}>Remove E</Link>

            <h1>VEHICLES</h1>
            {this.state.vehicles.toString()}
            </>;
    }
}

export default Vehicles;