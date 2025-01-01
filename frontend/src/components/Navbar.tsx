import { useNavigate } from "react-router";
import { ToggleTheme } from "./toggle-theme";

export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between w-full md:max-w-[80ch] pt-5 sm:pt-16">
      <p
        className="text-2xl font-bold cursor-pointer"
        onClick={(event) => {
          event.stopPropagation();
          navigate("/");
        }}
      >
        Emil
      </p>
      <ToggleTheme />
    </nav>
  );
};
