import Link from "next/link";

const GITHUB_URL = "https://github.com/tikka-dev/tikka";

export default function Footer() {
  return (
    <footer className="border-t-2 border-[var(--of-ink)] px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-4">
      <span className="font-[family-name:var(--font-space-grotesk)] text-sm font-extrabold">
        Tikka
      </span>
      <nav className="flex items-center gap-4 sm:gap-6">
        <Link href="/docs" className="text-sm font-semibold">
          Docs
        </Link>
        <Link href="/playground" className="text-sm font-semibold">
          Playground
        </Link>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold"
        >
          GitHub
        </a>
      </nav>
    </footer>
  );
}
