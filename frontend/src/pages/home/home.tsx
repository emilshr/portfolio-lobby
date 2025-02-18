import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { CalendarIcon, MapPin } from "lucide-react";
import {
  SiGithub,
  SiLinkedin,
  SiGmail,
  SiX,
} from "@icons-pack/react-simple-icons";
import { Articles } from "./articles";
import { Work } from "./work";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const About = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4">
      <div className="font-medium text-lg">About</div>
      <div className="block col-span-3">
        A passionate motorcyclist & a web developer. I specialize in building
        things for the web. I'm currently working as a Full stack developer at
        <SigtechHoverCard />
        working on refining their product in the fintech domain.
      </div>
    </div>
  );
};

export const Home = () => {
  return (
    <div className="flex flex-col gap-y-8 mb-4">
      <About />
      <Work />
      <Articles />
      <SocialLinks />
      <hr />
      <Pictures />
    </div>
  );
};

const SocialLinks = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4">
      <h2 className="font-medium text-lg">Links</h2>
      <div className="flex flex-col gap-y-2 col-span-3">
        <a href="https://github.com/emilshr" target="_blank" className="group">
          <span className="flex justify-between items-center">
            <p className="group-hover:underline">@emilshr</p>
            <SiGithub size="14" />
          </span>
        </a>
        <a
          href="https://www.linkedin.com/in/emilsharier/"
          target="_blank"
          className="group"
        >
          <span className="flex justify-between items-center">
            <p className="group-hover:underline">@emilsharier</p>
            <SiLinkedin size="14" />
          </span>
        </a>
        <a href="https://x.com/EmilSharier" target="_blank" className="group">
          <span className="flex justify-between items-center">
            <p className="group-hover:underline">@emilsharier</p>
            <SiX size="14" />
          </span>
        </a>
        <a
          href="mailto:emil.sharier.dev@gmail.com"
          target="_blank"
          className="group"
        >
          <span className="flex justify-between items-center">
            <p className="group-hover:underline">@emil.sharier.dev</p>
            <SiGmail size="14" />
          </span>
        </a>
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

const Pictures = () => {
  return (
    <div className="grid grid-cols-5 md:h-[400px] h-[200px] gap-4 overflow-hidden">
      <div className="relative h-full w-full col-span-2 rounded-md object-cover group">
        <LazyLoadImage
          src="/assets/me.png"
          alt="Atop Illikkal Kallu, Kottayam"
          className="z-10 h-full w-full object-cover rounded-md"
          wrapperClassName="z-10 h-full w-full object-cover rounded-md"
          loading="lazy"
          effect="blur"
        />
        <div className="z-20 absolute transform duration-500 -bottom-10 left-2 group-hover:bottom-2">
          <span className="flex gap-x-2 rounded-sm bg-black-glass-60 px-2 py-1 text-muted-foreground text-xs">
            <MapPin size="14" />
            <p>Atop Illikkal Kallu, Kottayam</p>
          </span>
        </div>
      </div>
      <div className="relative h-full w-full col-span-3 rounded-md object-cover group">
        <LazyLoadImage
          src="/assets/uluppunni.png"
          alt="Divine sunset at Uluppunni, Kottayam"
          className="z-10 h-full w-full col-span-3 rounded-md"
          wrapperClassName="z-10 h-full w-full col-span-3 rounded-md"
          loading="lazy"
          effect="blur"
        />
        <div className="z-20 absolute transform duration-500 -bottom-20 left-2 group-hover:bottom-2">
          <span className="flex gap-x-2 rounded-sm bg-black-glass-60 px-2 py-1 text-muted-foreground text-xs">
            <MapPin size="14" />
            <p>Divine sunset at Uluppunni, Kottayam</p>
          </span>
        </div>
      </div>
    </div>
  );
};
