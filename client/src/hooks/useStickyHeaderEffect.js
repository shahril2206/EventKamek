import { useEffect, useState } from "react";

export default function useStickyHeaderEffect() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("sentinel");
    const heading = document.querySelector(".heading-container");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          heading.classList.add("bg-[#fefefe]", "shadow-md", "shadow-gray-300");
          setIsSticky(true);
        } else {
          heading.classList.remove("bg-[#fefefe]", "shadow-md", "shadow-gray-300");
          setIsSticky(false);
        }
      },
      { threshold: [0] }
    );

    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, []);

  return isSticky;
}
