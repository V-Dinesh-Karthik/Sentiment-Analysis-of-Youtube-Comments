import { Link, Outlet, useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import IconDark from "@/components/icon-dark";
import IconLight from "@/components/icon";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Layout = () => {
  const { theme } = useTheme();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleIconClick = () => {
    navigate("/");
  };

  return (
    <div className="grid grid-rows-2 grid-flow-row gap-y-4">
      <div className="mt-4 mr-4 ml-4 row-span-full">
        <nav className="flex justify-between items-center space-x-2">
          {theme === "dark" ? (
            <Button
              className="pl-0 pr-0"
              variant={"ghost"}
              onClick={handleIconClick}
            >
              <IconDark></IconDark>
            </Button>
          ) : (
            <Button
              className="pl-0 pr-0"
              variant={"ghost"}
              onClick={handleIconClick}
            >
              <IconLight></IconLight>
            </Button>
          )}
          <ul className="flex space-x-2 border rounded-md shadow-md flex-grow ">
            <li className="px-1 py-2 pl-2 mt-1 ml-1 mb-1  hover:bg-slate-900 hover:rounded-md">
              <Link to="/home" className="pr-1">
                Home
              </Link>
            </li>

            {auth?.isAuthenticated === false && (
              <li className="px-1 py-2 pr-2 mt-1 ml-1 mb-1  hover:bg-slate-900 hover:rounded-md">
                <Link to="/login" className="pl-1">
                  Log in
                </Link>
              </li>
            )}

            {auth.isAuthenticated === false && (
              <li className="px-1 py-2 pr-2 mt-1 ml-1 mb-1  hover:bg-slate-900 hover:rounded-md">
                <Link to="/register" className="pl-1">
                  Register
                </Link>
              </li>
            )}

            {auth?.isAuthenticated !== false && (
              <li className="px-1 py-2 pr-2 mt-1 ml-1 mb-1  hover:bg-slate-900 hover:rounded-md">
                <Link to="/logout" className="pl-1">
                  Log out
                </Link>
              </li>
            )}
          </ul>
          {/* <ul className="flex space-x-2 items-center">
            <li className="relative">
              <ModeToggle />
            </li>
          </ul> */}
          <div>
            <ModeToggle />
          </div>
        </nav>
      </div>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
