import { useContext, useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Drawer, IconButton, CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faComments } from "@fortawesome/free-solid-svg-icons";
import { SettingsContext } from "../context/SettingsContext";
import Chat from "../components/Chat";
import Sidebar from "../components/Sidebar";
import Settings from "../components/Settings";
import { PomodoroContext } from "../context/PomodoroContext";
import { AuthContext } from "../context/AuthContext";
import { SocketContext } from "../context/SocketContext";
import { toast } from "react-toastify";

export function Pomodoro() {
  const { room, setRoom, isLoading, setPomosCount, getRoom } =
    useContext(PomodoroContext);
  const { updateScore } = useContext(AuthContext);
  const [localScore, setlocalScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0.2 * 60);
  const [timerType, setTimerType] = useState("work");

  const { socket } = useContext(SocketContext);

  const [showSettings, setShowSettings] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [pomoState, setPomoState] = useState({
    workMins: 0.2,
    breakMins: 0.05,
    longBreakMins: 0.1,
    longBreakInterval: 4,
    autoChange: false,
    soundOn: false,
  });

  const [completedPomos, setCompletedPomos] = useState(1);

  const [convo, setConvo] = useState([]);

  useEffect(() => {
    getRoom();
  }, []);
  useEffect(() => {
    if (!room) return;
    setPomoState({
      workMins: room.focusMins,
      breakMins: room.breakMins,
      longBreakMins: room.longBreakMins,
      longBreakInterval: room.longBreakInterval,
      autoChange: room.autoChange,
      soundOn: false,
    });
  }, [room]);

  useEffect(() => {
    if (!socket) return;
    socket.on("new-isPlaying", (play) => {
      setIsPlaying(play);
    });

    socket.on("timer", (seconds, timerType, isPlaying) => {
      setSecondsLeft(seconds);
      setTimerType(timerType);
      setIsPlaying(isPlaying);
    });

    socket.on("user-connected", (name) => {
      setConvo((prevConvo) => [
        { message: `${name} has joined the room`, user: "" },
        ...prevConvo,
      ]);

      socket.emit("update-timer", secondsLeft, timerType, isPlaying);
      getRoom();
    });

    socket.on("user-disconnected", (name) => {
      setConvo((prevConvo) => [
        { message: `${name} has left the room`, user: "" },
        ...prevConvo,
      ]);
    });

    socket.on("receive-message", (message, name) => {
      setConvo((prevConvo) => [{ message: message, user: name }, ...prevConvo]);
    });

    socket.on("changed-room", (setting, value, name) => {
      setConvo((prevConvo) => [
        {
          message: `${name} changed value "${setting}" to ${value}`,
          user: "",
        },
        ...prevConvo,
      ]);
      if (setting === "Auto Change") {
        setPomoState({ ...pomoState, autoChange: value });
      } else if (setting === "Focus Minutes") {
        setPomoState({ ...pomoState, focusMins: value });
      } else if (setting === "Break Minutes") {
        setPomoState({ ...pomoState, breakMins: value });
      } else if (setting === "Long Break Minutes") {
        setPomoState({ ...pomoState, longBreakMins: value });
      } else if (setting === "Long Break Interval") {
        setPomoState({ ...pomoState, longBreakInterval: value });
      }
    });

    socket.on("type-change", (type, seconds, name) => {
      setConvo((prevConvo) => [
        {
          message: `${name} changed timer type to ${type}`,
          user: "",
        },
        ...prevConvo,
      ]);

      setTimerType(type);
      setSecondsLeft(seconds);
      setIsPlaying(false);
    });

    return () => {
      socket.off("new-isPlaying");
      socket.off("user-connected");
      socket.off("timer");
      socket.off("user-disconnected");
      socket.off("receive-message");
      socket.off("changed-room");
      socket.off("type-change");
    };
  }, [socket]);

  useEffect(() => {
    updateScore(localScore);
  }, [localScore]);

  function renderSwitch(type) {
    switch (type) {
      case "work":
        return pomoState.workMins * 60;
      case "break":
        return pomoState.breakMins * 60;
      case "lbreak":
        return pomoState.longBreakMins * 60;
      default:
        return;
    }
  }

  useEffect(() => {
    if (!room) return;
    let interval;

    const timeoutAudio = document.getElementById("timeout_audio");

    if (secondsLeft > 0 && isPlaying) {
      interval = setInterval(() => {
        setSecondsLeft((sec) => sec - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      if (pomoState.soundOn) timeoutAudio.play();

      if (timerType === "work") {
        setlocalScore((score) => score + 10);
        toast.info("You earned 10 points for finishing this session!");
        setCompletedPomos((count) => count + 1);
        setPomosCount((count) => count + 1);
        setSecondsLeft(() =>
          completedPomos % pomoState.longBreakInterval === 0
            ? pomoState.longBreakMins * 60
            : pomoState.breakMins * 60
        );
        setTimerType(() =>
          completedPomos % pomoState.longBreakInterval === 0
            ? "lbreak"
            : "break"
        );
      } else {
        if (timerType === "lbreak" && completedPomos % 4 === 0) {
          setlocalScore((score) => score + 30);
          toast.info("You earned 40 bonus points for 4 sessions streak!");
        }
        setSecondsLeft(() => pomoState.workMins * 60);
        setTimerType("work");
      }

      if (!pomoState.autoChange) {
        setIsPlaying(false);
      }
    }

    // if (!socket) return () => clearInterval(interval);
    // if (!room) return () => clearInterval(interval);
    // socket.on("user-connected", (name) => {
    //   setConvo((prevConvo) => [
    //     { message: `${name} has joined the room`, user: "" },
    //     ...prevConvo,
    //   ]);

    //   socket.emit("update-timer", secondsLeft, timerType, isPlaying);
    //   getRoom();
    // });

    return () => {
      clearInterval(interval);
      // socket.off("user-connected");
    };
  }, [isPlaying, secondsLeft, timerType]);

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");

  const secs = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div className="pages-root" id="pomo">
      <Sidebar />
      {isLoading ? (
        <CircularProgress
          style={{ position: "fixed", top: "50%", left: "50%" }}
        />
      ) : (
        <main className="room pomo-room">
          <span className="settings-btn">
            <IconButton
              aria-label="chat"
              onClick={() => {
                showChat ? setShowChat(false) : setShowChat(true);
              }}
            >
              <FontAwesomeIcon icon={faComments} />
            </IconButton>
            <IconButton
              aria-label="settings"
              onClick={() => {
                showSettings ? setShowSettings(false) : setShowSettings(true);
              }}
            >
              <FontAwesomeIcon icon={faCog} />
            </IconButton>
          </span>
          <section className="pomo-container">
            <h1>Pomodoro Room</h1>
            <span>
              {["work", "break", "lbreak"].map((type) => (
                <button
                  key={type}
                  className={
                    timerType === type
                      ? "btn selected-interval interval-btn"
                      : "btn interval-btn"
                  }
                  onClick={() => {
                    setTimerType(type);
                    setSecondsLeft(renderSwitch(type));
                    setIsPlaying(false);
                    socket.emit(
                      "change-session",
                      room?._id,
                      type,
                      renderSwitch(type)
                    );
                  }}
                >
                  {type === "work" && "Focus Time"}
                  {type === "break" && "Break"}
                  {type === "lbreak" && "Long break"}
                </button>
              ))}
            </span>
            <div className="circle">
              <CircularProgressbar
                value={secondsLeft}
                maxValue={renderSwitch(timerType)}
                text={minutes + ":" + secs}
                strokeWidth={2}
                styles={buildStyles({
                  textSize: "16px",
                  pathTransitionDuration: 0.5,
                  pathColor: "#333",
                  textColor: "#333",
                })}
              />
            </div>
            <button
              className="btn play-btn"
              onClick={() => {
                socket.emit("play-pause", room?._id, !isPlaying);
                setIsPlaying(!isPlaying);
                if (isPlaying && timerType === "work") {
                  setlocalScore((score) => score - 5);
                  toast.error("You lost 5 points for pausing during focus🙁");
                }
              }}
            >
              {isPlaying ? "PAUSE" : "PLAY"}
            </button>
          </section>

          {showChat && (
            <Chat
              setShowChat={setShowChat}
              roomId={room._id}
              convo={convo}
              setConvo={setConvo}
            />
          )}

          <SettingsContext.Provider value={{ pomoState, setPomoState }}>
            <Drawer
              anchor="right"
              open={showSettings}
              onClose={() => setShowSettings(false)}
              className="drawer"
            >
              <Settings type={timerType} />
            </Drawer>
          </SettingsContext.Provider>
        </main>
      )}
      <audio id="timeout_audio">
        <source src="http://soundbible.com/grab.php?id=1252&type=mp3"></source>
      </audio>
    </div>
  );
}
