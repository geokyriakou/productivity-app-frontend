import { Outlet } from "react-router-dom";
import Logo from "../../components/Logo";

function AuthLayout() {
  return (
    <>
      <Logo />
      <Outlet />
    </>
  );
}

export default AuthLayout;
