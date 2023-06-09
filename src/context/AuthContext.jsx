import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const API_URL = "https://productivity-app-service.onrender.com/api/users/";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeUsers, setActiveUsers] = useState();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [localScore, setlocalScore] = useState(0);

  const register = async (userData) => {
    const response = await axios
      .post(API_URL, userData)
      .catch(function (error) {
        toast.error(error.response.data.message);
      });

    if (response.data) {
      navigate("/login");
      //   localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  };

  const login = async (userData) => {
    const response = await axios
      .post(API_URL + "login", userData)
      .catch(function (error) {
        toast.error(error.response.data.message);
        return;
      });

    if (response.data) {
      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data);
    } else {
      console.log(response);
    }

    navigate("/profile");

    return response.data;
  };

  const logout = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    };
    const response = await axios.put(
      API_URL + user._id,
      { isActive: false },
      config
    );
    localStorage.removeItem("user");
    localStorage.removeItem("tasks");
    localStorage.removeItem("room");
    setUser(null);
    setUserInfo(null);
  };

  const getActiveUsers = async () => {
    const response = await axios.get(API_URL);
    if (response.data) {
      setActiveUsers(response.data.length);
      // console.log(activeUsers);
    }
  };

  const getUserInfo = async () => {
    if (!user) {
      // navigate("/login");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    };

    setIsLoading(true);
    const response = await axios.get(API_URL + "me", config);
    if (response.data) {
      console.log(response.data);
      setUserInfo(response.data);
      setIsLoading(false);
    }
  };

  const updateUser = async (userData) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    };
    const response = await axios.put(API_URL + user._id, userData, config);
    if (response.data) {
      setUserInfo(response.data);
    }
    return response.data;
  };

  const updateScore = (score) => {
    setlocalScore(score);
  };

  const updateUserScore = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    };

    const response = await axios.put(
      API_URL + user._id + "/score",
      { score: localScore },
      config
    );

    if (response.data) {
      setUserInfo(response.data);
      setlocalScore(0);
    }
    return response.data;
  };

  const resetPassword = async (email) => {
    const response = await axios.post(API_URL + email);

    if (response.status === 200) {
      toast.info(
        "Check your email to retrieve password and come back to login!"
      );

      navigate("/login");
    }
  };

  useEffect(() => {
    getUserInfo();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        register,
        login,
        logout,
        user,
        userInfo,
        isLoading,
        updateUser,
        updateScore,
        activeUsers,
        getActiveUsers,
        updateUserScore,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
