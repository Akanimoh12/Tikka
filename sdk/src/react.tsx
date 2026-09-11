import { useEffect, useRef } from "react";
import { mountTikkaWidget } from "./core-widget.js";
import type {
  ConnectedEventDetail,
  ErrorEventDetail,
  SettledEventDetail,
  Size,
  SubmittedEventDetail,
  Theme,
} from "./types.js";

export interface TikkaWidgetProps {
  market: string;
  window: string;
  theme?: Theme;
  size?: Size;
  onConnected?: (detail: ConnectedEventDetail) => void;
  onSubmitted?: (detail: SubmittedEventDetail) => void;
  onSettled?: (detail: SettledEventDetail) => void;
  onError?: (detail: ErrorEventDetail) => void;
}

export function TikkaWidget(props: TikkaWidgetProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const { market, window: windowLabel, theme = "auto", size = "compact" } = props;
  const callbacksRef = useRef(props);
  callbacksRef.current = props;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const mounted = mountTikkaWidget(
      host,
      { market, window: windowLabel, theme, size },
      {
        onConnected: (detail) => callbacksRef.current.onConnected?.(detail),
        onSubmitted: (detail) => callbacksRef.current.onSubmitted?.(detail),
        onSettled: (detail) => callbacksRef.current.onSettled?.(detail),
        onError: (detail) => callbacksRef.current.onError?.(detail),
      }
    );

    return () => {
      mounted.destroy();
    };
  }, [market, windowLabel, theme, size]);

  return <div ref={hostRef} />;
}
