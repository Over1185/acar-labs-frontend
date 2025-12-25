import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#003366',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="45" fill="white" opacity="0.95" />
          <path
            d="M50 20L65 35H35L50 20Z"
            fill="#003366"
          />
          <circle cx="50" cy="60" r="15" fill="#003366" opacity="0.2" />
          <path
            d="M35 60C35 51.72 41.72 45 50 45C58.28 45 65 51.72 65 60"
            stroke="#003366"
            strokeWidth="4"
            fill="none"
          />
          <circle cx="50" cy="68" r="3" fill="#003366" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
