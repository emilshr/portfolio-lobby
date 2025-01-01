import { BLOGS } from "@/blog/config";
import { NavLink } from "react-router";

export const Articles = () => {
  return (
    <div className="flex flex-col gap-y-3">
      <p className="text-lg font-bold">Articles</p>
      <ul className="pl-4 list-disc space-y-1">
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
