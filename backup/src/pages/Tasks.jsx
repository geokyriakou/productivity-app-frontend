import {
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Sidebar from "../components/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { tasksReducer } from "../reducers/taskReducer";
import { TaskList } from "../components/TaskList";
import { TaskContext } from "../context/TaskContext";
import { AuthContext } from "../context/AuthContext";

function Card({ label, children }) {
  return (
    <div className="card">
      <div
        className={`label ${label === "Do Now" && "label1"} ${
          label === "Decide Later" && "label2"
        } ${label === "Delegate" && "label3"} ${
          label === "Delete" && "label4"
        }`}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function Topbar({ word, setWord, onAddTask }) {
  const [openAdd, setOpenAdd] = useState(false);
  const urgentRef = useRef();
  const importantRef = useRef();
  const dateRef = useRef();
  const textRef = useRef();

  const handleClose = () => setOpenAdd(false);

  const handleAddTask = () => {
    setOpenAdd(false);

    let label = "Do Now";
    if (urgentRef.current.checked && !importantRef.current.checked) {
      label = "Delegate";
    } else if (!urgentRef.current.checked && importantRef.current.checked) {
      label = "Decide Later";
    } else if (!urgentRef.current.checked && !importantRef.current.checked) {
      label = "Delete";
    }
    onAddTask(textRef.current.value, label, dateRef.current.value);
  };

  return (
    <header className="topbar">
      <h4>Set your goals!</h4>
      <FormControl sx={{ m: 1, width: "300px" }} variant="filled">
        <Input
          id="filled-adornment-password"
          label={"text"}
          sx={{ height: "35px" }}
          placeholder="Search task..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" edge="end">
                <FontAwesomeIcon icon={faSearch} />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button type="button" onClick={() => setOpenAdd(true)}>
        Add New
      </Button>
      <Dialog open={openAdd} onClose={handleClose}>
        <DialogTitle>New Task</DialogTitle>
        <DialogContent>
          <Input
            inputRef={textRef}
            autoFocus
            margin="dense"
            id="name"
            label="task text"
            type="text"
            fullWidth
            variant="standard"
            placeholder="Type task text..."
            sx={{ marginBottom: "10px" }}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker defaultValue={dayjs()} inputRef={dateRef} />
          </LocalizationProvider>
          <FormControlLabel
            sx={{ margin: 0 }}
            label="Urgent"
            control={<Checkbox inputRef={urgentRef} defaultChecked />}
          />
          <FormControlLabel
            sx={{ margin: 0 }}
            label="Important"
            control={<Checkbox inputRef={importantRef} defaultChecked />}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddTask}>Add</Button>
        </DialogActions>
      </Dialog>
    </header>
  );
}

export function Tasks({ eisen }) {
  const { createTask, updateTask, deleteTask, getTasks, newTask } =
    useContext(TaskContext);

  const initialTasks = JSON.parse(localStorage.getItem("tasks"));

  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
      ? initialTasks.map((task) => ({ ...task, dueDate: dayjs(task.dueDate) }))
      : []
  );

  const [word, setWord] = useState("");

  function handleAddTask(text, label, dueDate) {
    createTask({ text: text, label: label, dueDate: dueDate });
  }

  useEffect(() => {
    if (!newTask) return;
    if (initialTasks.some((element) => element._id === newTask._id)) return;
    dispatch({
      type: "added",
      _id: newTask._id,
      text: newTask.text,
      label: newTask.label,
      dueDate: newTask.dueDate,
    });
  }, [newTask]);

  function handleChangeTask(task) {
    dispatch({
      type: "changed",
      task: task,
    });
    updateTask(task);
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: "deleted",
      _id: taskId,
    });
    deleteTask(taskId);
  }

  useEffect(() => {
    getTasks();
  }, [tasks]);

  return (
    <div className="pages-root">
      <Sidebar />
      {/* {isLoading ? (
        <CircularProgress
          style={{ position: "fixed", top: "50%", left: "50%" }}
        />
      ) : (
        <> */}
      {eisen && (
        <Topbar word={word} setWord={setWord} onAddTask={handleAddTask} />
      )}
      <div className={`room ${eisen && "eisen"}`}>
        {!eisen && (
          <Topbar word={word} setWord={setWord} onAddTask={handleAddTask} />
        )}
        <Card label="Do Now">
          <TaskList
            label="Do Now"
            word={word}
            tasks={tasks}
            onChangeTask={handleChangeTask}
            onDeleteTask={handleDeleteTask}
          />
        </Card>
        <Card label="Decide Later">
          <TaskList
            label="Decide Later"
            word={word}
            tasks={tasks}
            onChangeTask={handleChangeTask}
            onDeleteTask={handleDeleteTask}
          />
        </Card>
        <Card label="Delegate">
          <TaskList
            label="Delegate"
            word={word}
            tasks={tasks}
            onChangeTask={handleChangeTask}
            onDeleteTask={handleDeleteTask}
          />
        </Card>
        <Card label="Delete">
          <TaskList
            label="Delete"
            word={word}
            tasks={tasks}
            onChangeTask={handleChangeTask}
            onDeleteTask={handleDeleteTask}
          />
        </Card>
      </div>
      {/* </>
      )} */}
    </div>
  );
}

export function PriorityMatrix() {
  return <Tasks eisen={true} />;
}

// const newTask = {
//   id: crypto.randomUUID(),
//   text: textRef.current.value,
//   isDone: false,
//   label: label,
//   dueDate: dateRef.current.value,
// };

// const todos = [
//   { id: 0, text: "Create my todo list", isDone: false, type: "Do Now" },
//   { id: 1, text: "abracada", isDone: false, type: "Do Now" },
//   { id: 2, text: "lolejsidbni", isDone: false, type: "Do Now" },
//   { id: 3, text: "hhhhhhhhhhh", isDone: false, type: "Do Now" },
//   { id: 4, text: "kkkkkkkk", isDone: true, type: "Delete" },
//   { id: 5, text: "uuuuuu", isDone: false, type: "Decide Later" },
//   { id: 6, text: "okfoek", isDone: false, type: "Decide Later" },
//   { id: 7, text: "iiiiiiiiii", isDone: false, type: "Decide Later" },
//   { id: 8, text: "hhhhhhhhhhh", isDone: false, type: "Delegate" },
// ];
