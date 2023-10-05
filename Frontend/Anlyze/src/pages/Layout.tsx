import { Link, Outlet } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";

const Layout = () => {
  return (
    <div>
      <div className="m-4">
        <nav className="flex justify-between space-x-2 ">
          <ul className="flex space-x-2 border rounded-md shadow-md flex-grow ">
            <li className="px-1 py-2 pl-2 mt-1 ml-1 mb-1  hover:bg-slate-900 hover:rounded-md">
              <Link to="/home" className="pr-1">
                Home
              </Link>
            </li>
            <li className="px-1 py-2 pr-2 mt-1 ml-1 mb-1  hover:bg-slate-900 hover:rounded-md">
              <Link to="/login" className="pl-1">
                Log in
              </Link>
            </li>
          </ul>
          <ul className="flex space-x-2 items-center">
            <li className="relative">
              <ModeToggle />
            </li>
          </ul>
        </nav>
      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
