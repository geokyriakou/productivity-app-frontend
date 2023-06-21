import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Logo from "../../components/Logo";

export function RootLayout() {
  const { user } = useContext(AuthContext);

  if (user === null) return <Navigate to="/login" />;

  return (
    <>
      <Logo />
      <Outlet />
    </>
  );
}
