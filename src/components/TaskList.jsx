import { useState } from "react";
import { Task } from "./Task";
import { useEffect } from "react";

export function TaskList({ label, word, tasks, onChangeTask, onDeleteTask }) {
  const [dragged, setDragged] = useState();

  const handleDragStart = (e, todo) => {
    setDragged(todo);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, type) => {
    e.preventDefault();

    onChangeTask({ ...dragged, label: type });
  };

  return (
    <ul style={{ listStyle: "none" }}>
      {/* {!tasks && <li> </li>}  // for draggable*/}
      {tasks
        .filter((todo) => todo.label === label)
        .filter(
          (todo) => todo.text.toLowerCase().indexOf(word.toLowerCase()) !== -1
        )
        .map((todo) => {
          return (
            <li
              draggable
              onDragStart={(e) => handleDragStart(e, todo)}
              onDragOver={(e) => handleDragOver(e)}
              onDrop={(e) => handleDrop(e, todo.label)}
              key={todo._id}
              className="todo"
            >
              <Task
                todo={todo}
                onChangeTask={onChangeTask}
                onDeleteTask={onDeleteTask}
              />
            </li>
          );
        })}
    </ul>
  );
}
