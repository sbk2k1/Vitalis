import React, { useState, useEffect } from "react";
import { Redirect, Link } from "react-router-dom";
import {
  onGetData,
  isUser,
  onPostData,
  onDeleteData,
  removeData,
} from "../../../api";
import "./sql.css";
const { useNotifications } = require("../../../context/NotificationContext");

export default function Sql() {
  const [logout, setLogout] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [page, setPage] = useState("select");
  const [name, setName] = useState("");
  const { createNotification } = useNotifications();

  useEffect(() => {
    if (!isUser()) {
      console.log("not logged in");
      setLogout(true);
    }
    getWorkspaces();
  }, []);

  const getWorkspaces = async () => {
    try {
      const res = await onGetData("sql/workspaces");
      if (res.status === 200) {
        if (res.data.length === 0) {
          createNotification("info", "You don't have any connections", "Info");
          setWorkspaces(null);
        } else {
          setWorkspaces(res.data);
          createNotification("success", "SQL Workspaces loaded", "Success");
        }
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        removeData();
      }
      if (err.response) {
        createNotification("error", err.response.data.error, "Error");
      }
    }
  };

  if (logout) {
    return <Redirect to="/login" />;
  }

  const handleName = async (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const data = await onPostData("sql/workspaces", {
        name: name,
      });

      if (data.error) {
        createNotification("error", data.error);
      } else {
        // reload
        window.location.reload();
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        removeData();
      }
      createNotification("error", "Server is not responding");
    }
  };

  const handleDeleteWorkspace = async (e) => {
    try {
      e.preventDefault();
      const workspaceName = e.target.id;
      const data = await onDeleteData("sql/workspaces/" + workspaceName);
      // remove workspace from workspaces
      setWorkspaces((workspaces) =>
        workspaces.filter((w) => w.name !== workspaceName),
      );
      createNotification("success", "Workspace deleted");
    } catch (err) {
      // if status 400
      if (err.response && err.response.status === 401) {
        removeData();
      } else if (err.response.status === 400) {
        createNotification("error", "Workspace has existing Connections!");
      } else {
        createNotification("error", "Server is not responding");
      }
    }
  };

  return (
    <div className="text-center">
      <h1>SQL Workspaces</h1>
      <br />
      <button
        onClick={() => setPage("create")}
        className={page === "create" ? "active-button" : ""}
      >
        Create a new workspace
      </button>
      <button
        onClick={() => setPage("select")}
        className={page === "select" ? "active-button" : ""}
      >
        Choose a workspace
      </button>
      <button
        onClick={() => setPage("delete")}
        className={page === "delete" ? "active-button" : ""}
      >
        Delete a workspace
      </button>

      {page === "select" && (
        <div className="choice">
          <br />
          <h3>Choose a workspace</h3>
          {!workspaces && (
            <>
              <br />
              <p>You don't have any workspaces</p>
            </>
          )}
          {workspaces &&
            workspaces.map((workspace) => (
              <Link to={`/dashboard/sql/${workspace.name}`}>
                <button id={workspace.name} key={workspace.name}>
                  {workspace.name}
                </button>
              </Link>
            ))}
        </div>
      )}

      {page === "create" && (
        <div className="text-center choice">
          <br />
          <h3>Create SQL Workspace</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter name"
              required
              onChange={handleName}
            />
            <button type="submit" className="form-button">
              Create Workspace
            </button>
          </form>
        </div>
      )}

      {page === "delete" && (
        <div className="text-center choice">
          <br />
          <h3>Delete API Workspace</h3>
          {/* buttons with all workspaces like in choose workspaces. onclick will delete using api */}

          {!workspaces && (
            <>
              <br />
              <p>You don't have any workspaces</p>
            </>
          )}

          {workspaces &&
            workspaces.map((workspace) => (
              <button
                id={workspace.name}
                key={workspace.name}
                onClick={handleDeleteWorkspace}
              >
                {workspace.name}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
