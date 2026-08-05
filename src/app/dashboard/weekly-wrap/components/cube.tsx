import { cn } from "@/lib/utils";
import React from "react";

const Cube = ({
  size = 100,
  className,
  rotateX = -30,
  rotateY = 45,
  rotateZ = 0,
}: {
  size?: number;
  className?: string;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
}) => {
  return (
    <div
      className={cn("cube-wrapper", className)}
      style={{
        width: size,
        height: size,
        transformStyle: "preserve-3d",
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
      }}
    >
      {/* Front face */}
      <div
        className="face front blur-sm"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(89, 29, 169, 0.5)",
          transform: `translateZ(${size / 2}px)`,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />
      {/* Back face */}
      <div
        className="face back blur-sm"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(89, 29, 169, 0.3)",
          transform: `translateZ(-${size / 2}px) rotateY(180deg)`,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />
      {/* Right face */}
      <div
        className="face right blur-sm"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(89, 29, 169, 0.4)",
          transform: `translateX(${size / 2}px) rotateY(90deg)`,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />
      {/* Left face */}
      <div
        className="face left blur-sm"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(89, 29, 169, 0.4)",
          transform: `translateX(-${size / 2}px) rotateY(-90deg)`,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />
      {/* Top face */}
      <div
        className="face top blur-sm"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(89, 29, 169, 0.6)",
          transform: `translateY(-${size / 2}px) rotateX(90deg)`,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />
      {/* Bottom face */}
      <div
        className="face bottom blur-sm"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "rgba(89, 29, 169, 0.2)",
          transform: `translateY(${size / 2}px) rotateX(-90deg)`,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />
    </div>
  );
};

export default Cube;
