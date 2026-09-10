import Image from "next/image";
import Link from "next/link";

const GITHUB_URL = "https://github.com/tikka-dev/tikka";

export default function Header() {
  return (
    <header className="of-header px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Image
          src="/tikka-icon.svg"
          alt="Tikka logo"
          width={36}
          height={36}
          style={{ filter: "drop-shadow(4px 4px 0 var(--of-ink))" }}
          priority
        />
        <Link
          href="/"
          className="font-[family-name:var(--font-space-grotesk)] text-xl sm:text-2xl font-extrabold tracking-tight"
        >
          Tikka
        </Link>
      </div>
      <nav className="flex items-center gap-3 sm:gap-6 pr-2">
        <Link
          href="/docs"
          className="hidden sm:inline-block font-semibold text-sm sm:text-base"
        >
          Docs
        </Link>
        <Link
          href="/playground"
          className="hidden sm:inline-block font-semibold text-sm sm:text-base"
        >
          Playground
        </Link>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-block font-semibold text-sm sm:text-base"
        >
          GitHub
        </a>
        <button
          type="button"
          className="border-2 border-[var(--of-ink)] bg-[var(--of-yellow)] px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base font-extrabold rounded-none transition-transform duration-100 hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px]"
          style={{ boxShadow: "4px 4px 0 var(--of-ink)" }}
        >
          Connect Wallet
        </button>
      </nav>
    </header>
  );
}
