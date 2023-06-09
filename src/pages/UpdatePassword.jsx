import axios from "axios";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/users/";

const resetPassword = async (userData, token) => {
  // move this to the authcontext for better code
  const response = await axios
    .post(API_URL + `new_password/${userData.id}/${token}`, userData)
    .catch(function (error) {
      toast.error(error.response.data.message);
    });
};

export function UpdatePassword() {
  const navigate = useNavigate();
  const params = useParams();
  // console.log(params);

  const newPasswordRef = useRef();

  const onSubmit = (e) => {
    e.preventDefault();

    resetPassword(
      { id: params.id, password: newPasswordRef.current.value },
      params.token
    );

    navigate("/login");
  };

  return (
    <main>
      <form onSubmit={onSubmit} className="reset-form">
        <label htmlFor="password">New Password</label>
        <input
          ref={newPasswordRef}
          id="password"
          type="password"
          placeholder="Enter a new password.."
        />
        <button className="btn btn--form" type="submit">
          Change Password
        </button>
      </form>
    </main>
  );
}
