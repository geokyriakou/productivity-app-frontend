import { useContext, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Input,
} from "@mui/material";
export function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const resetEmailRef = useRef();
  const [forgot, setForgot] = useState(false);

  const { login, user, resetPassword } = useContext(AuthContext);
  if (user != null) return <Navigate to="/" />;

  function onSubmit(e) {
    e.preventDefault();
    const userData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    login(userData);
  }

  const sendEmail = () => {
    setForgot(false);
    resetPassword(resetEmailRef.current.value);
  };

  return (
    <main className="area login">
      <section className="forma">
        <h2>Sign in</h2>
        <h3>
          Don't have an account? <Link to={"/register"}>Register now!</Link>
        </h3>
        <form onSubmit={onSubmit}>
          <label htmlFor="email">Email</label>
          <input
            ref={emailRef}
            id="email"
            type="email"
            placeholder="Enter your email.."
          />
          <label htmlFor="password">Password</label>
          <input
            ref={passwordRef}
            id="password"
            type="password"
            placeholder="Enter your password.."
          />
          <button className="btn btn--form" type="submit">
            Sign in
          </button>
          <div className="forgot" onClick={() => setForgot(true)}>
            Forgot Password?
          </div>
        </form>
      </section>
      <section className="login-text">
        <h1>Welcome back!</h1>
        <p>
          Discover various productivity methods and maximize your skills through
          self-evaluation.
        </p>
      </section>
      <Dialog
        open={forgot}
        onClose={() => {
          setForgot(false);
        }}
      >
        <DialogTitle>Enter your registered email to reset password</DialogTitle>
        <DialogContent>
          <Input
            inputRef={resetEmailRef}
            autoFocus
            margin="dense"
            id="name"
            label="email"
            type="email"
            fullWidth
            variant="standard"
            placeholder="example@email.com"
            sx={{ marginBottom: "10px" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={sendEmail}>Send Reset email</Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}
