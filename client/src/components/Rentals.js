import React from 'react';

class Rentals extends React.Component {
    render() {
        if(this.props.idVal === -1){
            return <></>;
        }
        return <h1>RENTALS</h1>;
    }
}
export default Rentals;