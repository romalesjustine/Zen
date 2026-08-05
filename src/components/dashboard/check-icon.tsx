import React from 'react';

export default function CheckIcon({ width = 31, height = 28, className = '' }: { width?: number; height?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 31 28" fill="none" className={className}>
      <g filter="url(#filter0_d_2619_6551)">
        <path d="M26.4429 2.94293L23.6429 0.142929C23.5495 0.0513151 23.4238 0 23.2929 0C23.1621 0 23.0364 0.0513151 22.9429 0.142929L11.1429 11.9429C11.0495 12.0345 10.9238 12.0859 10.7929 12.0859C10.6621 12.0859 10.5364 12.0345 10.4429 11.9429L7.64293 9.14293C7.54946 9.05132 7.4238 9 7.29293 9C7.16205 9 7.03639 9.05132 6.94293 9.14293L4.14293 11.9429C4.05132 12.0364 4 12.1621 4 12.2929C4 12.4238 4.05132 12.5495 4.14293 12.6429L10.4429 18.9429C10.5364 19.0345 10.6621 19.0859 10.7929 19.0859C10.9238 19.0859 11.0495 19.0345 11.1429 18.9429L26.4429 3.64293C26.5345 3.54946 26.5859 3.4238 26.5859 3.29293C26.5859 3.16205 26.5345 3.03639 26.4429 2.94293Z" fill="#47942A"/>
      </g>
      <defs>
        <filter id="filter0_d_2619_6551" x="0" y="0" width="30.5859" height="27.0859" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feOffset dy="4"/>
          <feGaussianBlur stdDeviation="2"/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2619_6551"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_2619_6551" result="shape"/>
        </filter>
      </defs>
    </svg>
  );
}
