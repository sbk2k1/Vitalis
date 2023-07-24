import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { isUser } from "../../api/index";
import "./home.css";

export default function Landing() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (isUser()) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <div className="landing">
      <header className="header">
        <h1 style={{ marginLeft: 15 }}>Vitalis</h1>
        <nav>
          {!loggedIn && (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
          {loggedIn && (
            <div>
              <Link to="/workspaces/api" style={{ marginRight: 15 }}>
                <button>Workspaces</button>
              </Link>
            </div>
          )}
        </nav>
      </header>
      <section className="hero">
        <div className="hero-content">
          <h3>Welcome to Vitalis!</h3>
          <div className="hero-right">
          <p>Keep track of your API endpoints in real-time.</p>
          <Link to="/about">
            <button className="cta-button">Learn More</button>
          </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
