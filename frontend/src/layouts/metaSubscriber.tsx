// MetaUpdater.tsx
import { useEffect } from "react";
import { useStore } from "@nanostores/react";
import { title, shortDesc, canonical, image } from "@/store/metaHeaders";

const setMeta = (selector: string, attr: string, value?: string) => {
  const el = document.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (el && value) el.setAttribute(attr, value);
};

export default function MetaUpdater() {
  const t = useStore(title);
  const d = useStore(shortDesc);
  const c = useStore(canonical);
  const i = useStore(image);

  useEffect(() => {
    if (!t) return;
    document.title = t;
    setMeta('meta[property="og:title"]', "content", t);
    setMeta('meta[name="twitter:title"]', "content", t);
  }, [t]);

  useEffect(() => {
    if (!d) return;
    setMeta('meta[name="description"]', "content", d);
    setMeta('meta[property="og:description"]', "content", d);
    setMeta('meta[name="twitter:description"]', "content", d);
  }, [d]);

  useEffect(() => {
    if (!c) return;
    setMeta('link[rel="canonical"]', "href", c);
    setMeta('meta[property="og:url"]', "content", c);
    setMeta('meta[name="twitter:url"]', "content", c);
  }, [c]);

  useEffect(() => {
    if (!i) return;
    setMeta('meta[property="og:image"]', "content", i);
    setMeta('meta[name="twitter:image"]', "content", i);
  }, [i]);

  return null;
}
