import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProfileRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return <div>{currentUser ? <Outlet /> : <Navigate to={"/sign-in"} />}</div>;
}
