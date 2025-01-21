import { SiGithub } from "@icons-pack/react-simple-icons";
import { CloudHail, Code, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <div className="flex flex-col gap-y-2 text-xs">
      <span className="flex gap-x-2 items-center">
        <Heart size="12" />
        <p className="block">
          Built by&nbsp;
          <a
            href="https://github.com/emilshr"
            className="inline dark:text-white text-gray-700 hover:underline"
            target="_blank"
          >
            Emil Sharier
          </a>
        </p>
      </span>
      <span className="flex gap-x-2 items-center">
        <Code size="12" />
        <p className="flex gap-x-[0.5ch]">
          Built with
          <a
            href="https://react.dev/"
            className="inline dark:text-white text-gray-700 hover:underline"
            target="_blank"
          >
            React,
          </a>
          <a
            href="https://tailwindcss.com/"
            className="inline dark:text-white text-gray-700 hover:underline"
            target="_blank"
          >
            Tailwind,
          </a>
          <p>&</p>
          <a
            href="https://go.dev/"
            className="inline dark:text-white text-gray-700 hover:underline"
            target="_blank"
          >
            GoLang
          </a>
        </p>
      </span>
      <span className="flex gap-x-2 items-center">
        <SiGithub size="12" />
        <p className="flex gap-x-[0.5ch]">
          Source code available on
          <a
            href="https://github.com/emilshr/portfolio-lobby"
            className="inline dark:text-white text-gray-700 hover:underline"
            target="_blank"
          >
            Github
          </a>
        </p>
      </span>
      <span className="flex gap-x-2 items-center">
        <CloudHail size="12" />
        <p className="flex gap-x-[0.5ch]">
          Hosted on
          <a
            href="https://vercel.com"
            className="inline dark:text-white text-gray-700 hover:underline"
            target="_blank"
          >
            Vercel
          </a>
          <p>&</p>
          <a
            href="https://render.com"
            className="inline dark:text-white text-gray-700 hover:underline"
            target="_blank"
          >
            Render
          </a>
        </p>
      </span>
    </div>
  );
};
