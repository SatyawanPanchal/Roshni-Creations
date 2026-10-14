
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    console.log("ScrollToTop triggered:", pathname, hash);
    console.log("Current scroll position:", window.scrollY);

    if (hash) return;

    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      console.log("Scroll position after reset:", window.scrollY);
    });
  }, [pathname, hash]);

  return null;
}
