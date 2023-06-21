import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
const API_URL = "https://productivity-app-service.onrender.com/api/users/";

export function ConfirmEmail() {
  const navigate = useNavigate();
  const params = useParams();
  useEffect(() => {
    async function fetch() {
      const response = await axios
        .post(API_URL + `${params.id}/confirm`)
        .catch(function (error) {
          toast.error(error.response.data.message);
        });
    }
    fetch();
    navigate("/login");
  }, []);
  return <div>ConfirmEmail</div>;
}
