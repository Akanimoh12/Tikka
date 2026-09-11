import Link from "next/link";

const GITHUB_URL = "https://github.com/tikka-dev/tikka";

export default function Footer() {
  return (
    <footer className="border-t-2 border-[var(--of-ink)] px-5 sm:px-8 py-8 flex flex-wrap items-center justify-between gap-4">
      <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-extrabold">
        Tikka
      </span>
      <nav className="flex items-center gap-5 sm:gap-8">
        <Link href="/docs" className="text-base font-bold">
          Docs
        </Link>
        <Link href="/playground" className="text-base font-bold">
          Playground
        </Link>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base font-bold"
        >
          GitHub
        </a>
      </nav>
    </footer>
  );
}
