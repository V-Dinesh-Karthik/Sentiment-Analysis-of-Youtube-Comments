import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Logout = () => {
  const { auth, setAuth } = useAuth();
  const username = auth?.user?.username;

  useEffect(() => {
    setAuth({ user: null, isAuthenticated: false });
  }, [setAuth]);

  return (
    <div>
      <h1>Thank you for using Zeta! {username}</h1>
      <h2>Hope to see you again!</h2>
    </div>
  );
};

export default Logout;
