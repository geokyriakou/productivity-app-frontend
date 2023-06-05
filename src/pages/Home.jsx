import { useContext, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Logo from "../components/Logo";
import { ReactComponent as Tasks } from "../assets/tasks.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

export function Home() {
  const { user } = useContext(AuthContext);

  if (user !== null) return <Navigate to="/profile" />;

  return (
    <>
      <header className="header">
        {/* <Logo/> */}

        <nav className="home-nav">
          <ul className="main-nav-list">
            <li>
              <a className="main-nav-link" href="#">
                How it works
              </a>
            </li>
            <li>
              <a className="main-nav-link" href="#">
                Features
              </a>
            </li>
            <li>
              <a className="main-nav-link" href="/login">
                Log in
              </a>
            </li>
            <li>
              <a className="main-nav-link nav-cta" href="/register">
                Sign Up
              </a>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="section-hero">
          <div className="hero-text">
            <h1>Productivity growth starts here. </h1>
            <h3>
              Get paired with an accountability partner and track your progress
              on staying productive!
            </h3>
            <div>
              {" "}
              <a className="main-nav-link nav-cta" href="/register">
                Start for free
              </a>
              <a className="main-nav-link nav-cta cfa">
                Learn more
                <FontAwesomeIcon icon={faArrowDown} />
              </a>
            </div>
          </div>
          <div className="hero-img">
            <Tasks />
          </div>
        </section>
      </main>

      <footer></footer>
    </>
  );
}
