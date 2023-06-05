import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";

// const socket = io("https://productivity-app-service.onrender.com");

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useContext(AuthContext);
  const username = user?.username;
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io("https://productivity-app-service.onrender.com", {
      query: { username },
    });
    setSocket(newSocket);

    return () => newSocket.close(); //to avoid duplicated messages
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
