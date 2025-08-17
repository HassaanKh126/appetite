'use client'

import React, { useCallback, useRef } from "react";
import confetti from "canvas-confetti";

const FireworkPage = () => {
  const buttonRef = useRef(null);

  const fireFromElement = useCallback((el) => {
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 3420,
      startVelocity: 40,
      spread: 360,
      origin: { x: originX, y: originY },
    });
  }, []);

  const handleClick = () => {
    fireFromElement(buttonRef.current);
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <button
        ref={buttonRef}
        onClick={handleClick}
        style={{
          padding: "16px 32px",
          fontSize: "18px",
          backgroundColor: "#222",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        Fire Firework
      </button>
    </div>
  );
};

export default FireworkPage;
