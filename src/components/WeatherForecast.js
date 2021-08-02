import React, {Component} from 'react';
import Typography from "@material-ui/core/Typography";

export default class WeatherForecast extends Component {

    constructor(props){
        super(props);

        this.state = {
            weatherForecast: {},
            temperature: '',
            visibility: '',
            windSpeed: '',
            windDirection: '',
            cardinalDirection: '',
            cloudSummary: ''
        }
    }

    async componentDidMount(){
        let weather = await fetch('http://localhost:3000/weather/' + this.props.value + '.json')
            .then(response => response.json())
            .then(data => {
                return data.report
            })
        // If there is no weather.conditions i.e 50r.json
        // Create an empty object for weather conditions for No temperature data.
        if(!weather.conditions){
            weather.conditions = {}
        }
        // Going off assumption that a "current weather report" refers to the last item in the forecast conditions
        // as it is the latest entry and therefore most up to date.
        // If the assumption is wrong and needed to gather data from all forecast conditions, would need to loop through
        // and gather averages
        let weatherForecast = weather.forecast.conditions[weather.forecast.conditions.length - 1]
        let latestWindData = this.getLatestWindData(weather.forecast.conditions)
        let cardinalDir = this.calculateCardinalDirections(latestWindData.wind.direction)
        let cloudCoverage = this.greatestCloudCoverage(weatherForecast)
        this.setState({
            weatherForecast: weatherForecast, 
            temperature: weather.conditions.tempC,
            visibility: weatherForecast.visibility.distanceSm,
            windSpeed: weatherForecast.wind.speedKts,
            windDirection: latestWindData.wind.direction,
            cardinalDirection: cardinalDir,
            cloudSummary: cloudCoverage
        })
    }

    /**
     * Calculate the cardinal directions to secondary-intercardinal precision given a number
     * @param {number} direction
     * @return {string}
     */
    calculateCardinalDirections(direction){
        let directions = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NWW","N"]
        let mod = direction % 360
        let idx = Math.round(mod/22.5)
        return directions[idx]
    }

    /**
     * Using weather forecast data, find the greatest amount of coverage.
     * A list from greatest to smallest coverage is used to check if the abbreviation exists in data
     * @param {object} forecast 
     * @returns {string}
     */
    greatestCloudCoverage(forecast){
        let allCoverage = []
        let cloudCoverage = ["OVC","BKN","SCT","FEW","NSC","CLR","NCD","SKC"]
        for(const coverage of forecast.cloudLayers){
            allCoverage.push(coverage.coverage.toUpperCase())
        }
        for(const coverage of forecast.cloudLayersV2){
            allCoverage.push(coverage.coverage.toUpperCase())
        }
        for(const abb of cloudCoverage){
            if(allCoverage.includes(abb)){
                return abb
            }
        }
    }

    /**
     * Some weather forecasts may be missing information regarding wind direction
     * This will find the last forecast report that contains the information
     * @param {object} forecastConditions 
     * @returns {object}
     */
    getLatestWindData(forecastConditions){
        for(let i = forecastConditions.length - 1; i >= 0; i--){
            if(forecastConditions[i].wind.direction){
                return forecastConditions[i]
            }
        }
    }

    // render() {
    //     return (
    //         <div>
    //             <h3>Weather Forecast</h3>
    //             <p>Temperature: {this.state.temperature ? (this.state.temperature * (9/5) + 32).toFixed(2) + "F" : "Missing Temperature Data"}</p>
    //             <p>Relative Humidity: {this.state.weatherForecast.relativeHumidity}</p>
    //             <p>Cloud Coverage: {this.state.cloudSummary}</p>
    //             <p>Visibility: {this.state.visibility} Statute Miles</p>
    //             <p>Wind Speed: {this.state.windSpeed * 1.15} MPH</p>
    //             <p>Wind Direction: {this.state.windDirection}</p>
    //             <p>Cardinal Direction: {this.state.cardinalDirection}</p>
    //         </div>
    //     )
    // }
    render() {
        return(
            <div>
                <Typography gutterBottom variant="h6" component="h3">
                    Weather Forecast
                </Typography>
                <Typography variant="body2" component="p">
                    Temperature: {this.state.temperature ? (this.state.temperature *(9/5) + 32).toFixed(2) + "F" : "Missing Temperature Data"}
                </Typography>
                <Typography variant="body2" component="p">
                    Relative Humidity: {this.state.weatherForecast.relativeHumidity}
                </Typography>
                <Typography variant="body2" component="p">
                    Cloud Coverage: {this.state.cloudSummary}
                </Typography>
                <Typography variant="body2" component="p">
                    Visibility: {this.state.visibility} Statute Miles
                </Typography>
                <Typography variant="body2" component="p">
                    Wind Speed: {(this.state.windSpeed * 1.15).toFixed(2)} MPH
                </Typography>
                <Typography variant="body2" component="p">
                    Wind Direction: {this.state.windDirection}
                </Typography>
                <Typography variant="body2" component="p">
                    Cardinal Direction: {this.state.cardinalDirection}
                </Typography>
            </div>

        )
    }
}