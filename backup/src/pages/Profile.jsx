import { Paper, CircularProgress } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { IconButton, Autocomplete, TextField } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCheck,
  faClock,
  faEdit,
  faFire,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import Plot from "../components/Plot";
import { AuthContext } from "../context/AuthContext";
import { TaskContext } from "../context/TaskContext";

export function Profile() {
  const [edit, setEdit] = useState(false);

  const { userInfo, isLoading, updateUser } = useContext(AuthContext);
  const { taskList } = useContext(TaskContext);

  const education = [
    "Secondary Education",
    "Tertiary Education",
    "Undergraduate Education",
    "Graduate/Professional",
  ];

  const professions = [
    "Marketing",
    "Engineering",
    "Design",
    "Finance/Accounting",
    "Human Recourses",
    "Healthcare Professional",
    "Data or Analytics",
    "Education Professional",
    "Legal",
    "Other",
  ];

  const [lvl, setLvl] = useState("");
  useEffect(() => {
    switch (userInfo?.experienceLevel) {
      case 0: {
        setLvl("Secondary Education");
        break;
      }
      case 1: {
        setLvl("Tertiary Education");
        break;
      }
      case 2: {
        setLvl("Undergraduate Education");
        break;
      }
      case 3: {
        setLvl("Graduate/Professional");
        break;
      }
      default:
        break;
    }
  }, [userInfo]);

  // const usernameRef = useRef(userInfo?.username);
  const [occupation, setOccupation] = useState(userInfo?.occupation);

  const onUpdateProfile = () => {
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

    updateUser({
      experienceLevel: experienceLevel,
      // username: usernameRef.current.value,
      occupation: occupation,
    });
  };

  let donePercentage =
    (taskList.filter((task) => task.isDone).length / taskList.length) * 100;

  if (taskList.length === 0) {
    donePercentage = 0;
  }

  return (
    <div className="pages-root">
      <Sidebar />
      {isLoading ? (
        <CircularProgress
          style={{ position: "fixed", top: "50%", left: "50%" }}
        />
      ) : (
        <main className="profile">
          <Paper
            sx={{
              bgcolor: "#cb572a",
              borderRadius: "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <IconButton
              style={{ right: "1rem", top: "1rem", position: "absolute" }}
              onClick={() => {
                {
                  edit && onUpdateProfile();
                }
                setEdit(!edit);
              }}
            >
              <FontAwesomeIcon icon={edit ? faCheck : faEdit} />
            </IconButton>
            <div className="profile-pic">
              {userInfo?.username?.charAt(0).toUpperCase()}
              <div />
            </div>
            {edit ? (
              <>
                <h2>{userInfo?.username}</h2>
                <Autocomplete
                  disablePortal
                  value={lvl || null}
                  onChange={(e, newValue) => {
                    setLvl(newValue);
                  }}
                  id="lvl"
                  options={education}
                  sx={{ height: "fit-content", width: 200, marginTop: "1rem" }}
                  renderInput={(params) => <TextField {...params} />}
                />
                <Autocomplete
                  disablePortal
                  value={occupation || null}
                  onChange={(e, newValue) => {
                    setOccupation(newValue);
                  }}
                  id="occupation"
                  options={professions}
                  sx={{ height: "fit-content", width: 200, marginTop: "1rem" }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </>
            ) : (
              <>
                <h2>{userInfo?.username}</h2>
                <h3 style={{ color: "#ededed" }}>{lvl}</h3>
                <div className="job">{userInfo?.occupation}</div>
              </>
            )}
          </Paper>
          <Paper sx={{ bgcolor: "#e7a489", borderRadius: "30px" }}>
            <Plot />
          </Paper>
          <Paper
            sx={{
              bgcolor: "#f8e4dc",
              gridColumn: "1/span 2",
              borderRadius: "30px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <h4>Engagement</h4>
            <span className="analytic">
              <h3>Days Streak</h3>
              <p>{userInfo?.daysStreak} d </p>

              <div className="label">
                <FontAwesomeIcon icon={faFire} />
              </div>
            </span>
            <span className="analytic">
              <h3>Done Tasks</h3>
              <p>{donePercentage.toFixed(0)}%</p>
              <div className="label">
                <FontAwesomeIcon icon={faCheck} />
              </div>
            </span>
            <span className="analytic">
              <h3>Avg Focus</h3>
              <p>
                {(
                  userInfo?.focusTime?.reduce((a, b) => a + b, 0) /
                  userInfo?.focusTime?.length
                ).toFixed(1)}{" "}
                h
              </p>

              <div className="label">
                <FontAwesomeIcon icon={faClock} />
              </div>
            </span>
            <span className="analytic">
              <h3>Points</h3>
              <p> {userInfo?.score} XP</p>

              <div className="label">
                <FontAwesomeIcon icon={faStar} />
              </div>
            </span>
          </Paper>
        </main>
      )}
    </div>
  );
}
