import Draggable from "react-draggable";

import { IconButton } from "@mui/material";
import {
  faArrowRight,
  faPaperPlane,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { PomodoroContext } from "../context/PomodoroContext";
import { SocketContext } from "../context/SocketContext";

export default function Chat({
  setShowChat,
  roomId,
  messages,
  convo,
  setConvo,
}) {
  // const { room } = useContext(PomodoroContext);
  // const roomId = room._id;
  const nodeRef = useRef(null);
  const messageRef = useRef(null);
  // const roomRef = useRef(null);

  const { socket } = useContext(SocketContext);

  const onSubmitMessage = () => {
    socket.emit("send-message", messageRef.current.value, roomId);
    setConvo((prevConvo) => [
      { message: messageRef.current.value, user: "me" },
      ...prevConvo,
    ]);
    messageRef.current.value = "";
  };

  return (
    <Draggable nodeRef={nodeRef} handle="strong">
      <div ref={nodeRef} className="chat" id="chat">
        <strong className="user">
          Brainstorming Chat
          <IconButton size="small" onClick={() => setShowChat(false)}>
            <FontAwesomeIcon icon={faX} />
          </IconButton>
        </strong>
        <ul className="messages">
          {convo.map((c, index) => {
            // if(c.user === "setting"){
            //   return (
            //     <li key={index} className="admin-msg">
            //       <p>{c.message}</p>
            //     </li>
            //   );
            // }
            if (!c.user) {
              return (
                <li key={index} className="admin-msg">
                  <p>{c.message}</p>
                </li>
              );
            }

            return (
              <li key={index} className={c.user === "me" ? "msg-rev " : "msg"}>
                <div>{c.user === "me" ? "" : c.user.charAt(0)}</div>
                <p>{c.message}</p>
              </li>
            );
          })}
        </ul>
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <input
            type="text"
            placeholder="New message"
            ref={messageRef}
            id="msg-input"
            style={{ height: "3rem", width: "270px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSubmitMessage();
            }}
          />
          <IconButton onClick={onSubmitMessage} size="small">
            <FontAwesomeIcon icon={faPaperPlane} />
          </IconButton>
        </div>
        {/* <input
          type="text"
          placeholder="Room"
          // ref={roomRef}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmitRoom();
          }}
        /> */}
      </div>
    </Draggable>
  );
}
