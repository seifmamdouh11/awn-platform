"use client";

import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  // show after scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center justify-center
        h-12 w-12 rounded-full
        bg-background text-foreground/80
        shadow-foreground
        shadow transition-all duration-300
        hover:scale-110 hover:shadow-xl
        cursor-pointer
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"}
      `}
    >
      <FaArrowUp className="text-sm" />
    </button>
  );
}