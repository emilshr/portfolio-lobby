import { useNavigate, useParams } from "react-router";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@/components/theme-provider";
import remarkGfm from "remark-gfm";
import { Comments } from "./comments";
import { useAuthRefresher } from "@/auth/auth-refresher";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { Loader2 } from "lucide-react";
import { BLOGS } from "@/blog/config";
import { Seo } from "@/components/Seo";

export const Article = () => {
  useAuthRefresher();
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [foundBlog] = useState(BLOGS.find((arg) => arg.slug === slug));

  useEffect(() => {
    import(`../../blog/${slug}.md`)
      .then((res) => {
        fetch(res.default)
          .then((response) => response.text())
          .then((response) => {
            setContent(response);
            setLoading(false);
          });
      })
      .catch(() => {
        console.error("Article does not exist");
        navigate("/404");
      });
  }, [navigate, slug]);

  if (loading) {
    return (
      <div className="h-full flex items-center gap-x-2">
        <p>Loading article</p>
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Seo
        description={foundBlog?.description || ""}
        title={foundBlog?.title || "Article"}
        keywords={foundBlog?.keywords}
      />
      <div className="flex flex-col gap-y-8 pb-4">
        <Markdown
          remarkPlugins={[remarkGfm]}
          className="text-sm leading-7"
          components={{
            h1(props) {
              return (
                <div className="flex flex-col gap-y-2 pb-6">
                  <p className="text-3xl font-bold" {...props} />
                  <hr />
                </div>
              );
            },
            h2(props) {
              return (
                <div className="flex flex-col gap-y-1 pb-4">
                  <p
                    className="text-xl font-semibold dark:text-slate-300 text-slate-600"
                    {...props}
                  />
                  <hr />
                </div>
              );
            },
            h3(props) {
              return (
                <p
                  className="text-lg pb-2 dark:text-slate-300 text-slate-600 italic"
                  {...props}
                />
              );
            },
            a(props) {
              return (
                <a
                  className="dark:text-blue-400 underline decoration-dotted dark:hover:text-blue-600 text-blue-600 hover:text-blue-400"
                  target="_blank"
                  {...props}
                />
              );
            },
            code(props) {
              const { children, className, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <div className="pb-4">
                  <SyntaxHighlighter
                    PreTag="div"
                    wrapLongLines
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                    style={theme === "dark" ? oneDark : oneLight}
                    wrapLines
                    customStyle={{
                      fontSize: "14px",
                    }}
                  />
                </div>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
            p(props) {
              return <p className="pb-6" {...props} />;
            },
            ul(props) {
              return <ul className="pl-4 list-disc space-y-1" {...props} />;
            },
            img(props) {
              return (
                <LazyLoadImage
                  effect="blur"
                  loading="lazy"
                  wrapperClassName={props.className}
                  {...props}
                />
              );
            },
          }}
        >
          {content}
        </Markdown>
        <Comments />
      </div>
    </>
  );
};
