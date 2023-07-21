import React, { createContext, useContext } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

const NotificationContext = createContext(null);

export function useNotifications() {
  return useContext(NotificationContext);
}

export function NotificationProvider(props) {
  const createNotification = (type, message, title) => {
    switch (type) {
      case "error":
        NotificationManager.error(message, title);
        break;
      case "success":
        NotificationManager.success(message, title);
        break;
      case "info":
        NotificationManager.info(message, title);
        break;
      case "warning":
        NotificationManager.warning(message, title);
        break;
      default:
        break;
    }
  };

  return (
    <NotificationContext.Provider value={{ createNotification }}>
      {props.children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}
