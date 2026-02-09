import { useEffect } from "react";

export function usePageTitle(title: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | Downtown Irwin, PA` : "Downtown Irwin, PA";

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", description);
      }
    }
  }, [title, description]);
}
