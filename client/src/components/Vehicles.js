import React from 'react';
import api from "./api.js"
import Button from "react-bootstrap/Button";
import {Switch, Route, Link, BrowserRouter as Router, Redirect} from 'react-router-dom' ;
import {Col, Row, Container} from "react-bootstrap";

class Vehicles extends React.Component {
    constructor() {
        super();
        this.state = {
            vehicles : [],
            categories : {
                "A": true,
                "B": true,
                "C": true,
                "D": true,
                "E": true
            },
            categoryActiveNumber: 5,
            brands : {},
            brandsActiveNumber: 0
        };
    }

    componentDidMount() {
        this.updateVehiclesList();
    }

    updateVehiclesList = () =>{
        api.getVehicles()
            .then((v)=>{
                let newCounter = 0;
                let tmpBrands = {};

                for(let vehicle of v){
                    tmpBrands[vehicle.brand] = true;
                    newCounter++;
                }

                this.setState({vehicles: v, brands: tmpBrands, brandsActiveNumber: newCounter})}
                )
            .catch((err)=>{this.props.handleErrors(err);});
    };

    toggleFilterCategories = (value) => {
        this.setState((state)=>{
            let tmp = {...state.categories};
            let newCounter = state.categoryActiveNumber;

            tmp[value]? newCounter++ : newCounter--;
            tmp[value] = !tmp[value];

            return {categories: tmp, categoryActiveNumber: newCounter};
        });
    };

    toggleFilterBrands = (value) => {
        this.setState((state)=>{
            let tmp = {...state.brands};
            let newCounter = state.brandsActiveNumber;

            tmp[value]? newCounter++ : newCounter--;
            tmp[value] = !tmp[value];

            return {brands: tmp, brandsActiveNumber: newCounter};
        });
    };

    allCategoriesActive = () =>{
        this.setState((state)=>{
            let tmp = {...state.categories};
            let num = 0;

            for (let e in tmp){
                tmp[e]=true;
                num++;
            }
            return {categories: tmp, categoryActiveNumber: num}
        });
    };

    allBrandsActive = () =>{
        this.setState((state)=>{
            let tmp = {...state.brands};
            let num = 0;

            for (let e in tmp){
                tmp[e]=true;
                num++;
            }
            return {brands: tmp, brandsActiveNumber: num}
        });
    };

    filteredVehicles(){
        let newList=[];
        for(let e of this.state.vehicles){
            if(this.state.categories[e.category] && this.state.brands[e.brand])
                newList.push(e);
        }

        return newList;
    }

    render() {
        return <>
            <h1>VEHICLES</h1>
            <Container >
                <Row>

                    <Col xs={12} sm={4}>
                        {/* Aside */}
                        <CategoriesList categories={this.state.categories} numActive={this.state.categoryActiveNumber}
                                        toggle={this.toggleFilterCategories} allFilters={this.allCategoriesActive}/>
                        <BrandsList brands={this.state.brands} numActive={this.state.brandsActiveNumber}
                                    toggle={this.toggleFilterBrands} allFilters={this.allBrandsActive}/>
                    </Col>

                    <Col xs={12} sm={8}>
                        {/* Content */}
                        <Container fluid={true}>
                            <VehiclesList categories={this.state.categories} brands={this.state.brands} vehicles={this.filteredVehicles()}/>
                        </Container>


                    </Col>

                </Row>
            </Container>
        </>;
    }
}

class CategoriesList extends React.Component {
    render() {
        let list = [];
        for (let e in this.props.categories)
            list.push(e);

        return <div>
            <Button onClick={()=>this.props.allFilters()} active>All categories</Button>
            {
                list.map((e)=>
                    <CategoryElement key={e} category={e} flag={this.props.categories[e]} toggle={this.props.toggle}/>)
            }
        </div>;
    }
}

class CategoryElement extends React.Component {
    render() {
        return <Button onClick={()=>this.props.toggle(this.props.category)} active={this.props.flag}>{this.props.category}</Button>
    }
}

class BrandsList extends React.Component {
    render() {
        let list = [];
        for (let e in this.props.brands)
            list.push(e);

        return <div>
            <Button onClick={()=>this.props.allFilters()} active>All brands</Button>
            {
                list.map((e)=>
                    <BrandElement key={e} brand={e} flag={this.props.brands[e]} toggle={this.props.toggle}/>)
            }
        </div>;
    }

}

class BrandElement extends React.Component {
    render() {
        return <Button onClick={()=>this.props.toggle(this.props.brand)} active={this.props.flag}>{this.props.brand}</Button>
    }
}

class VehiclesList extends React.Component {
    render() {

        if(this.props.vehicles.length === 0){
            return <div>No vehicles for this filter</div>;
        }

        return <div>
            {
                this.props.vehicles.map((e) =>
                    <VehicleElement key={e.id} category={e.category} brand={e.brand} model={e.model}/>

                )
            }
        </div>;
    }
}

class VehicleElement extends React.Component {
    render() {
        return <Row>
            <Col className="col-auto">
                {this.props.category}
            </Col>
            <Col className="col-auto">
                {this.props.brand}
            </Col>
            <Col className="col-auto">
                {this.props.model}
            </Col>
        </Row>;
    }

}

export default Vehicles;