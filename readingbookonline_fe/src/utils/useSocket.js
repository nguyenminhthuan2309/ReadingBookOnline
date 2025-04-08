import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (userInfo) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userInfo) return;

    // Only create a new socket if one doesn't exist
    if (!socketRef.current) {
      try {
        const socket = io("http://localhost:3002", {
          query: { userId: userInfo.id },
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketRef.current = socket;
      } catch (error) {
        console.error("Failed to initialize socket:", error);
        setIsConnected(false);
        return;
      }
    }

    const socket = socketRef.current;

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

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userInfo]);

  return { socket: socketRef.current, isConnected };
};
