import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useMatch, useResolvedPath, useLocation } from "react-router-dom";
import {
  faBars,
  faCalendarAlt,
  faClock,
  faClose,
  faHome,
  faList,
  faSignOut,
  faTable,
  faTrophy,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Logo from "./Logo";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { PomodoroContext } from "../context/PomodoroContext";
import { SocketContext } from "../context/SocketContext";

import { IconButton } from "@mui/material";

export default function Sidebar() {
  const { logout } = useContext(AuthContext);
  const [navopen, setNavopen] = useState(false);

  return (
    <>
      <i onClick={() => setNavopen(!navopen)} className="nav-btn">
        <FontAwesomeIcon icon={navopen ? faClose : faBars} />
      </i>
      <aside className={navopen ? "sidebar" : "sidebar-closed"}>
        <ul>
          <CustomLink to="/" icon={faHome}>
            Home
          </CustomLink>
          <CustomLink to="/profile" icon={faUser}>
            My Profile
          </CustomLink>
          <p>Private</p>
          <CustomLink to="/tasks" icon={faList}>
            Tasks
          </CustomLink>
          <CustomLink to="/matrix" icon={faTable}>
            Priority Matrix
          </CustomLink>
          <CustomLink to="/calendar" icon={faCalendarAlt}>
            Calendar
          </CustomLink>
          <p>Community</p>
          <CustomLink to="/leaderboard" icon={faTrophy}>
            Leaderboards
          </CustomLink>
          <CustomLink to="/pomo" icon={faClock}>
            PomoRoom
          </CustomLink>
          <CustomLink to="/login" icon={faSignOut} onClick={() => logout()}>
            Logout
          </CustomLink>
        </ul>
      </aside>
    </>
  );
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  const location = useLocation();

  const { socket } = useContext(SocketContext);
  const { user, updateUser, updateUserScore } = useContext(AuthContext);
  const { createRoom, room, deleteRoom, updateRoom, getRoom, pomosCount } =
    useContext(PomodoroContext);

  return (
    <Link to={to} {...props} className={isActive ? "link active" : "link"}>
      <li
        onClick={() => {
          if (to === "/pomo" && (room?.length === 0 || !room)) {
            createRoom();
          }

          getRoom();

          if (location.pathname === "/pomo" && to !== "/pomo") {
            socket.emit("disconnect-user", room?._id);

            updateUser({
              focusTime: (pomosCount * 25) / 60,
            });

            updateUserScore();

            if (!room.member2) {
              deleteRoom(room._id);
            } else {
              if (room.member2 === user._id) {
                updateRoom({ ...room, member2: null });
              } else {
                updateRoom({ ...room, member1: null });
              }
            }
          }
        }}
      >
        <FontAwesomeIcon icon={props.icon} /> {children}
      </li>
    </Link>
  );
}
