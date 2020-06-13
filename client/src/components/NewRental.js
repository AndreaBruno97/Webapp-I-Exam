import React from 'react';

class NewRental extends React.Component {
    render() {
        if(this.props.idVal === -1){
            return <></>;
        }
        return <h1>NEW RENTAL</h1>;
    }
}
export default NewRental;