import { useContext, useRef } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Logo from "../components/Logo";
import { ReactComponent as Tasks } from "../assets/tasks.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faCalendarDays,
  faTag,
  faTasksAlt,
  faTrophy,
  faUserCircle,
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";

export function Home() {
  const { user } = useContext(AuthContext);

  if (user !== null) return <Navigate to="/profile" />;

  return (
    <>
      <header className="header">
        <nav className="main-nav-list">
          <a className="main-nav-link" href="#how">
            How it works
          </a>
          <a className="main-nav-link" href="#features">
            Features
          </a>
          <a className="main-nav-link" href="/login">
            Log in
          </a>
          <a className="main-nav-link nav-cta" href="/register">
            Sign Up
          </a>
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
            <div className="cta-btns">
              {" "}
              <a className="main-nav-link nav-cta" href="/register">
                Start for free
              </a>
              <a className="main-nav-link nav-cta cfa" href="#how">
                Learn more
                <FontAwesomeIcon icon={faArrowDown} />
              </a>
            </div>
          </div>
          <div
            className="hero-img"
            role="img"
            alt="Animated picture of 2 people managing tasks and notes"
          >
            <Tasks />
          </div>
        </section>
        <section id="how" className="section-how">
          HOW IT WORKS
          <h2 class="heading-secondary">
            Your daily dose of productivity in 3 simple steps
          </h2>
          <div className="container">
            <p className="number">01</p>
            <p className="how-text">
              Tell us your occupation and level for better pair making.
            </p>

            <p className="number">02</p>
            <p className="how-text">
              Write down your tasks with due dates and set priorities
            </p>
            <p className="number">03</p>
            <p className="how-text">
              Enter a Pomodoro room to focus on your task with an accountability
              partner
            </p>
          </div>
        </section>

        <section id="features" className="section-features">
          {/* FEATURES
          <h2 class="heading-secondary">
            Take advatange of all tools available
          </h2> */}
          <div>
            <FontAwesomeIcon icon={faUserCircle} size="xl" color="#cb572a" />
            <h2>Profile</h2>
            <p>
              View your info and personalized analytics and track your progress.
            </p>
          </div>
          <div>
            <FontAwesomeIcon icon={faTasksAlt} size="xl" color="#cb572a" />
            <h2>Task List</h2>
            <p>Create your own task list as in a piece of paper.</p>
          </div>
          <div>
            <FontAwesomeIcon icon={faTag} size="xl" color="#cb572a" />
            <h2>Priority Matrix</h2>
            <p>
              Set priorities using the Priority Matrix and its four quadrants.
            </p>
          </div>
          <div>
            <FontAwesomeIcon icon={faCalendarDays} size="xl" color="#cb572a" />
            <h2>Calendar</h2>
            <p>Manage tasks based on dates with weekly or monthly view.</p>
          </div>
          <div>
            <FontAwesomeIcon icon={faTrophy} size="xl" color="#cb572a" />
            <h2>Leaderboard</h2>
            <p>
              See the top rated Pomodoro users and get inspired to become one.
            </p>
          </div>
          <div>
            <FontAwesomeIcon icon={faUserClock} size="xl" color="#cb572a" />
            <h2>Pomodoro</h2>
            <p>
              We pair you up with an accountability partner based on your
              profession and ratings and you focus.
            </p>
          </div>
        </section>
      </main>

      <footer>
        <p>Copyright © 2023 by PomoShare. All rights reserved.</p>
        <div>
          <h4>Contact us</h4>
          <address>
            <a href="pomoshare@outlook.com">pomoshare@outlook.com</a>
          </address>
        </div>
      </footer>
    </>
  );
}
