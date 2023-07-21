import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./about.css";

export default function About() {
  const [redirect, setRedirect] = useState(false);

  if (redirect) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="about">
      <header className="header">
        <h1>Server and SQL Health Monitoring</h1>
        <nav>
          <button onClick={() => setRedirect(true)}>Login</button>
        </nav>
      </header>
      <section className="description">
        <h2>About Our Monitoring App</h2>
        <p>
          Our Server and SQL Health Monitoring App provides comprehensive
          monitoring solutions for your servers and SQL databases. With
          real-time monitoring capabilities and advanced analytics, you can
          ensure the optimal performance and health of your systems.
        </p>
        <p>
          Features include real-time server health monitoring, tracking vital
          metrics such as CPU usage, memory usage, and disk space utilization.
          It also monitors SQL database performance, including query response
          time, throughput, and connection status.
        </p>
        <p>
          Stay informed about critical events with alerts and notifications. Our
          app sends instant notifications when server or database issues arise,
          allowing you to take immediate action and prevent downtime.
        </p>
        <p>
          Visualize your data with interactive charts and graphs. Gain valuable
          insights into the performance trends of your servers and databases
          through our intuitive and user-friendly dashboard.
        </p>
      </section>
    </div>
  );
}
