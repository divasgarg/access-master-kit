import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function DocsToc({ pathname }: { pathname: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    // Defer to next frame so the route's article is mounted.
    const id = window.setTimeout(() => {
      const article = document.querySelector("article");
      if (!article) return setHeadings([]);
      const found: Heading[] = [];
      article.querySelectorAll("h2, h3").forEach((el) => {
        const text = el.textContent?.trim() ?? "";
        if (!text) return;
        if (!el.id) el.id = slugify(text);
        found.push({ id: el.id, text, level: el.tagName === "H2" ? 2 : 3 });
      });
      setHeadings(found);

      if (found.length === 0) return;
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting);
          if (visible.length > 0) setActive(visible[0].target.id);
        },
        { rootMargin: "-80px 0px -70% 0px" },
      );
      found.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) observer.observe(el);
      });
      return () => observer.disconnect();
    }, 50);
    return () => window.clearTimeout(id);
  }, [pathname]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-20">
        <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
          On this page
        </div>
        <nav className="space-y-1 text-sm border-l border-border">
          {headings.map((h) => (
            <a
              key={h.id}
              href={`#${h.id}`}
              className={`block border-l-2 -ml-px py-1 transition-colors ${
                h.level === 3 ? "pl-6" : "pl-3"
              } ${
                active === h.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {h.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
