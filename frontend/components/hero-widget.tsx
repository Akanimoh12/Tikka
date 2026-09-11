"use client";

import { TikkaWidget } from "@tikka/widget/react";

export function HeroWidget() {
  return (
    <div className="w-full max-w-[440px]">
      <TikkaWidget market="BTC-USD" window="15m" theme="auto" size="full" />
    </div>
  );
}
