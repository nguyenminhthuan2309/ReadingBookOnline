import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (userId) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // If there's an existing socket, disconnect it
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    // Create new socket with error handling
    try {
      const socket = io("http://localhost:3002", {
        query: { userId },
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on("connect", () => {
        console.log("Socket connected successfully");
        setIsConnected(true);
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      });

      socket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        setIsConnected(false);
      });

      socketRef.current = socket;

      return () => {
        socket.disconnect();
      };
    } catch (error) {
      console.error("Failed to initialize socket:", error);
      setIsConnected(false);
    }
  }, [userId]);

  return { socket: socketRef.current, isConnected };
};
