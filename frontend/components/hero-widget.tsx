"use client";

import { TikkaWidget } from "@tikka/widget/react";

export function HeroWidget() {
  return (
    <div className="w-full max-w-[400px] mx-auto lg:mx-0">
      <TikkaWidget market="BTC-USD" window="15m" theme="auto" size="compact" />
    </div>
  );
}
