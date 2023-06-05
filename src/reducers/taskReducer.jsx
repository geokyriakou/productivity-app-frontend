import dayjs from "dayjs";

export function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added": {
      return [
        ...tasks,
        {
          _id: action._id,
          text: action.text,
          isDone: false,
          label: action.label,
          dueDate: dayjs(action.dueDate),
        },
      ];
    }
    case "changed": {
      return tasks.map((t) => {
        if (t._id === action.task._id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case "deleted": {
      return tasks.filter((t) => t._id !== action._id);
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}
