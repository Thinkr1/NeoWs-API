import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';
import "./styles.css"

function Asts() {
  const [asteroids, setAsteroids] = useState([]);

  useEffect(() => {
    axios.get(`https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${config.NASA_API_KEY}`)
     .then(response => {
        setAsteroids(response.data.near_earth_objects);
      })
     .catch(error => {
        console.error('Error fetching API:', error);
      });
  }, []);

  // Function to get the last recorded approach
  const getLastApproach = (approaches) => {
    const today = new Date();
    let lastApproach = approaches[0];
    let lastApproachDate = new Date(approaches[0].close_approach_date);

    for (let i = 1; i < approaches.length; i++) {
      const approachDate = new Date(approaches[i].close_approach_date);
      if (approachDate < today && approachDate > lastApproachDate) {
        lastApproach = approaches[i];
        lastApproachDate = approachDate;
      }
    }

    return lastApproach;
  };

  return (
    <div className='container'>
      <h1>NeoWs NASA API</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Estimated diameter (km)</th>
            {/* <th>Distance from Earth (km)</th> */}
            <th>Potentially Hazardous?</th>
            <th>First recorded approach</th>
            <th>First recorded approach relative velocity (km/h)</th>
            <th>Last recorded approach</th>
            <th>First recorded approach relative velocity (km/h)</th>
          </tr>
        </thead>
        <tbody>
          {asteroids.map(asteroid => (
            <tr key={asteroid.id}>
              <td>{asteroid.id}</td> {/*ID*/}
              <td><a href={asteroid.nasa_jpl_url} target="_blank" rel="noopener noreferrer">{asteroid.name}</a></td> {/*Name + link*/}
              <td>{(((asteroid.estimated_diameter.kilometers.estimated_diameter_min)+(asteroid.estimated_diameter.kilometers.estimated_diameter_max))/2).toFixed(3)}</td>  {/*Diameter*/}
              {/* <td>{Math.round(asteroid.close_approach_data[0].miss_distance.kilometers)}</td> */}  {/*Distance from Earth in first recorded approach*/}
              <td>{asteroid.is_potentially_hazardous_asteroid? "Yes" : "No"}</td>  {/*Hazardous?*/}
              <td>{asteroid.close_approach_data[0].close_approach_date} (orbiting {asteroid.close_approach_data[0].orbiting_body})</td> {/*First recorded approach*/}
              <td>{Math.round(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour)}</td> {/*First recorded approach relative velocity*/}
              <td>{getLastApproach(asteroid.close_approach_data).close_approach_date} (orbiting {getLastApproach(asteroid.close_approach_data).orbiting_body})</td> {/*Last recorded approach*/}
              <td>{Math.round(getLastApproach(asteroid.close_approach_data).relative_velocity.kilometers_per_hour)}</td> {/*Last recorded approach relative velocity*/}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Asts;