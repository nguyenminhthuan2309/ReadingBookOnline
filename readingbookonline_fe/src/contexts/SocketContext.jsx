import React, { createContext, useContext } from "react";
import { useSocket } from "../utils/useSocket";

const SocketContext = createContext(null);

export const SocketProvider = ({ children, userInfo }) => {
  const socketData = useSocket(userInfo);

  return (
    <SocketContext.Provider value={socketData}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }
  return context;
};
