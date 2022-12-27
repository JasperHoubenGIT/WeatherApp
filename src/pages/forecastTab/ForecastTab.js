import React, {useState, useEffect} from 'react';
import axios from "axios";
import './ForecastTab.css';

const apiKey = '189546fa68507a94e2e46ff5e2d3354d'

function createDateString (timestamp){
    const day = new Date(timestamp * 1000);
    return day.toLocaleDateString('nl-NL', {weekday: 'long'});
}

function ForecastTab({ coordinates }) {
    const [forecasts, setForecasts] = useState([]);
    const [error, toggleError] = useState(false);
    const [loading, toggleLoading] = useState(false);

    useEffect(() => {
        async function fetchForecasts() {
            toggleLoading(true);

            try {
                toggleError(false)
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&lang=nl`);
                console.log(response.data);

                const fiveDayForecast = response.data.list.filter((singleForecast) => {
                    return singleForecast.dt_txt.includes("12:00:00")
                });
                setForecasts(fiveDayForecast)
            } catch (e) {
                console.error(e);
                toggleError(true)
            }
            toggleLoading(false)
        }

        if (coordinates) {
            fetchForecasts();
        }
    }, [coordinates])


    return (
        <div className="tab-wrapper">
            {   loading &&
                <span> loading...</span>
            }
            {forecasts.map((singleForecast) => {
                return <article className="forecast-day" key={singleForecast.dt}>
                    <p className="day-description">
                        {createDateString(singleForecast.dt)}
                    </p>

                    <section className="forecast-weather">
            <span>
              {singleForecast.main.temp}&deg; C
            </span>
                        <span className="weather-description">
              {singleForecast.weather[0].description}
            </span>
                    </section>
                </article>
            })}
            {
                forecasts.length === 0 && !error &&
                    <span className="no-forecast">
                        zoek eerst een locatie om het weer voor deze week te bekijken.
                    </span>
            }


        </div>
    );
}
export default ForecastTab;
