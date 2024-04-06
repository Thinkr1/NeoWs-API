import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "./config.js";
import "./styles.css";

function Asts() {
  const [asteroids, setAsteroids] = useState([]);
  const [approachData, setApproachData] = useState([]);
  const [astID, setAstID] = useState(0);

  useEffect(() => {
    axios
      .get(
        `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${config.NASA_API_KEY}`
      )
      .then((response) => {
        setAsteroids(response.data.near_earth_objects);
      })
      .catch((error) => {
        console.error("Error fetching API:", error);
      });
  }, []);

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

  const getAstInfo = (id) => {
    setAstID(id);
    const ast = asteroids.find((asteroid) => asteroid.id === id);
    if (ast) {
      axios
        .get(
          `https://api.nasa.gov/neo/rest/v1/neo/${id}?api_key=${config.NASA_API_KEY}`
        )
        .then((response) => {
          setApproachData(response.data.close_approach_data);
        })
        .catch((error) => {
          console.error("Error fetching API: ", error);
        });
    } else {
      console.log("Asteroid not found");
    }
  };

  return (
    <div className="container">
      <h1>NeoWs NASA API</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Estimated diameter (km)</th>
            {/* <th>Distance from Earth (km)</th> */}
            <th>Potentially Hazardous?</th>
            <th>Orbital period (Earth Days)</th>
            <th>First Observation</th>
            <th>Last Observation</th>
            <th>First recorded approach</th>
            <th>First recorded approach relative velocity (km/h)</th>
            <th>Last recorded approach</th>
            <th>First recorded approach relative velocity (km/h)</th>
          </tr>
        </thead>
        <tbody>
          {asteroids.map((asteroid) => (
            <tr key={asteroid.id}>
              <td>
                <a
                  href={asteroid.nasa_jpl_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {asteroid.id}
                </a>
              </td>
              {/* ID */}
              <td>
                <a
                  href={asteroid.nasa_jpl_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {asteroid.name}
                </a>
              </td>
              {/* Name + link */}
              <td>
                {(
                  (asteroid.estimated_diameter.kilometers
                    .estimated_diameter_min +
                    asteroid.estimated_diameter.kilometers
                      .estimated_diameter_max) /
                  2
                ).toFixed(3)}
              </td>
              {/* Diameter */}
              <td>
                {asteroid.is_potentially_hazardous_asteroid ? "Yes" : "No"}
              </td>
              {/* Hazardous? */}
              <td>
                {Math.round(asteroid.orbital_data.orbital_period * 10) / 10}
              </td>
              {/* Orbital period */}
              <td>{asteroid.orbital_data.first_observation_date}</td>
              {/* First observation */}
              <td>{asteroid.orbital_data.last_observation_date}</td>
              {/* Last observation */}
              <td>
                {asteroid.close_approach_data[0].close_approach_date} (orbiting{" "}
                {asteroid.close_approach_data[0].orbiting_body})
              </td>
              {/* First recorded approach */}
              <td>
                {Math.round(
                  asteroid.close_approach_data[0].relative_velocity
                    .kilometers_per_hour
                )}
              </td>
              {/* First recorded approach relative velocity */}
              <td>
                {
                  getLastApproach(asteroid.close_approach_data)
                    .close_approach_date
                }{" "}
                (orbiting{" "}
                {getLastApproach(asteroid.close_approach_data).orbiting_body})
              </td>
              {/* Last recorded approach */}
              <td>
                {Math.round(
                  getLastApproach(asteroid.close_approach_data)
                    .relative_velocity.kilometers_per_hour
                )}
              </td>
              {/* Last recorded approach relative velocity */}
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <hr />
      <br />
      <h1>Search by ID</h1>
      <div className="centered-div">
        <input type="number" id="searchInp" placeholder="Asteroid ID" />
        <button
          onClick={() => getAstInfo(document.getElementById("searchInp").value)}
        >
          Get Info
        </button>
      </div>
      <br />
      <br />
      <h2>
        <a
          href={asteroids.filter((ast) => ast.id === astID)[0]?.nasa_jpl_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {asteroids.filter((ast) => ast.id === astID)[0]?.name}
        </a>
      </h2>
      <table className="search-table">
        <thead>
          <tr>
            <th>Approach #</th>
            <th>Date</th>
            <th>Relative Velocity (km/h)</th>
            <th>Distance to Earth (km)</th>
            <th>Orbiting body</th>
          </tr>
        </thead>
        <tbody>
          {approachData.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.close_approach_date}</td>
              <td>{Math.round(entry.relative_velocity.kilometers_per_hour)}</td>
              <td>{Math.round(entry.miss_distance.kilometers)}</td>
              <td>{entry.orbiting_body}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Asts;
