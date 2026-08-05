import React from "react";

const Sphere = () => {
  return (
    <div
      className="absolute right-40 z-0 h-52 w-52 animate-[orbit_16s_linear_infinite_reverse] rounded-full delay-500"
      style={{
        background:
          " radial-gradient(56.7% 56.7% at 94.06% 70.62%, var(--P1, #EEE8F6) 0%, rgba(238, 232, 246, 0.00) 100%), radial-gradient(71.43% 71.43% at 92.5% 79.38%, var(--Accent_2, #CB98ED) 0%, rgba(203, 152, 237, 0.00) 100%), radial-gradient(71.43% 71.43% at 92.5% 79.38%, var(--Accent_2, #CB98ED) 0%, rgba(203, 152, 237, 0.00) 100%), radial-gradient(71.43% 71.43% at 92.5% 79.38%, var(--Accent_2, #CB98ED) 0%, rgba(203, 152, 237, 0.00) 100%), radial-gradient(135.33% 83.58% at 6.25% 17.19%, var(--S4, #051960) 0%, rgba(5, 25, 96, 0.00) 100%), radial-gradient(118.72% 128.45% at -5.62% 100%, #000 0%, rgba(0, 0, 0, 0.00) 100%), radial-gradient(118.72% 128.45% at -5.62% 100%, #000 0%, rgba(0, 0, 0, 0.00) 100%), var(--Primary, #591DA9)",
      }}
    />
  );
};

export default Sphere;
