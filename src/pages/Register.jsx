import { Autocomplete, TextField } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export function Register() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();

  const [occupation, setOccupation] = useState("");
  const [lvl, setLvl] = useState("");

  const { register } = useContext(AuthContext);

  function onSubmit(e) {
    e.preventDefault();

    let experienceLevel;
    switch (lvl) {
      case "Secondary Education": {
        experienceLevel = 0;
        break;
      }
      case "Tertiary Education": {
        experienceLevel = 1;
        break;
      }
      case "Undergraduate Education": {
        experienceLevel = 2;
        break;
      }
      case "Graduate/Professional": {
        experienceLevel = 3;
        break;
      }
      default:
        break;
    }

    const userData = {
      username: usernameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      occupation: occupation,
      experienceLevel: experienceLevel,
    };
    register(userData);
  }

  const professions = [
    "Marketing",
    "Engineering",
    "Design",
    "Finance/Accounting",
    "Human Recourses",
    "Healthcare",
    "Data or Analytics",
    "Education",
    "Legal",
    "Other",
  ];

  const education = [
    "Secondary Education",
    "Tertiary Education",
    "Undergraduate Education",
    "Graduate/Professional",
  ];

  return (
    <main className="area">
      <section className="register-text">
        <h1>Start your journey with us</h1>
        <p>
          Discover various productivity methods and maximize your skills through
          self-evaluation.
        </p>
      </section>
      <section className="forma">
        <h2>Sign up</h2>
        <h3>
          Already have an account? <Link to={"/login"}>Login now!</Link>
        </h3>
        <form onSubmit={onSubmit}>
          <label htmlFor="email">Email</label>
          <input
            ref={emailRef}
            id="email"
            type="email"
            placeholder="Enter your email.."
          />
          <label htmlFor="username">Username</label>
          <input
            ref={usernameRef}
            id="username"
            type="text"
            placeholder="Enter a username.."
          />
          <label htmlFor="password">Password</label>
          <input
            ref={passwordRef}
            id="password"
            type="password"
            placeholder="Enter a valid password.."
          />
          <label htmlFor="profession">Level of Education</label>
          <Autocomplete
            disablePortal
            value={lvl || null}
            onChange={(e, newValue) => {
              setLvl(newValue);
            }}
            id="combo-box-demo"
            options={education}
            sx={{ width: 480, height: "2rem" }}
            renderInput={(params) => <TextField {...params} />}
          />
          <label htmlFor="profession">Field of Interest</label>
          <Autocomplete
            disablePortal
            value={occupation || null}
            onChange={(e, newValue) => {
              setOccupation(newValue);
            }}
            id="combo-box-demo2"
            options={professions}
            sx={{ width: 480 }}
            renderInput={(params) => <TextField {...params} />}
          />
          <button className="btn btn--form" type="submit">
            Sign up
          </button>
        </form>
      </section>
    </main>
  );
}
