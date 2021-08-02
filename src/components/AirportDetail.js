import React, {Component} from 'react';
import WeatherForecast from './WeatherForecast'
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

export default class AirportDetail extends Component {

    constructor(props){
        super(props);

        this.state = {
            airportData: {},
            runways: []
        }
    }

    async componentDidMount(){
        let details = await fetch('http://localhost:3000/airports/' + this.props.value + '.json')
            .then(response => response.json())
            .then(data => {
                return data
            })
        this.setState({airportData: details, runways: details.runways})
    }

    // render(){
    //     return (
    //         <div>
    //             <h2>Airport Identifier: {this.props.value}</h2>
    //             <h4>Name: {this.state.airportData.name}</h4>
    //             <h5>Runways: {this.state.runways.map((data,id) =>{
    //                 return <div key={id}>
    //                     {data.name}
    //                 </div>
    //             })}
    //             </h5>
    //             <p>Latitude: {this.state.airportData.latitude}</p>
    //             <p>Longitude: {this.state.airportData.longitude}</p>
    //             <WeatherForecast value={this.props.value} />
    //         </div>
    //     )
    // }
    render(){
        return (
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Airport: {this.state.airportData.name}
                    </Typography>
                    <Typography variant="h6" color="initial" component="h4">
                        Identifier: {this.props.value}
                    </Typography>
                    <Typography variant="body1" color="initial" component="div">
                        Runways: {this.state.runways.map((data, id) => {
                            return <span key={id} style={{margin: 3}}>
                                {data.name}
                            </span>
                        })}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        Latitude: {this.state.airportData.latitude}
                    </Typography>
                    <Typography gutterBottom variant="body2" color="textSecondary" component="p">
                        Longitude: {this.state.airportData.longitude}
                    </Typography>
                    <WeatherForecast value={this.props.value} />
                </CardContent>
            </Card>
        )
    }
}