import { ExternalLinkIcon } from "lucide-react";

type WorkConfig = {
  company: string;
  companyUrl: string;
  description: string;
  title: string;
  startedAt: Date;
  endedAt?: Date;
};

const EXPERIENCE: WorkConfig[] = [
  {
    company: "Sigtech",
    companyUrl: "https://sigtech.com/",
    title: "Full Stack Developer",
    description:
      "Core contributor to the company's quantitative analysis web platform",
    startedAt: new Date("09/20/2023"),
  },
  {
    company: "Vamstar",
    companyUrl: "https://vamstar.io/",
    title: "Software Engineer",
    startedAt: new Date("05/03/2021"),
    description:
      "Helped develop MEAT (Most economically advantageous Tender), which is a framework that permits the user to understand the likelihood of winning a bid",
    endedAt: new Date("05/20/2023"),
  },
  {
    company: "Nybula",
    companyUrl: "https://nbyula.com/",
    title: "Software Engineer Intern",
    startedAt: new Date("11/05/2020"),
    description:
      "Helped design and develop a web based online interview platform called Talent Identification platform",
    endedAt: new Date("02/02/2021"),
  },
  {
    company: "Prixgen",
    companyUrl: "https://www.prixgen.com/",
    title: "Development Intern",
    startedAt: new Date("04/01/2020"),
    description:
      "Built a cross platform mobile app which will connect to the company's ODOO instances to pull relevant products, manage orders, get order status etc.",
    endedAt: new Date("06/01/2020"),
  },
];

export const Work = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4">
      <p className="font-medium text-lg">Work</p>
      <ul className="space-y-4 col-span-3">
        {EXPERIENCE.map(
          ({ title, company, companyUrl, startedAt, endedAt, description }) => (
            <div className="flex flex-col gap-y-1" key={company}>
              <div>
                <div className="flex gap-x-2 items-center">
                  <div className="text-sm font-bold">{title}</div>
                  <p>-</p>
                  <a
                    href={companyUrl}
                    target="_blank"
                    className="flex gap-x-1 items-center hover:underline decoration-dotted dark:text-gray-300 dark:hover:text-gray-200 text-gray-500 hover:text-gray-800 pr-2"
                  >
                    <span>{company}</span>
                    <ExternalLinkIcon size="15" className="text-muted" />
                  </a>
                </div>
                <p className="flex items-center text-xs text-muted-foreground">
                  {`${startedAt.toLocaleString("default", {
                    month: "short",
                  })} ${startedAt.getFullYear()} `}
                  {endedAt
                    ? `- ${endedAt.toLocaleString("default", {
                        month: "short",
                      })} ${endedAt.getFullYear()}`
                    : " - Present"}
                </p>
              </div>
              <span className="dark:text-slate-400 text-slate-600 leading-relaxed">
                {description}
              </span>
            </div>
          )
        )}
      </ul>
    </div>
  );
};
