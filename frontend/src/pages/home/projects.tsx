import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

type Project = {
  link: string;
  icon: string;
  label: string;
  description: string;
  avatarFallback: string;
  linkLabel?: string;
};

type HoverCardWrapperProps = {
  label: string;
  link: string;
  linkLabel: string;
  avatarFallback: string;
  description: string;
  icon: string;
};

const HoverCardWrapper = ({
  description,
  label,
  link,
  linkLabel,
  avatarFallback,
  icon,
}: HoverCardWrapperProps) => {
  return (
    <HoverCard closeDelay={500}>
      <HoverCardTrigger>
        <a
          href={link}
          target="_blank"
          className="text-blue-400 hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-400"
        >
          {label}
        </a>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={icon} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <a
              className="text-sm font-semibold hover:underline"
              href={link}
              target="_blank"
            >
              {linkLabel}
            </a>
            <p className="text-sm">{description}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

const PROJECTS: Project[] = [
  {
    linkLabel: "@notifi",
    link: "https://github.com/emilshr/notifi-stack",
    description:
      "Notifi is an open source error collecting software that lets you view all the errors collected from your registered React flavored web applications.",
    icon: "https://www.notifi.site/favicon.ico",
    avatarFallback: "NT",
    label: "Notifi",
  },
];

export const Projects = () => {
  return (
    <div className="flex flex-col gap-y-3">
      <p className="text-lg font-bold">Projects</p>
      <ul className="pl-4 list-disc space-y-1">
        {PROJECTS.map(
          ({ avatarFallback, description, link, linkLabel, icon, label }) => (
            <li key={linkLabel}>
              <HoverCardWrapper
                avatarFallback={avatarFallback}
                description={description}
                label={label}
                link={link}
                linkLabel={linkLabel ? linkLabel : `@${label.toLowerCase()}`}
                icon={icon}
              />
            </li>
          )
        )}
      </ul>
    </div>
  );
};
