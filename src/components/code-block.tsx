import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  lang?: string;
  filename?: string;
}

export function CodeBlock({ code, lang = "ts", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="group relative my-4">
      {(filename || lang) && (
        <div className="flex items-center justify-between px-4 py-2 rounded-t-lg border border-b-0 border-code-border bg-card/60">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
            </div>
            <span className="font-mono text-xs text-muted-foreground ml-2">
              {filename ?? lang}
            </span>
          </div>
          <button
            onClick={copy}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      )}
      <pre className={`code-block ${filename || lang ? "rounded-t-none" : ""}`}>
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  );
}

// Minimal token highlighter — no external lib, safe input.
function highlight(src: string) {
  const esc = src
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return esc
    .replace(/(\/\/[^\n]*)/g, '<span style="color:oklch(0.58 0.02 250)">$1</span>')
    .replace(/(["'`])((?:\\.|(?!\1).)*)\1/g, '<span style="color:oklch(0.82 0.14 145)">$1$2$1</span>')
    .replace(/\b(import|from|export|const|let|var|function|return|async|await|if|else|new|type|interface|default|class|extends)\b/g,
      '<span style="color:oklch(0.78 0.16 30)">$1</span>')
    .replace(/\b(true|false|null|undefined)\b/g, '<span style="color:oklch(0.78 0.14 195)">$1</span>')
    .replace(/\b(\d+)\b/g, '<span style="color:oklch(0.82 0.13 60)">$1</span>');
}
