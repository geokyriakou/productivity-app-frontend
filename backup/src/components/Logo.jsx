import { Link } from "react-router-dom";

export default function Logo() {
  return (
    <div className=" logo-4">
      <Link to="/" style={{ textDecoration: "none" }}>
        <h3>PomoShare</h3>
      </Link>
    </div>
  );
}
