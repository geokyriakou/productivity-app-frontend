import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { SocketContext } from "./SocketContext";
const API_URL = "https://productivity-app-service.onrender.com/api/rooms/";

export const PomodoroContext = createContext(null);

export function PomodoroProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const { socket } = useContext(SocketContext);
  const [room, setRoom] = useState(null);
  const [pomosCount, setPomosCount] = useState(0);

  const config = {
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  };

  const createRoom = async () => {
    setIsLoading(true);
    const response = await axios.post(API_URL, "", config);
    if (response.data) {
      socket.emit("new-user", response.data._id, user.username);
      setRoom(response.data);
      setIsLoading(false);
    }
    setPomosCount(0);
    return response.data;
  };

  const getRoom = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(API_URL, config);
      if (response.data) {
        setRoom(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const memberLeave = (updateData) => {
    if (!updateData.member1) {
      return { ...updateData, member1: updateData.member2, member2: null };
    }
    return updateData;
  };

  const updateRoom = async (updateData, setting, value) => {
    const alone = await axios.get(API_URL, config);
    if (alone.data.member2 === null) {
      deleteRoom(room._id);
    } else {
      const data = memberLeave(updateData);
      const response = await axios.put(API_URL + updateData._id, data, config);
      if (response.data) {
        if (
          response.data.member1 === user._id ||
          response.data.member2 === user._id
        ) {
          setRoom(response.data);
          socket.emit("settings-change", room._id, setting, value);
        } else {
          setRoom(null);
        }
        // socket.emit("disconnect-user", room?._id);
      }
      return response.data;
    }
  };

  const deleteRoom = async (deleteId) => {
    const alone = await axios.get(API_URL, config);
    if (alone.data.member2 === null) {
      const response = await axios.delete(API_URL + deleteId, config);
      if (response.data) {
        // localStorage.setItem("room", []);
        setRoom(null);
        socket.emit("disconnect-user", room?._id);
      }
      return response.data;
    } else {
      updateRoom({ ...room, member1: alone.data.member2, member2: null });
    }
  };

  useEffect(() => {
    if (Array.isArray(room)) {
      localStorage.setItem("room", JSON.stringify(room[0]));
    } else {
      localStorage.setItem("room", JSON.stringify(room));
    }
    if (!room) {
      setIsLoading(true);
    }
  }, [room]);

  return (
    <PomodoroContext.Provider
      value={{
        createRoom,
        updateRoom,
        deleteRoom,
        room,
        setRoom,
        getRoom,
        pomosCount,
        setPomosCount,
        isLoading,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}
