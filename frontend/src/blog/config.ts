type BlogConfig = {
  title: string;
  slug: string;
  publishedOn: Date;
};

export const BLOGS: BlogConfig[] = [
  {
    title: "Enhancing developer productivity",
    slug: "enhancing-developer-productivity",
    publishedOn: new Date("2024-01-06T07:48:18Z"),
  },
  {
    title: "Learning Golang as a Typescript dev",
    slug: "golang-for-typescript-devs",
    publishedOn: new Date("2024-02-18T08:43:44.076Z"),
  },
  {
    title: "I'm not sure I like serverless",
    slug: "how-serverless-almost-screwed-me-over",
    publishedOn: new Date("2024-02-15T18:33:45.142Z"),
  },
  {
    title: "Nest.js is interesting",
    slug: "nestjs-is-interesting",
    publishedOn: new Date("2024-01-11T19:21:40.810Z"),
  },
];
