"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ConnectWalletButton } from "./connect-wallet-button";

const GITHUB_URL = "https://github.com/tikka-dev/tikka";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="of-mobile-nav"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border-2 border-[var(--of-ink)] bg-[var(--of-paper)] sm:hidden"
        >
          <span
            className="block h-[2px] w-5 bg-[var(--of-ink)] transition-transform duration-150"
            style={
              menuOpen
                ? { transform: "translateY(4px) rotate(45deg)" }
                : undefined
            }
          />
          <span
            className="block h-[2px] w-5 bg-[var(--of-ink)] transition-opacity duration-150"
            style={menuOpen ? { opacity: 0 } : undefined}
          />
          <span
            className="block h-[2px] w-5 bg-[var(--of-ink)] transition-transform duration-150"
            style={
              menuOpen
                ? { transform: "translateY(-4px) rotate(-45deg)" }
                : undefined
            }
          />
        </button>
      </nav>
      {menuOpen ? (
        <div
          id="of-mobile-nav"
          className="absolute left-0 right-0 top-full flex flex-col border-2 border-t-0 border-[var(--of-ink)] bg-[var(--of-paper)] of-shadow-sm sm:hidden"
        >
          <Link
            href="/docs"
            onClick={() => setMenuOpen(false)}
            className="border-b-2 border-[var(--of-ink)] px-5 py-4 text-lg font-extrabold"
          >
            Docs
          </Link>
          <Link
            href="/playground"
            onClick={() => setMenuOpen(false)}
            className="border-b-2 border-[var(--of-ink)] px-5 py-4 text-lg font-extrabold"
          >
            Playground
          </Link>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="px-5 py-4 text-lg font-extrabold"
          >
            GitHub
          </a>
        </div>
      ) : null}
    </header>
  );
}
