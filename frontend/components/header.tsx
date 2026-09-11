import Image from "next/image";
import Link from "next/link";
import { ConnectWalletButton } from "./connect-wallet-button";

const GITHUB_URL = "https://github.com/tikka-dev/tikka";

export default function Header() {
  return (
    <header className="of-header px-5 sm:px-10">
      <div className="flex items-center gap-3.5">
        <Image
          src="/tikka-icon.svg"
          alt="Tikka logo"
          width={52}
          height={52}
          style={{ filter: "drop-shadow(4px 4px 0 var(--of-ink))" }}
          priority
        />
        <Link
          href="/"
          className="font-[family-name:var(--font-space-grotesk)] text-[1.9rem] font-black tracking-tight"
        >
          Tikka
        </Link>
      </div>
      <nav className="flex items-center gap-6 sm:gap-10">
        <Link
          href="/docs"
          className="hidden text-lg font-extrabold sm:inline-block"
        >
          Docs
        </Link>
        <Link
          href="/playground"
          className="hidden text-lg font-extrabold sm:inline-block"
        >
          Playground
        </Link>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden text-lg font-extrabold sm:inline-block"
        >
          GitHub
        </a>
        <ConnectWalletButton />
      </nav>
    </header>
  );
}
