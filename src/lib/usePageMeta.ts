import { useEffect } from "react";
export const SITE_NAME = "AURA";
const DEFAULT_DESCRIPTION =
  "AURA — thoughtfully considered skincare and everyday rituals. A ShopMini interactive e-commerce portfolio concept.";
/** Sets the document title and meta description for the current page. */
export function usePageMeta(title: string, description = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
  }, [title, description]);
}
