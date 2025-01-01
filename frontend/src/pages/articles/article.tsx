import { useParams } from "react-router";
import Markdown from "react-markdown";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "@/components/theme-provider";
import remarkGfm from "remark-gfm";

export const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    import(`../../blog/${slug}.md`).then((res) => {
      fetch(res.default)
        .then((response) => response.text())
        .then((response) => {
          setContent(response);
          setLoading(false);
        });
    });
  }, [slug]);

  if (loading) {
    return <>loading</>;
  }

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
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
            <div className="flex flex-col gap-y-1 pb-4">
              <p
                className="text-lg dark:text-slate-300 text-slate-600"
                {...props}
              />
              <hr />
            </div>
          );
        },
        a(props) {
          return (
            <a
              className="dark:text-blue-400 underline decoration-dotted dark:hover:text-blue-600 text-blue-600 hover:text-blue-400"
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
          return <p className="pb-6 leading-5" {...props} />;
        },
        ul(props) {
          return <ul className="pl-4 list-disc space-y-1" {...props} />;
        },
      }}
    >
      {content}
    </Markdown>
  );
};
