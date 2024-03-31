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

  return (
    <div className='container'>
      <h1>Neows API</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Distance from Earth (km)</th>
            <th>Orbiting Body</th>
          </tr>
        </thead>
        <tbody>
          {asteroids.map(asteroid => (
            <tr key={asteroid.id}>
              <td>{asteroid.name}</td>
              <td>{Math.round(asteroid.close_approach_data[0].miss_distance.kilometers)}</td>
              <td>{asteroid.close_approach_data[0].orbiting_body}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Asts;
