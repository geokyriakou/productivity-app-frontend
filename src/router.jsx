import { Outlet, createBrowserRouter } from "react-router-dom";
import AuthLayout from "./pages/layouts/AuthLayout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Pomodoro } from "./pages/Pomodoro";
import { Tasks } from "./pages/Tasks";
import { PriorityMatrix } from "./pages/Tasks";
import { Calendar } from "./pages/Calendar";
import { Leaderboard } from "./pages/Leaderboard";
import { Profile } from "./pages/Profile";
import { Home } from "./pages/Home";
import { UpdatePassword } from "./pages/UpdatePassword";
import { ConfirmEmail } from "./pages/ConfirmEmail";
import { AuthProvider } from "./context/AuthContext";
import { RootLayout } from "./pages/layouts/RootLayout";
import { TaskProvider } from "./context/TaskContext";
import { PomodoroProvider } from "./context/PomodoroContext";
import { SocketProvider } from "./context/SocketContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateForm = ({ match }) => (
  <UpdatePassword userId={match.params.userId} token={match.params.token} />
);

export const router = createBrowserRouter([
  {
    element: <ContextWrapper />,
    children: [
      {
        path: "/",
        element: <RootLayout />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "tasks", element: <Tasks eisen={false} /> },
          { path: "matrix", element: <PriorityMatrix /> },
          { path: "calendar", element: <Calendar /> },
          { path: "pomo", element: <Pomodoro /> },
          { path: "leaderboard", element: <Leaderboard /> },
        ],
      },
      {
        path: "/",
        element: <AuthLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          {
            path: "password/reset/:id/:token",
            element: <UpdatePassword />,
          },
          {
            path: ":id/confirm",
            element: <ConfirmEmail />,
          },
        ],
      },
    ],
  },
]);

function ContextWrapper() {
  return (
    <AuthProvider>
      <TaskProvider>
        <SocketProvider>
          <PomodoroProvider>
            <Outlet />
            <ToastContainer />
          </PomodoroProvider>
        </SocketProvider>
      </TaskProvider>
    </AuthProvider>
  );
}
