import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const API_URL = "http://localhost:5000/api/tasks/";

export const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const navigate = useNavigate();
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newTask, setNewTask] = useState(null);

  const { user } = useContext(AuthContext);
  const config = {
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  };

  const getTasks = async () => {
    if (!user) {
      // navigate("/login");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.get(API_URL, config);
      if (response.data) {
        localStorage.setItem("tasks", JSON.stringify(response.data));
        setTaskList(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }

    // return response.data;
  };

  const createTask = async (taskData) => {
    const response = await axios.post(API_URL, taskData, config);
    if (response.data) {
      setNewTask(response.data);
    }
    return response.data;
  };

  const updateTask = async (updateData) => {
    const response = await axios.put(
      API_URL + updateData._id,
      updateData,
      config
    );
    return response.data;
  };

  const deleteTask = async (deleteId) => {
    const response = await axios.delete(API_URL + deleteId, config);
    return response.data;
  };

  useEffect(() => {
    getTasks();
  }, [user]);

  return (
    <TaskContext.Provider
      value={{
        taskList,
        createTask,
        getTasks,
        isLoading,
        updateTask,
        deleteTask,
        newTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
