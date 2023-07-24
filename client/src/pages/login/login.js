import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { onPostData, setData } from "../../api";
import "./login.css";

// notification
import { useNotifications } from "../..../../../context/NotificationContext";

export default function Login() {
  // state variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  // notification
  const { createNotification } = useNotifications();

  // handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const data = { username, password };
    try {
      const res = await onPostData("user/login", data);
      if (res.status == 200) {
        setData(res.data);
        setRedirect(true);
      }
    } catch (err) {
      createNotification("error", "No such Registered User", "Error");
    }
  };

  // redirect to home if logged in
  if (redirect) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login-container">
      <h1>Login</h1>
      <br />
      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <br />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
      <br />
      <Link to="/register">Register</Link>
    </div>
  );
}
