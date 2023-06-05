import { IconButton, Popper, Fade, Paper, Divider } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEllipsisV,
  faFlag,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { TaskContext } from "../context/TaskContext";

export function Task({ todo, onChangeTask, onDeleteTask }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openOptions, setOpenOptions] = useState(false);

  const handleOptions = (e) => {
    setAnchorEl(e.currentTarget);
    setOpenOptions((prev) => !prev);
  };
  const [edit, setEdit] = useState(false);

  return (
    <>
      <input
        type="checkbox"
        checked={todo.isDone}
        onChange={(e) => {
          onChangeTask({ ...todo, isDone: e.target.checked });
        }}
      />
      {!edit && <p className={todo.isDone ? "done" : ""}>{todo.text}</p>}
      {edit && (
        <input
          defaultValue={todo.text}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEdit(false);
              onChangeTask({ ...todo, text: e.target.value });
            }
          }}
          // onChange={(e) => }
        />
      )}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          defaultValue={todo.dueDate}
          onChange={(newDate) => onChangeTask({ ...todo, dueDate: newDate })}
        />
      </LocalizationProvider>
      <IconButton size="small">
        <FontAwesomeIcon icon={faFlag} />
      </IconButton>
      <IconButton size="small" onClick={handleOptions}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </IconButton>
      <Popper
        open={openOptions}
        anchorEl={anchorEl}
        placement="bottom-end"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper sx={{ display: "flex", flexDirection: "column" }}>
              <IconButton
                size="small"
                onClick={() => {
                  setEdit(true);
                  setOpenOptions(false);
                }}
              >
                <FontAwesomeIcon icon={faEdit} />
                Edit
              </IconButton>
              <Divider />
              <IconButton
                size="small"
                onClick={() => {
                  setOpenOptions(false);
                  onDeleteTask(todo._id);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
                Delete
              </IconButton>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
}
