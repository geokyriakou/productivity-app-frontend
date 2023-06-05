import Sidebar from "../components/Sidebar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Input,
} from "@mui/material";
import dayjs from "dayjs";
import { TaskContext } from "../context/TaskContext";

export function Calendar() {
  const { createTask, newTask, getTasks, deleteTask } = useContext(TaskContext);

  const [openAdd, setOpenAdd] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const initialTasks = JSON.parse(localStorage.getItem("tasks"));

  const textRef = useRef(null);
  const importantRef = useRef();
  const urgentRef = useRef();

  const convertedEvents = initialTasks
    ? initialTasks.map((task) => ({
        start: task.dueDate.split("T")[0],
        title: task.text,
        id: task._id,
        label: task.label,
        isDone: task.isDone,
      }))
    : [];

  const [events, setEvents] = useState(convertedEvents);

  const handleEventClick = (clickInfo) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      setEvents(events.filter((t) => t.id !== clickInfo.event.id));

      deleteTask(clickInfo.event.id);
    }
  };

  const handleDateClick = (e) => {
    setSelectedDate(e.dateStr);
    setOpenAdd(true);
  };

  const handleAdd = (e) => {
    e.preventDefault();

    let label = "Do Now";
    if (urgentRef.current.checked && !importantRef.current.checked) {
      label = "Delegate";
    } else if (!urgentRef.current.checked && importantRef.current.checked) {
      label = "Decide Later";
    } else if (!urgentRef.current.checked && !importantRef.current.checked) {
      label = "Delete";
    }

    createTask({
      text: textRef.current.value,
      label: label,
      dueDate: dayjs(selectedDate.concat("", "T20:00:00.000Z")),
    });

    setSelectedDate("");
    setOpenAdd(false);
  };

  useEffect(() => {
    if (!newTask) return;
    setEvents([
      ...events,
      {
        start: newTask.dueDate.split("T")[0],
        title: newTask.text,
        id: newTask._id,
        label: newTask.label,
        isDone: newTask.isDone,
      },
    ]);
  }, [newTask]);

  useEffect(() => {
    getTasks();
  }, [events]);

  return (
    <div className="pages-root">
      <Sidebar />
      <div className="room">
        <FullCalendar
          height="100vh"
          plugins={[dayGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
        />
        <Dialog
          open={openAdd}
          onClose={() => {
            setOpenAdd(false);
          }}
        >
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
            <Button onClick={handleAdd}>Add</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
