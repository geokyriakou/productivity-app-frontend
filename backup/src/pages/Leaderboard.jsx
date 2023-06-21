import { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
const API_URL =
  "https://productivity-app-service.onrender.com/api/leaderboard/";

export function Leaderboard() {
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState("position");
  const [showCard, setShowCard] = useState(false);
  const [leaderboard, setLeaderboard] = useState();
  const { activeUsers, getActiveUsers, userInfo } = useContext(AuthContext);

  const getLeaderboard = async () => {
    const response = await axios.get(API_URL);
    if (response.data) {
      setLeaderboard(response.data);
    }
    return response.data;
  };

  useEffect(() => {
    getLeaderboard();

    getActiveUsers();
  }, []);
  const handleChangePanel = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="pages-root">
      <Sidebar />
      <main className="leader room">
        <header>
          <h2>Pomodoro Community</h2>
          <span>
            <p>Total Members</p>
            <h2>{leaderboard?.length} members</h2>
          </span>
          <span>
            <p>Avg Focus Time</p>
            <h2>
              {(
                leaderboard?.reduce((a, b) => a + b.avgFocus, 0) /
                leaderboard?.length
              ).toFixed(1)}{" "}
              hours
            </h2>
          </span>
          <span>
            <p>Members Online</p>
            <h2>{activeUsers} online</h2>
          </span>
        </header>
        <div className="board">
          <div className="bar">
            <div>Pos</div>
            <div>User</div>
            <button onClick={() => setFilter("daysStreak")}>Streak</button>
            <button onClick={() => setFilter("avgFocus")}>AvgFocus</button>
            <button onClick={() => setFilter("score")}>XP</button>
          </div>
          {leaderboard
            ?.sort(
              (a, b) => b[filter] - a[filter]
              // a.filter - b.filter
            )
            .map((user, index) => (
              <Accordion
                sx={{
                  position: "relative",
                  backgroundColor:
                    userInfo._id === user.user._id ? "#FEFFDB" : "",
                }}
                key={`panel${user.user._id}bh-header`}
                expanded={expanded === `panel${user.user._id}`}
                onChange={handleChangePanel(`panel${user.user._id}`)}
              >
                <AccordionSummary
                  aria-controls={`panel${user.user._id}bh-content`}
                  id={`panel${user.user._id}bh-header`}
                >
                  <Typography
                    sx={{ width: "5%", fontSize: "1.5rem", fontWeight: "700" }}
                  >
                    {index + 1}
                  </Typography>
                  <button
                    style={{
                      fontSize: "1.4rem",
                      marginRight: "0.5rem",
                      width: "2.4rem",
                      borderRadius: "50%",
                    }}
                  >
                    {user.user.username.charAt(0)}
                    <div style={{ position: "absolute" }}></div>
                  </button>
                  <Typography
                    sx={{
                      width: "70%",
                      fontSize: "1.45rem",
                    }}
                  >
                    {user.user.username}
                  </Typography>
                  {showCard && (
                    <Paper
                      sx={{
                        bgcolor: "#cb572a",
                        borderRadius: "30px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                      }}
                    >
                      <h2>gkyriakou</h2>
                      <h3 style={{ color: "#ededed" }}>
                        Undergraduate student
                      </h3>
                      <div className="job">Electrical Engineering</div>
                    </Paper>
                  )}
                  <Typography sx={{ width: "10%", fontSize: "1.2rem" }}>
                    {user.daysStreak}d
                  </Typography>
                  <Typography sx={{ width: "10%", fontSize: "1.2rem" }}>
                    {user.avgFocus.toFixed(1)}h
                  </Typography>
                  <Typography sx={{ width: "5%", fontSize: "1.2rem" }}>
                    {user.score}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails></AccordionDetails>
              </Accordion>
            ))}
        </div>
      </main>
    </div>
  );
}
