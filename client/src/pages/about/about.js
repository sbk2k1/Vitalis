import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isUser } from "../../api/index";
import "./about.css";

export default function About() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (isUser()) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <div className="about">
      <header className="header">
        <h1>Server and SQL Health Monitoring</h1>
        <nav>
          {!loggedIn && (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
          {loggedIn && (
            <div style={{height: 10, display: "flex", justifyContent: "center", alignItems: "center"}}>
              <Link to="/workspaces/api" style={{marginRight: 15}}>
                <button>Workspaces</button>
              </Link>
              <Link to="/">
                <button>Home</button>
              </Link>
            </div>
          )}
        </nav>
      </header>
      <section className="description">
        <h3>About Our Monitoring App</h3>
        <ul></ul>
        <li>
          Vitalis is a API monitoring application that allows you to keep track
          of your servers in real-time.
        </li>
        <br />
        <li>
          Features include real-time server health monitoring, like response times and health status.
        </li>
        <br />
        <li>
          Stay informed about critical events with alerts and notifications. Our
          app sends instant notifications when server or database issues arise,
          allowing you to take immediate action and prevent downtime.
        </li>
        <br />
        <li>
          Visualize your data with interactive charts and graphs. Gain valuable
          insights into the performance trends of your servers and databases
          through our intuitive and user-friendly dashboard.
        </li>
        <br />
        <li>
          Tech Stacks: MERN Stack, Redis, react-chartjs-2
        </li>
      </section>
    </div>
  );
}
