import React, { Component } from 'react';
import Select from 'react-select';
import AirportDetail from './AirportDetail';

const listOfAirports = [
    { value: '50r', label: '50r' },
    { value: 'egll', label: 'egll' },
    { value: 'kaus', label: 'kaus' },
    { value: 'khou', label: 'khou' }
]

export default class Airports extends Component {
    constructor(props){
        super(props);

        this.state = {
            airports: [],
        }
    }

    onChange = (e, option) => {
        if (option.removedValue && option.removedValue.isFixed) return;

        this.setState({
            airports: e
        })
    }

    render() {
        return (
            <div>
                <Select
                    name = "airports"
                    value={this.state.airports}
                    isMulti
                    onChange={this.onChange}
                    isClearable={this.state.airports.some(v => !v.isFixed)}
                    options={listOfAirports}
                    className="basic-multi-select"
                    classNamePrefix="select"
                />
                {this.state.airports.map((data, id) => {
                    return <div key={id}>
                        <AirportDetail 
                            value={data.value}
                        />
                    </div>
                })}
            </div>
        )
    }
}