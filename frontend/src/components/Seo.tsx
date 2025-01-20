import { Helmet } from "react-helmet";

type Props = {
  title: string;
  keywords?: string[];
  description: string;
};

export const Seo = ({ description, title, keywords }: Props) => {
  return (
    <Helmet>
      <title>{title || "Emil"}</title>
      <meta name="title" property="og:title" content={title || "Emil"} />
      <meta name="type" property="og:type" content="website" />
      <meta
        name="description"
        property="og:description"
        content={description || undefined}
      />
      <meta
        name="image"
        property="og:image"
        content="https://www.emilshr.com/assets/uluppunni.png"
      />
      <meta name="author" property="og:author" content="Emil Sharier" />
      <meta
        name="keywords"
        property="og:keywords"
        content={keywords?.join(",") || undefined}
      />
    </Helmet>
  );
};
