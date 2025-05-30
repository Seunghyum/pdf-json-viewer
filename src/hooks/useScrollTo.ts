import { useEffect, useRef } from "react";

export default function useScrollTo(key: string | null) {
  const ref = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (key && ref.current[key]) {
      ref.current[key]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [key]);

  return ref;
}
