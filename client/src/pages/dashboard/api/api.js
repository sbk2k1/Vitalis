import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
import {
  onGetData,
  isUser,
  onPostData,
  onDeleteData,
  removeData,
} from "../../../api";
import { useNotifications } from "../../../context/NotificationContext";
import "./api.css";
import { Line } from "react-chartjs-2";
import { Dna } from "react-loader-spinner";

export default function Api(props) {
  const [logout, setLogout] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [connections, setConnections] = useState([]);
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("");
  const [threshold, setThreshold] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [numOfTimes, setNumOfTimes] = useState(null);

  // loader
  const [loading, setLoading] = useState(true);

  // useref hook for current active connection
  const active = useRef(null);

  const { createNotification } = useNotifications();

  useEffect(() => {
    if (!isUser()) {
      createNotification("error", "Please Login First", "Error");
      setLogout(true);
    }
    getConnections();

    const interval = setInterval(() => {
      getConnections();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getConnections = async () => {
    try {
      const res = await onGetData("api/connections/" + props.match.params.name);

      // here active state is reset to null on each interval because of the way useEffect works
      // to prevent this, we can use a useRef hook

      if (res.status === 200) {
        if (res.data.length === 0) {
          setConnections(null);
        } else {
          setConnections(res.data);
        }
        if (active.current === null) {
          active.current = res.data[0];
        } else {
          // if active connection is not null, check if it is in the new connections array
          // if it is, set active to that connection
          // else set active to the first connection in the array
          if (
            res.data.some((connection) => connection.url === active.current.url)
          ) {
            active.current = res.data.find(
              (connection) => connection.url === active.current.url,
            );
          } else {
            active.current = res.data[0];
          }
        }
        setLoading(false);
      } else if (res.status === 400) {
        createNotification("Connection Already exists");
        // refresh page
        window.location.reload();
      } else {
        createNotification("error", res.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        removeData();
      } else if (
        err.response &&
        err.response.data.message ===
          "Cannot read properties of null (reading '_id')"
      ) {
        createNotification("error", "No Such Workspace Found", "Error");
        setRedirect("/workspaces/api");
      } else if (err.request) {
        createNotification("error", "Server is not responding", "Error");
      }
    }
  };

  if (logout) {
    return <Redirect to="/login" />;
  }

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  const handleUrl = (e) => {
    e.preventDefault();
    setUrl(e.target.value);
  };

  const handleMethod = (e) => {
    e.preventDefault();
    setMethod(e.target.value);
  };

  const handleThreshold = (e) => {
    e.preventDefault();
    setThreshold(e.target.value);
  };

  const handleNumOfTimes = (e) => {
    e.preventDefault();
    setNumOfTimes(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await onPostData(
        "api/connections/" + props.match.params.name,
        {
          url: url,
          requestType: method,
          threshold: threshold,
          numOfTimes: numOfTimes,
        },
      );

      if (res.status === 201) {
        window.location.reload();
      } else {
        createNotification("error", res.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        removeData();
      }
      createNotification("error", err.response.data.message);
    }
  };

  const handleConnection = (event, connection) => {
    active.current = connection;
    // search for button with both active-button and connection-button classes
    // remove active-button class from that button
    if (document.getElementsByClassName("active-button connection-button")[0]) {
      document
        .getElementsByClassName("active-button connection-button")[0]
        .classList.remove("active-button");
    }

    // add active-button class to clicked button
    event.target.classList.add("active-button");
  };

  const handleDelete = (url, requestType) => async (e) => {
    e.preventDefault();
    try {
      const res = await onDeleteData(
        "api/connections/" +
          props.match.params.name +
          "?url=" +
          url +
          "&method=" +
          requestType,
      );

      if (res.status === 200) {
        // rempve deleted connection from connections array
        setConnections((connections) =>
          connections.filter((connection) => connection.url !== url),
        );
      } else {
        createNotification("error", res.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        removeData();
      }
      createNotification("error", err.response.data.message);
    }
  };

  return (
    <div className="text-center">
      <h1>API Connections</h1>

      <button
        onClick={() => {
          setPage("dashboard");
        }}
        className={page === "dashboard" ? "active-button" : ""}
      >
        Dashboard
      </button>
      <button
        onClick={() => {
          setPage("create");
        }}
        className={page === "create" ? "active-button" : ""}
      >
        Create Connection
      </button>
      <button
        onClick={() => {
          setPage("delete");
        }}
        className={page === "delete" ? "active-button" : ""}
      >
        Delete Connection
      </button>

      {page === "dashboard" && (
        <div className="choice">
          <h3>Choose a connection</h3>

          {loading && (
            <Dna
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
              className="connections"
            />
          )}

          {!loading && !connections && (
            <>
              <br />
              <p>No Connection in Workspace</p>
            </>
          )}

          {!loading && (
            <div className="connections">
              <div className="connection">
                {connections &&
                  connections.map((connection, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        handleConnection(e, connection);
                      }}
                      // make first button active by default
                      className={
                        index === 0
                          ? "active-button connection-button"
                          : "connection-button"
                      }
                    >
                      {connection.url}
                    </button>
                  ))}
              </div>
              {active.current && (
                <div className="data">
                  <div className="graph">
                    {active.current.times && (
                      <Line
                        data={{
                          labels: [
                            // get numOfTimes and create labels counting down from numOfTimes to 0
                            // if numOfTimes is 5, labels will be -4, -3, -2, -1, 0
                            ...Array(active.current.numOfTimes)
                              .fill()
                              .map(
                                (_, index) =>
                                  index - active.current.numOfTimes + 1,
                              ),
                          ],
                          datasets: [
                            {
                              label: active.current.url,
                              data: active.current.times
                                .split(",")
                                .map((time) => parseInt(time)),
                              fill: false,
                              backgroundColor: "rgb(0, 99, 132)",
                              borderColor: "rgba(0, 99, 132, 0.3)",
                              borderJoinStyle: "round",
                              pointRadius: 2,
                            },
                            // straight line at threshold
                            {
                              label: "Threshold",
                              data: Array(active.current.numOfTimes).fill(
                                active.current.threshold,
                              ),
                              fill: false,
                              backgroundColor: "rgb(255, 0, 132)",
                              borderColor: "rgba(255, 0, 132, 1)",
                              // make threshold line dashed
                              borderDash: [5, 5],
                              //remove point on threshold line
                              pointRadius: 0,
                            },
                          ],
                        }}
                        options={{
                          scales: {
                            y: {
                              beginAtZero: true,
                              // y goes from 0 to 1500
                              max: active.current.threshold * 4,
                            },
                          },
                        }}
                      />
                    )}

                    {!active.current.times && (
                      <p className="graph">No Connection Established</p>
                    )}
                  </div>
                  <div className="details">
                    <h3>Graph For</h3>
                    <br />
                    <p>
                      <strong>URL:</strong> {active.current.url}
                    </p>
                    <p>
                      <strong>Method:</strong> {active.current.requestType}
                    </p>
                    <p>
                      <strong>Threshold:</strong> {active.current.threshold}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {page === "create" && (
        <div className="choice">
          <h3>Create Connection</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={url}
              onChange={handleUrl}
              className="form-input"
              placeholder="URL"
            />

            <select
              id="method"
              className="form-input"
              required
              onChange={handleMethod}
              placeholder="Method"
            >
              <option value="" disabled selected>
                Select Method
              </option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>

            <input
              type="number"
              value={threshold}
              onChange={handleThreshold}
              className="form-input"
              placeholder="Threshold"
            />

            <input
              type="number"
              value={numOfTimes}
              onChange={handleNumOfTimes}
              className="form-input"
              placeholder="Number of Times"
            />

            <input type="submit" value="Submit" className="form-button" />
          </form>
        </div>
      )}

      {page === "delete" && (
        // a list of buttons with the url of each connection. onclick we delete that connection
        // from the database

        <div className="choice">
          <h3>Delete Connection</h3>

          {loading && (
            <Dna
              visible={true}
              height="80"
              width="80"
              ariaLabel="dna-loading"
              wrapperStyle={{}}
              wrapperClass="dna-wrapper"
              className="connections"
            />
          )}

          {!loading && !connections && (
            <>
              <br />
              <p>No Connection in Workspace</p>
            </>
          )}

          {!loading && (
            <div className="delete-connections">
              <div className="delete-connection">
                {connections &&
                  connections.map((connection, index) => (
                    <button
                      key={index}
                      onClick={handleDelete(
                        connection.url,
                        connection.requestType,
                      )}
                      className="connection-button"
                    >
                      {connection.url}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
