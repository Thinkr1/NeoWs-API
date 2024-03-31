import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "./config";
import "./styles.css";

function Asts() {
  const [asteroids, setAsteroids] = useState([]);

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
    <div className="container">
      <h1>Neows API</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Estimated diameter (km)</th>
            <th>Orbiting Body</th>
            {/* <th>Distance from Earth (km)</th> */}
            <th>Potentially Hazardous?</th>
            <th>First recorded approach</th>
            <th>Last recorded approach</th>
          </tr>
        </thead>
        <tbody>
          {asteroids.map((asteroid) => (
            <tr key={asteroid.id}>
              <td>{asteroid.name}</td> {/*Name*/}
              <td>
                {(
                  (asteroid.estimated_diameter.kilometers
                    .estimated_diameter_min +
                    asteroid.estimated_diameter.kilometers
                      .estimated_diameter_max) /
                  2
                ).toFixed(3)}
              </td>{" "}
              {/*Diameter*/}
              <td>{asteroid.close_approach_data[0].orbiting_body}</td>{" "}
              {/*Orbiting body*/}
              {/* <td>{Math.round(asteroid.close_approach_data[0].miss_distance.kilometers)}</td> */}{" "}
              {/*Distance from Earth in first recorded approach*/}
              <td>
                {asteroid.is_potentially_hazardous_asteroid ? "Yes" : "No"}
              </td>{" "}
              {/*Hazardous?*/}
              <td>
                {asteroid.close_approach_data[0].close_approach_date}
              </td>{" "}
              {/*First recorded approach*/}
              <td>
                {
                  getLastApproach(asteroid.close_approach_data)
                    .close_approach_date
                }
              </td>{" "}
              {/*Last recorded approach*/}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Asts;
