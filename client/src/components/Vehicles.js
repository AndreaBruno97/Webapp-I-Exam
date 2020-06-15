import React from 'react';
import api from "./api.js"
import Button from "react-bootstrap/Button";
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
            allCategoriesActive: true,
            brands : {},
            brandsActiveNumber: 0,
            allBrandsActive: true
        };
    }

    componentDidMount() {
        this.updateVehiclesList();
    }

    updateVehiclesList = () =>{
        api.getVehicles()
            .then((v)=>{
                let tmpBrands = {};

                for(let vehicle of v){
                    tmpBrands[vehicle.brand] = true;
                }

                this.setState({vehicles: v, brands: tmpBrands, brandsActiveNumber: Object.keys(tmpBrands).length})}
                )
            .catch((err)=>{this.props.handleErrors(err);});
    };

    toggleFilter = (value, flag) => {
        this.setState((state)=>{
            let tmp = flag === "category"?{...state.categories} : {...state.brands};
            let oldCounter = flag === "category"?state.categoryActiveNumber:state.brandsActiveNumber;
            let newCounter = oldCounter;
            let newAllActive;
            tmp[value]? newCounter-- : newCounter++;

            if(newCounter < Object.keys(tmp).length) {
                // Not all filters are active
                if (oldCounter === Object.keys(tmp).length) {
                    //Previously they were all active
                    for (let e in tmp)
                            tmp[e] = false;
                    tmp[value] = true;
                    newCounter = 1;
                }
                else
                    tmp[value] = !tmp[value];
                newAllActive = false;
            }
            else{
                // All filters are active
                for (let e in tmp){tmp[e]=true;}
                newCounter = Object.keys(tmp).length;
                newAllActive = true;
            }

            return flag === "category"?
                {categories: tmp, categoryActiveNumber: newCounter, allCategoriesActive: newAllActive}:
                {brands: tmp, brandsActiveNumber: newCounter, allBrandsActive: newAllActive};
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
            return {categories: tmp, categoryActiveNumber: num, allCategoriesActive: true}
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
            return {brands: tmp, brandsActiveNumber: num, allBrandsActive: true}
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
                                        allCategoriesActive={this.state.allCategoriesActive}
                                        toggle={this.toggleFilter} allFilters={this.allCategoriesActive}/>
                        <BrandsList brands={this.state.brands} numActive={this.state.brandsActiveNumber}
                                    allBrandsActive={this.state.allBrandsActive}
                                    toggle={this.toggleFilter} allFilters={this.allBrandsActive}/>
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
            <Button onClick={()=>this.props.allFilters()} active={this.props.allCategoriesActive}>All categories</Button>
            {
                list.map((e)=>
                    <CategoryElement key={e} category={e} flag={this.props.categories[e]} toggle={this.props.toggle} allActive={this.props.allCategoriesActive}/>)
            }
        </div>;
    }
}

class CategoryElement extends React.Component {
    render() {
        let activeFlag = this.props.allActive? false : this.props.flag;
        return <Button onClick={()=>this.props.toggle(this.props.category, "category")} active={activeFlag}>{this.props.category}</Button>
    }
}

class BrandsList extends React.Component {
    render() {
        let list = [];
        for (let e in this.props.brands)
            list.push(e);

        return <div>
            <Button onClick={()=>this.props.allFilters()}  active={this.props.allBrandsActive}>All brands</Button>
            {
                list.map((e)=>
                    <BrandElement key={e} brand={e} flag={this.props.brands[e]} toggle={this.props.toggle} allActive={this.props.allBrandsActive}/>)
            }
        </div>;
    }

}

class BrandElement extends React.Component {
    render() {
        let activeFlag = this.props.allActive? false : this.props.flag;
        return <Button onClick={()=>this.props.toggle(this.props.brand, "brand")} active={activeFlag}>{this.props.brand}</Button>
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