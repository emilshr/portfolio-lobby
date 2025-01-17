import { BLOGS } from "@/blog/config";
import { NavLink } from "react-router";

export const Articles = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4">
      <p className="font-medium text-lg">Articles</p>
      <ul className="col-span-3">
        {BLOGS.map(({ title, slug }) => (
          <li key={slug}>
            <NavLink
              to={`/articles/${slug}`}
              className="text-blue-400 hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-400"
            >
              {title}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
