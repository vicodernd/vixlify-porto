import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Copy text to the clipboard with a transient "copied" state.
 * Falls back to a hidden textarea when the Clipboard API is unavailable
 * (for example on plain http origins).
 */
export function useCopyToClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const copy = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), resetMs);
      return true;
    } catch {
      return false;
    }
  }, [resetMs]);

  return { copied, copy };
}
