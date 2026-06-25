import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "@/components/code-block";
import { Heart, GitBranch, MessageCircle, Bug } from "lucide-react";

export const Route = createFileRoute("/docs/contributing")({
  head: () => ({
    meta: [
      { title: "Contributing — next-auth-toolkit" },
      { name: "description", content: "How to contribute to next-auth-toolkit: setup, code style, PRs, and reporting bugs." },
      { property: "og:title", content: "Contributing Guide" },
      { property: "og:description", content: "Help build the future of Next.js authentication." },
    ],
  }),
  component: Contributing,
});

const ways = [
  { icon: Bug, title: "Report a bug", desc: "Open an issue with a minimal reproduction repo." },
  { icon: GitBranch, title: "Send a PR", desc: "Fork, branch from main, run tests, submit." },
  { icon: MessageCircle, title: "Answer questions", desc: "Help others in GitHub Discussions and Discord." },
  { icon: Heart, title: "Sponsor", desc: "Back the project via GitHub Sponsors to fund development." },
];

function Contributing() {
  return (
    <article>
      <div className="chip mb-4">Community</div>
      <h1 className="font-display text-4xl font-semibold tracking-tight">Contributing</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        next-auth-toolkit is built by the community, for the community. Here's how to get involved.
      </p>

      <div className="mt-10 grid sm:grid-cols-2 gap-3">
        {ways.map((w) => (
          <div key={w.title} className="p-4 rounded-lg border border-border bg-card/60">
            <div className="h-8 w-8 rounded-md flex items-center justify-center bg-primary/10 ring-1 ring-primary/25 mb-3">
              <w.icon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="font-semibold text-sm">{w.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{w.desc}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl font-semibold mt-12 mb-3">Development setup</h2>
      <CodeBlock filename="terminal" code={`git clone https://github.com/your-org/next-auth-toolkit
cd next-auth-toolkit
pnpm install
pnpm dev      # runs the docs site + playground
pnpm test     # runs the full test suite
pnpm build    # builds all packages`} />

      <h2 className="font-display text-2xl font-semibold mt-10 mb-3">Code style</h2>
      <ul className="list-disc list-inside space-y-1.5 text-muted-foreground text-sm">
        <li>TypeScript everywhere, <code className="text-primary">strict: true</code></li>
        <li>Format with Prettier, lint with ESLint — run <code className="text-primary">pnpm fmt</code></li>
        <li>Public APIs require TSDoc and at least one usage example in the docs</li>
        <li>Every new feature ships with tests (unit + integration)</li>
      </ul>

      <h2 className="font-display text-2xl font-semibold mt-10 mb-3">Pull requests</h2>
      <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground text-sm">
        <li>Branch from <code className="text-primary">main</code> using <code className="text-primary">feat/</code> or <code className="text-primary">fix/</code> prefixes</li>
        <li>Add a changeset: <code className="text-primary">pnpm changeset</code></li>
        <li>Ensure <code className="text-primary">pnpm test &amp;&amp; pnpm build</code> pass locally</li>
        <li>Open the PR with a clear description and a screenshot/recording if UI is involved</li>
      </ol>

      <h2 className="font-display text-2xl font-semibold mt-10 mb-3">Code of conduct</h2>
      <p className="text-muted-foreground text-sm">
        We follow the Contributor Covenant. Be kind, give credit, and assume good faith. Maintainers reserve the right to
        remove comments or contributions that don't align.
      </p>
    </article>
  );
}
