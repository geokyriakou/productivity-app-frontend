import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../context/SettingsContext";
import { IconButton, Switch, TextField } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { Pomodoro } from "../pages/Pomodoro";
import { PomodoroContext } from "../context/PomodoroContext";
import { SocketContext } from "../context/SocketContext";

export default function Settings({ type }) {
  const settingsInfo = useContext(SettingsContext);
  const { updateRoom, room } = useContext(PomodoroContext);
  const { socket } = useContext(SocketContext);
  const [inputFocus, setInputFocus] = useState(settingsInfo.pomoState.workMins);
  const [inputBreak, setInputBreak] = useState(
    settingsInfo.pomoState.breakMins
  );
  const [inputLBreak, setInputLBreak] = useState(
    settingsInfo.pomoState.longBreakMins
  );
  const [inputInterval, setInputInterval] = useState(
    settingsInfo.pomoState.longBreakInterval
  );

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <h2>Settings</h2>
        <IconButton size="small" title="All changes are broadcasted.">
          <FontAwesomeIcon icon={faCircleInfo} />
        </IconButton>
      </div>
      <p>Configure the Pomodoro Timer according to your needs.</p>
      <div className="setting">
        <h4>Trigger Conditions</h4>
        <span>
          <Switch
            checked={settingsInfo.pomoState.autoChange}
            onChange={(e) => {
              settingsInfo.setPomoState({
                ...settingsInfo.pomoState,
                autoChange: e.target.checked,
              });

              updateRoom({ ...room, autoChange: e.target.checked });

              socket.emit(
                "settings-change",
                room?._id,
                "Auto Change",
                e.target.checked
              );
            }}
            color="warning"
            inputProps={{ "aria-label": "controlled" }}
          />
          <label htmlFor="auto-change">Auto Change</label>
        </span>
        <span>
          <Switch
            checked={settingsInfo.pomoState.soundOn}
            onChange={(e) => {
              settingsInfo.setPomoState({
                ...settingsInfo.pomoState,
                soundOn: e.target.checked,
              });
            }}
            color="warning"
            inputProps={{ "aria-label": "controlled" }}
          />
          {/* <IconButton
            onClick={() => {
              settingsInfo.setPomoState({
                ...settingsInfo.pomoState,
                soundOn: !settingsInfo.soundOn,
              });
            }}
          >
            <FontAwesomeIcon
              icon={settingsInfo.soundOn ? faVolumeHigh : faVolumeMute}
              color={settingsInfo.soundOn ? "green" : "red"}
            />
          </IconButton> */}
          <label htmlFor="auto-change">
            <FontAwesomeIcon icon={faVolumeHigh} /> Sound Notification
          </label>
        </span>
      </div>
      <div className="setting">
        <h4>Time Settings</h4>
        <span>
          <label htmlFor="work-mins">Work Minutes:</label>
          <TextField
            disabled={type === "work"}
            id="outlined-controlled"
            value={inputFocus}
            onChange={(e) => {
              setInputFocus(e.target.value);
            }}
            onBlur={() => {
              settingsInfo.setPomoState({
                ...settingsInfo.pomoState,
                workMins: inputFocus,
              });

              updateRoom({ ...room, focusMins: inputFocus });
              socket.emit(
                "settings-change",
                room._id,
                "Focus Minutes",
                inputFocus
              );
            }}
            sx={{ width: "4rem" }}
            size="small"
          />
        </span>
        <span>
          <label htmlFor="break-mins">Short Break Minutes:</label>
          <TextField
            disabled={type === "break"}
            id="outlined-controlled"
            value={inputBreak}
            onChange={(e) => {
              setInputBreak(e.target.value);
            }}
            onBlur={() => {
              settingsInfo.setPomoState({
                ...settingsInfo.pomoState,
                breakMins: inputBreak,
              });
              updateRoom({ ...room, breakMins: inputBreak });
              socket.emit(
                "settings-change",
                room._id,
                "Break Minutes",
                inputBreak
              );
            }}
            sx={{ width: "4rem" }}
            size="small"
          />
        </span>
        <span>
          <label htmlFor="long-break-mins">Long Break Minutes:</label>
          <TextField
            disabled={type === "lbreak"}
            id="outlined-controlled"
            value={inputLBreak}
            onChange={(e) => {
              setInputLBreak(e.target.value);
            }}
            onBlur={() => {
              settingsInfo.setPomoState({
                ...settingsInfo.pomoState,
                longBreakMins: inputLBreak,
              });
              updateRoom({ ...room, longBreakMins: inputLBreak });
              socket.emit(
                "settings-change",
                room._id,
                "Long Break Minutes",
                inputLBreak
              );
            }}
            sx={{ width: "4rem" }}
            size="small"
          />
        </span>
      </div>
      <div className="setting">
        <h4>Interval Settings</h4>
        <span>
          <label htmlFor="long-break-interval">Long Break Interval:</label>
          <TextField
            id="outlined-controlled"
            value={inputInterval}
            onChange={(e) => {
              setInputInterval(e.target.value);
            }}
            onBlur={() => {
              settingsInfo.setPomoState({
                ...settingsInfo.pomoState,
                longBreakInterval: inputInterval,
              });
              updateRoom({ ...room, longBreakInterval: inputInterval });
              socket.emit(
                "settings-change",
                room._id,
                "Long Break Interval",
                inputInterval
              );
            }}
            sx={{ width: "4rem" }}
            size="small"
          />
        </span>
      </div>
    </>
  );
}
