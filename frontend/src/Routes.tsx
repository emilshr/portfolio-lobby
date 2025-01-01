import { Route, Routes } from "react-router";
import { Home } from "./pages/home/home";
import { Lobby } from "./pages/lobby/lobby";
import { NotFound } from "./pages/404/404";
import { Article } from "./pages/articles/article";

export const RoutesWrapper = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFound />} />

      <Route path="/" element={<Home />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/articles/:slug" element={<Article />} />
    </Routes>
  );
};
