import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isUser } from "../../api/index";
import "./home.css";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (isUser()) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <div className="home">
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
            <Link to="/about">
              <button>About</button>
            </Link>
          </div>
          )}
        </nav>
      </header>
      <section className="banner">
        <h3>Welcome to our Monitoring Website!</h3>
        <p>Keep track of your servers and SQL databases in real-time.</p>
      </section>
      <section className="features">
        <h3>Features</h3>
        <ul>
          <li>Real-time server health monitoring</li>
          <li>SQL database performance metrics</li>
          <li>Alerts and notifications</li>
          <li>Data visualization and analytics</li>
        </ul>
      </section>
    </div>
  );
}
