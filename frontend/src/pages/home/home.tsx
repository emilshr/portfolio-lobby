import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { CalendarIcon } from "lucide-react";
import {
  SiFacebook,
  SiGithub,
  SiLinkedin,
  SiGmail,
  SiX,
} from "@icons-pack/react-simple-icons";
import { Articles } from "./articles";
import { NavLink } from "react-router";

const GuestLobby = () => {
  return (
    <div className="block">
      <NavLink
        className="inline-block pr-1 text-blue-400 hover:text-blue-600 dark:text-blue-600 dark:hover:text-blue-400"
        to="/lobby"
      >
        Click here
      </NavLink>
      <p className="inline-block">to visit the guest lobby</p>
    </div>
  );
};

export const Home = () => {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="block">
        I specialize in building things for the web. I'm currently working as a
        Full stack developer at
        <SigtechHoverCard />
        working on refining their product in the fintech domain.
      </div>
      <GuestLobby />
      <Articles />
      <SocialLinks />
    </div>
  );
};

const SocialLinks = () => {
  return (
    <div className="flex gap-x-2 items-center">
      <h2>Social links:</h2>
      <div className="flex gap-x-2">
        <Button variant="ghost" size="icon">
          <SiFacebook />
        </Button>
        <Button variant="ghost" size="icon">
          <SiGithub />
        </Button>
        <Button variant="ghost" size="icon">
          <SiLinkedin />
        </Button>
        <Button variant="ghost" size="icon">
          <SiX />
        </Button>
        <Button variant="ghost" size="icon">
          <SiGmail />
        </Button>
      </div>
    </div>
  );
};

const SigtechHoverCard = () => {
  return (
    <HoverCard closeDelay={500}>
      <HoverCardTrigger>
        <p className="underline inline-block px-1">Sigtech,</p>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://sigtech.com/wp-content/uploads/2023/01/cropped-Sigtech-favicon-green-on-black-512-1-100x100.png" />
            <AvatarFallback>SG</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <a
              className="text-sm font-semibold hover:underline"
              href="https://sigtech.com"
              target="_blank"
            >
              @sigtech
            </a>
            <p className="text-sm">
              SigTech is a cutting-edge fintech platform blending AI and
              quantitative analysis for market professionals, including quants.
            </p>
            <div className="flex items-center pt-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined September 2023
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
