//import { useState } from "react"
import { useAuth } from "./hooks/useAuth";
import { Link } from "react-router-dom";
import { ModeToggle } from "./components/mode-toggle";

function App() {
  const { auth } = useAuth();
  return (
    <>
      <h1 className="text-3xl text-center">Hello React!</h1>
      {auth?.user?.username ? (
        <h1 className="text-3xl text-center">
          Logged in as {auth?.user?.username}
          Email is {auth?.user?.email}
        </h1>
      ) : (
        <h1 className="text-3xl text-center">Not Logged in</h1>
      )}
    </>
  );
}

export default App;
