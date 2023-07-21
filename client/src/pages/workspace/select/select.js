import React, { useEffect } from "react";
import { isUser } from "../../../api/index";
import { Link } from "react-router-dom";
import "./select.css";

export default function Select() {
  useEffect(() => {
    if (!isUser()) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <div className="select-container">
      <h1>Select Workspace</h1>
      <br />
      <div className="pricing-wrapper">
        <div className="pricing-option">
          <h2>API Workspace</h2>
          <p>Work with APIs efficiently</p>
          <Link to="/workspaces/api">
            <button>Select</button>
          </Link>
        </div>
        <div className="pricing-option">
          <h2>SQL Workspace</h2>
          <p>Manage SQL databases effortlessly</p>
          <Link to="/workspaces/sql">
            <button>Select</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
