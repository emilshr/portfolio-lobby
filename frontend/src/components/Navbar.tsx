import { SquareTerminal } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { ToggleTheme } from "./toggle-theme";

export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between w-full md:max-w-[80ch] pt-5 sm:pt-16">
      <p
        className="flex gap-x-2 items-center text-2xl cursor-pointer"
        onClick={(event) => {
          event.stopPropagation();
          navigate("/");
        }}
      >
        Emil
        <SquareTerminal size="20" />
      </p>
      <span className="flex gap-x-2 items-center">
        <GuestLobby />
        <ToggleTheme />
      </span>
    </nav>
  );
};

const GuestLobby = () => {
  return (
    <NavLink to="/lobby" className="hover:underline">
      Guestbook
    </NavLink>
  );
};
