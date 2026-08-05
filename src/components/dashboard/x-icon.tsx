import React from 'react';

export default function XIcon({ width = 28, height = 28, className = '' }: { width?: number; height?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 28 28" fill="none" className={className}>
      <g filter="url(#filter0_d_2619_6563)">
        <path d="M14 11.05L17.225 14.275C17.375 14.425 17.55 14.5 17.75 14.5C17.95 14.5 18.125 14.425 18.275 14.275C18.425 14.125 18.5 13.95 18.5 13.75C18.5 13.55 18.425 13.375 18.275 13.225L15.05 10L18.275 6.775C18.425 6.625 18.5 6.45 18.5 6.25C18.5 6.05 18.425 5.875 18.275 5.725C18.125 5.575 17.95 5.5 17.75 5.5C17.55 5.5 17.375 5.575 17.225 5.725L14 8.95L10.775 5.725C10.625 5.575 10.45 5.5 10.25 5.5C10.05 5.5 9.875 5.575 9.725 5.725C9.575 5.875 9.5 6.05 9.5 6.25C9.5 6.45 9.575 6.625 9.725 6.775L12.95 10L9.725 13.225C9.575 13.375 9.5 13.55 9.5 13.75C9.5 13.95 9.575 14.125 9.725 14.275C9.875 14.425 10.05 14.5 10.25 14.5C10.45 14.5 10.625 14.425 10.775 14.275L14 11.05ZM14 20C12.6334 20 11.3417 19.7375 10.125 19.2125C8.90835 18.6875 7.84585 17.9708 6.9375 17.0625C6.02917 16.1542 5.3125 15.0917 4.7875 13.875C4.2625 12.6583 4 11.3666 4 10C4 8.61665 4.2625 7.31665 4.7875 6.1C5.3125 4.88335 6.02917 3.825 6.9375 2.925C7.84585 2.025 8.90835 1.3125 10.125 0.7875C11.3417 0.2625 12.6334 0 14 0C15.3834 0 16.6833 0.2625 17.9 0.7875C19.1166 1.3125 20.175 2.025 21.075 2.925C21.975 3.825 22.6875 4.88335 23.2125 6.1C23.7375 7.31665 24 8.61665 24 10C24 11.3666 23.7375 12.6583 23.2125 13.875C22.6875 15.0917 21.975 16.1542 21.075 17.0625C20.175 17.9708 19.1166 18.6875 17.9 19.2125C16.6833 19.7375 15.3834 20 14 20Z" fill="#BF0E0E"/>
      </g>
      <defs>
        <filter id="filter0_d_2619_6563" x="0" y="0" width="28" height="28" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="4"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2619_6563"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2619_6563" result="shape"/>
        </filter>
      </defs>
    </svg>
  );
}
